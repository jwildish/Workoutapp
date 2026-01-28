import React, { useState, useEffect } from 'react';
import { WeekPlan, Workout, WorkoutSettings, CompletedWorkout, UserData } from './types';
import { generate8WeekPlan, defaultSettings } from './utils/workoutGenerator';
import { WorkoutSettingsComponent } from './components/WorkoutSettings';
import { WeekSelector } from './components/WeekSelector';
import { WorkoutCard } from './components/WorkoutCard';
import { ActiveWorkout } from './components/ActiveWorkout';
import { Login } from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {
  getOrCreateUser,
  getUserData,
  saveWorkoutPlan,
  saveCompletedWorkout
} from './services/firestoreService';
import { exportToText, copyToClipboard, downloadAsPDF, downloadAsText } from './utils/exportPlan';
import './App.css';

type View = 'planner' | 'workout';

const GUEST_PLAN_KEY = 'hypertrophy_guest_plan';
const GUEST_HISTORY_KEY = 'hypertrophy_guest_history';

function AppContent() {
  const { user, loading: authLoading, isGuest, signOut } = useAuth();
  const [settings, setSettings] = useState<WorkoutSettings>(defaultSettings);
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [view, setView] = useState<View>('planner');
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  // Load user data on auth state change
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      setDataLoading(true);

      if (isGuest) {
        // Guest: load from localStorage
        try {
          const savedPlan = localStorage.getItem(GUEST_PLAN_KEY);
          if (savedPlan) {
            const parsed = JSON.parse(savedPlan);
            setWeekPlans(parsed.plan);
            if (parsed.settings) setSettings(parsed.settings);
          } else {
            const plan = generate8WeekPlan(settings);
            setWeekPlans(plan);
            localStorage.setItem(GUEST_PLAN_KEY, JSON.stringify({ plan, settings }));
          }

          const savedHistory = localStorage.getItem(GUEST_HISTORY_KEY);
          if (savedHistory) {
            setUserData({
              odId: user.uid,
              email: '',
              displayName: 'Guest',
              createdAt: new Date().toISOString(),
              workoutHistory: JSON.parse(savedHistory),
              weightHistory: {}
            });
          }
        } catch {
          const plan = generate8WeekPlan(settings);
          setWeekPlans(plan);
        }
        setDataLoading(false);
        return;
      }

      // Authenticated user: load from Firestore
      try {
        const data = await getOrCreateUser(
          user.uid,
          user.email || '',
          user.displayName || 'User',
          user.photoURL || undefined
        );
        setUserData(data);

        if (data.currentPlan && data.currentPlan.length > 0) {
          setWeekPlans(data.currentPlan);
          if (data.planSettings) {
            setSettings(data.planSettings);
          }
        } else {
          const plan = generate8WeekPlan(settings);
          setWeekPlans(plan);
          await saveWorkoutPlan(user.uid, plan, settings);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        const plan = generate8WeekPlan(settings);
        setWeekPlans(plan);
      } finally {
        setDataLoading(false);
      }
    };

    loadUserData();
  }, [user, isGuest]);

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setView('workout');
  };

  const handleWorkoutComplete = async (completedWorkout: CompletedWorkout) => {
    if (!user) return;

    const workoutWithUserId = {
      ...completedWorkout,
      odId: user.uid
    };

    if (isGuest) {
      // Guest: save to localStorage
      try {
        const savedHistory = localStorage.getItem(GUEST_HISTORY_KEY);
        const history: CompletedWorkout[] = savedHistory ? JSON.parse(savedHistory) : [];
        history.push(workoutWithUserId);
        localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(history));
        setUserData(prev => prev ? {
          ...prev,
          workoutHistory: history
        } : null);
      } catch (error) {
        console.error('Error saving guest workout:', error);
      }
    } else {
      // Authenticated: save to Firestore
      try {
        await saveCompletedWorkout(user.uid, workoutWithUserId);
        const updatedData = await getUserData(user.uid);
        if (updatedData) {
          setUserData(updatedData);
        }
      } catch (error) {
        console.error('Error saving completed workout:', error);
      }
    }
  };

  const handleExitWorkout = () => {
    setActiveWorkout(null);
    setView('planner');
  };

  const savePlan = async (plan: WeekPlan[], planSettings: WorkoutSettings) => {
    if (isGuest) {
      localStorage.setItem(GUEST_PLAN_KEY, JSON.stringify({ plan, settings: planSettings }));
    } else if (user) {
      try {
        await saveWorkoutPlan(user.uid, plan, planSettings);
      } catch (error) {
        console.error('Error saving plan:', error);
      }
    }
  };

  const handleRegeneratePlan = async () => {
    const plan = generate8WeekPlan(settings);
    setWeekPlans(plan);
    setSelectedDay(null);
    await savePlan(plan, settings);
  };

  const handleSettingsChange = async (newSettings: WorkoutSettings) => {
    setSettings(newSettings);
    const plan = generate8WeekPlan(newSettings);
    setWeekPlans(plan);
    await savePlan(plan, newSettings);
  };

  const handleCopyToClipboard = async () => {
    const text = exportToText(weekPlans, settings);
    const success = await copyToClipboard(text);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    downloadAsPDF(weekPlans, settings);
  };

  const handleDownloadText = () => {
    downloadAsText(weekPlans, settings);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserData(null);
      setWeekPlans([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading state
  if (authLoading || dataLoading) {
    return (
      <div className="app loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  const currentWeekPlan = weekPlans[selectedWeek - 1];

  if (view === 'workout' && activeWorkout) {
    return (
      <ActiveWorkout
        workout={activeWorkout}
        onComplete={handleWorkoutComplete}
        onExit={handleExitWorkout}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="user-info">
            {user.photoURL && !isGuest && (
              <img src={user.photoURL} alt="Profile" className="user-avatar" />
            )}
            {isGuest && <span className="guest-avatar">G</span>}
            <span className="user-name">{isGuest ? 'Guest' : user.displayName}</span>
            {isGuest && <span className="guest-badge">Data saved locally only</span>}
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            {isGuest ? 'Exit' : 'Sign Out'}
          </button>
        </div>
        <h1>Hypertrophy Trainer</h1>
        <p className="subtitle">8-Week Progressive Training Program</p>
        <div className="header-actions">
          <button
            className="settings-toggle"
            onClick={() => { setShowSettings(!showSettings); setShowExport(false); }}
          >
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
          <button
            className="export-toggle"
            onClick={() => { setShowExport(!showExport); setShowSettings(false); }}
          >
            {showExport ? 'Hide Export' : 'Export Plan'}
          </button>
          <button className="regenerate-btn" onClick={handleRegeneratePlan}>
            Regenerate
          </button>
        </div>
      </header>

      {showSettings && (
        <WorkoutSettingsComponent
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      )}

      {showExport && (
        <div className="export-panel">
          <h3>Export Your Plan</h3>
          <p>Save your 8-week program with all exercises and weight suggestions.</p>
          <div className="export-buttons">
            <button onClick={handleCopyToClipboard} className="export-btn copy-btn">
              {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
              <span className="export-hint">Paste into Apple Notes</span>
            </button>
            <button onClick={handleDownloadText} className="export-btn text-btn">
              Download as Text
              <span className="export-hint">.txt file</span>
            </button>
            <button onClick={handleDownloadPDF} className="export-btn pdf-btn">
              Print / Save as PDF
              <span className="export-hint">Opens print dialog</span>
            </button>
          </div>
        </div>
      )}

      {/* Workout History Summary */}
      {userData && userData.workoutHistory && userData.workoutHistory.length > 0 && (
        <div className="workout-history-summary">
          <h4>Recent Activity</h4>
          <div className="history-stats">
            <div className="stat">
              <span className="stat-value">{userData.workoutHistory.length}</span>
              <span className="stat-label">Workouts Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Math.round(userData.workoutHistory.reduce((acc, w) => acc + w.duration, 0) / 60)}h
              </span>
              <span className="stat-label">Total Time</span>
            </div>
          </div>
        </div>
      )}

      <main className="app-main">
        {weekPlans.length > 0 && (
          <>
            <WeekSelector
              weeks={weekPlans}
              selectedWeek={selectedWeek}
              onWeekSelect={setSelectedWeek}
            />

            <div className="day-selector">
              <h3>Select Workout Day</h3>
              <div className="day-buttons">
                {currentWeekPlan?.workouts.map((workout, index) => (
                  <button
                    key={workout.id}
                    className={`day-button ${selectedDay === index ? 'active' : ''}`}
                    onClick={() => setSelectedDay(index)}
                  >
                    Day {index + 1}
                    <span className="day-name">
                      {workout.name.split(' - ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {selectedDay !== null && currentWeekPlan?.workouts[selectedDay] && (
              <div className="workout-preview">
                <WorkoutCard
                  workout={currentWeekPlan.workouts[selectedDay]}
                  onStartWorkout={handleStartWorkout}
                />
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="program-info">
          <h4>Program Structure</h4>
          <ul>
            <li><strong>4 Days/Week:</strong> Push/Pull split with legs</li>
            <li><strong>Strength:</strong> 2 exercises, heavy weight, 4-6 reps</li>
            <li><strong>Hypertrophy:</strong> 3 exercises, moderate weight, 8-12 reps</li>
            <li><strong>HIIT:</strong> 8 min Tabata (20s work / 10s rest)</li>
            <li><strong>Week 4:</strong> Deload week for recovery</li>
          </ul>
          <h4 style={{marginTop: '15px'}}>Progressive Overload</h4>
          <ul>
            <li>Upper compounds: +5lbs/week</li>
            <li>Lower compounds: +10lbs/week</li>
            <li>Isolation: +2.5lbs/week</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
