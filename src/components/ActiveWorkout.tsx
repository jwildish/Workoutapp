import React, { useState } from 'react';
import { Workout, WorkoutExercise, WorkoutPhase } from '../types';
import { HIITTimer } from './HIITTimer';
import { RestTimer } from './RestTimer';

interface Props {
  workout: Workout;
  onComplete: () => void;
  onExit: () => void;
}

interface ExerciseState {
  currentSetIndex: number;
  completed: boolean;
}

export const ActiveWorkout: React.FC<Props> = ({ workout, onComplete, onExit }) => {
  const [phase, setPhase] = useState<WorkoutPhase>('strength');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState<Map<string, ExerciseState>>(new Map());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(0);

  const getCurrentExercises = (): WorkoutExercise[] => {
    if (phase === 'strength') return workout.strengthExercises;
    if (phase === 'hypertrophy') return workout.hypertrophyExercises;
    return [];
  };

  const currentExercises = getCurrentExercises();
  const currentExercise = currentExercises[currentExerciseIndex];

  const getExerciseState = (exerciseId: string): ExerciseState => {
    return exerciseStates.get(exerciseId) || { currentSetIndex: 0, completed: false };
  };

  const handleSetComplete = () => {
    if (!currentExercise) return;

    const state = getExerciseState(currentExercise.id);
    const newSetIndex = state.currentSetIndex + 1;

    if (newSetIndex >= currentExercise.sets) {
      // Exercise completed
      setExerciseStates(new Map(exerciseStates.set(currentExercise.id, {
        currentSetIndex: newSetIndex,
        completed: true,
      })));

      // Move to next exercise or phase
      if (currentExerciseIndex < currentExercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else if (phase === 'strength') {
        setPhase('hypertrophy');
        setCurrentExerciseIndex(0);
      } else if (phase === 'hypertrophy') {
        setPhase('hiit');
      }
    } else {
      // Start rest timer
      setExerciseStates(new Map(exerciseStates.set(currentExercise.id, {
        ...state,
        currentSetIndex: newSetIndex,
      })));
      setRestDuration(currentExercise.restSeconds);
      setShowRestTimer(true);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
  };

  const handleHIITComplete = () => {
    setPhase('complete');
    onComplete();
  };

  const renderPhaseIndicator = () => (
    <div className="phase-indicator">
      <div className={`phase-dot ${phase === 'strength' ? 'active' : ''} ${['hypertrophy', 'hiit', 'complete'].includes(phase) ? 'completed' : ''}`}>
        <span>1</span>
        <label>Strength</label>
      </div>
      <div className="phase-line" />
      <div className={`phase-dot ${phase === 'hypertrophy' ? 'active' : ''} ${['hiit', 'complete'].includes(phase) ? 'completed' : ''}`}>
        <span>2</span>
        <label>Hypertrophy</label>
      </div>
      <div className="phase-line" />
      <div className={`phase-dot ${phase === 'hiit' ? 'active' : ''} ${phase === 'complete' ? 'completed' : ''}`}>
        <span>3</span>
        <label>HIIT</label>
      </div>
    </div>
  );

  if (phase === 'complete') {
    return (
      <div className="active-workout complete">
        <div className="completion-screen">
          <div className="completion-icon">&#10003;</div>
          <h2>Workout Complete!</h2>
          <p>Great job finishing {workout.name}</p>
          <button className="primary-btn" onClick={onExit}>
            Back to Plan
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'hiit') {
    return (
      <div className="active-workout">
        <div className="workout-header-bar">
          <button className="back-btn" onClick={onExit}>&larr; Exit</button>
          <h2>{workout.name}</h2>
        </div>
        {renderPhaseIndicator()}
        <HIITTimer
          hiitSection={workout.hiitSection}
          onComplete={handleHIITComplete}
        />
      </div>
    );
  }

  if (showRestTimer) {
    return (
      <div className="active-workout">
        <div className="workout-header-bar">
          <button className="back-btn" onClick={onExit}>&larr; Exit</button>
          <h2>{workout.name}</h2>
        </div>
        {renderPhaseIndicator()}
        <RestTimer
          duration={restDuration}
          onComplete={handleRestComplete}
          exerciseName={currentExercise?.name || ''}
        />
      </div>
    );
  }

  const state = currentExercise ? getExerciseState(currentExercise.id) : { currentSetIndex: 0, completed: false };

  return (
    <div className="active-workout">
      <div className="workout-header-bar">
        <button className="back-btn" onClick={onExit}>&larr; Exit</button>
        <h2>{workout.name}</h2>
      </div>

      {renderPhaseIndicator()}

      <div className="current-phase-label">
        <h3>{phase === 'strength' ? 'Strength Phase' : 'Hypertrophy Phase'}</h3>
        <p>{phase === 'strength' ? 'Heavy weight, low reps - focus on strength' : 'Moderate weight, higher reps - focus on muscle growth'}</p>
      </div>

      {currentExercise && (
        <div className="current-exercise">
          <div className="exercise-progress">
            Exercise {currentExerciseIndex + 1} of {currentExercises.length}
          </div>

          <h2 className="exercise-title">{currentExercise.name}</h2>
          <p className="exercise-description">{currentExercise.description}</p>

          <div className="exercise-stats">
            <div className="stat">
              <span className="stat-value">{currentExercise.sets}</span>
              <span className="stat-label">Sets</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentExercise.reps}</span>
              <span className="stat-label">Reps</span>
            </div>
            <div className="stat">
              <span className="stat-value">{currentExercise.restSeconds}s</span>
              <span className="stat-label">Rest</span>
            </div>
          </div>

          <div className="weight-recommendation">
            <strong>Weight:</strong> {currentExercise.weight}
          </div>

          <div className="sets-tracker">
            {Array.from({ length: currentExercise.sets }).map((_, i) => (
              <div
                key={i}
                className={`set-indicator ${i < state.currentSetIndex ? 'completed' : ''} ${i === state.currentSetIndex ? 'current' : ''}`}
              >
                Set {i + 1}
              </div>
            ))}
          </div>

          <button className="complete-set-btn" onClick={handleSetComplete}>
            Complete Set {state.currentSetIndex + 1}
          </button>
        </div>
      )}
    </div>
  );
};
