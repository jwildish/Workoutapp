import React, { useState, useEffect } from 'react';
import { WeekPlan, Workout, WorkoutSettings } from './types';
import { generate8WeekPlan, defaultSettings } from './utils/workoutGenerator';
import { WorkoutSettingsComponent } from './components/WorkoutSettings';
import { WeekSelector } from './components/WeekSelector';
import { WorkoutCard } from './components/WorkoutCard';
import { ActiveWorkout } from './components/ActiveWorkout';
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
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide Settings' : 'Settings'}
          </button>
          <button className="regenerate-btn" onClick={handleRegeneratePlan}>
            Regenerate Plan
          </button>
        </div>
      </header>

      {showSettings && (
        <WorkoutSettingsComponent
          settings={settings}
          onSettingsChange={setSettings}
        />
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
            <li><strong>Strength Phase:</strong> 2 exercises, heavy weight, 3-5 reps</li>
            <li><strong>Hypertrophy Phase:</strong> 3 exercises, moderate weight, 10-15 reps</li>
            <li><strong>HIIT Finisher:</strong> 8 minutes high-intensity intervals</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
