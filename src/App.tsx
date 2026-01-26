import React, { useState, useEffect } from 'react';
import { WeekPlan, Workout, WorkoutSettings } from './types';
import { generate8WeekPlan, defaultSettings } from './utils/workoutGenerator';
import { WorkoutSettingsComponent } from './components/WorkoutSettings';
import { WeekSelector } from './components/WeekSelector';
import { WorkoutCard } from './components/WorkoutCard';
import { ActiveWorkout } from './components/ActiveWorkout';
import { exportToText, copyToClipboard, downloadAsPDF, downloadAsText } from './utils/exportPlan';
import './App.css';

type View = 'planner' | 'workout';

function App() {
  const [settings, setSettings] = useState<WorkoutSettings>(defaultSettings);
  const [weekPlans, setWeekPlans] = useState<WeekPlan[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [view, setView] = useState<View>('planner');
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const plan = generate8WeekPlan(settings);
    setWeekPlans(plan);
  }, [settings]);

  const handleStartWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setView('workout');
  };

  const handleWorkoutComplete = () => {
    // Could save progress here
  };

  const handleExitWorkout = () => {
    setActiveWorkout(null);
    setView('planner');
  };

  const handleRegeneratePlan = () => {
    const plan = generate8WeekPlan(settings);
    setWeekPlans(plan);
    setSelectedDay(null);
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
        <h1>Hypertrophy Workout Generator</h1>
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
          onSettingsChange={setSettings}
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
            <li><strong>4 Days/Week:</strong> Upper/Lower split for optimal recovery</li>
            <li><strong>Strength:</strong> 2 exercises, heavy weight, 4-6 reps</li>
            <li><strong>Hypertrophy:</strong> 3 exercises, moderate weight, 8-12 reps</li>
            <li><strong>HIIT:</strong> 8 min with 4 exercises (2+ ab exercises)</li>
            <li><strong>Week 4:</strong> Deload week for recovery</li>
          </ul>
          <h4 style={{marginTop: '15px'}}>Progressive Overload</h4>
          <ul>
            <li>Upper compounds: +2.5kg/week</li>
            <li>Lower compounds: +5kg/week</li>
            <li>Isolation: +1.25kg/week</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
