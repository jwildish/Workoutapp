import React, { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, WorkoutPhase, ExerciseSet, ExerciseLog, CompletedWorkout } from '../types';
import { HIITTimer } from './HIITTimer';
import { RestTimer } from './RestTimer';

interface Props {
  workout: Workout;
  onComplete: (completedWorkout: CompletedWorkout) => void;
  onExit: () => void;
}

interface SetData {
  weight: string;
  reps: string;
  completed: boolean;
}

interface ExerciseData {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  isStrength: boolean;
  sets: SetData[];
}

export const ActiveWorkout: React.FC<Props> = ({ workout, onComplete, onExit }) => {
  const [phase, setPhase] = useState<WorkoutPhase>('strength');
  const [exerciseData, setExerciseData] = useState<Map<string, ExerciseData>>(new Map());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restDuration, setRestDuration] = useState(0);
  const [currentRestExercise, setCurrentRestExercise] = useState('');
  const [startTime] = useState<Date>(new Date());
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Initialize exercise data with default sets
  useEffect(() => {
    const data = new Map<string, ExerciseData>();

    workout.strengthExercises.forEach(ex => {
      data.set(ex.id, {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        isStrength: true,
        sets: Array.from({ length: ex.sets }, () => ({
          weight: '',
          reps: ex.reps.split('-')[0], // Use lower bound of rep range
          completed: false
        }))
      });
    });

    workout.hypertrophyExercises.forEach(ex => {
      data.set(ex.id, {
        exerciseId: ex.id,
        exerciseName: ex.name,
        muscleGroup: ex.muscleGroup,
        isStrength: false,
        sets: Array.from({ length: ex.sets }, () => ({
          weight: '',
          reps: ex.reps.split('-')[0],
          completed: false
        }))
      });
    });

    setExerciseData(data);

    // Auto-expand first exercise
    if (workout.strengthExercises.length > 0) {
      setExpandedExercise(workout.strengthExercises[0].id);
    }
  }, [workout]);

  const updateSetData = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setExerciseData(prev => {
      const newData = new Map(prev);
      const exercise = newData.get(exerciseId);
      if (exercise) {
        const newSets = [...exercise.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: value };
        newData.set(exerciseId, { ...exercise, sets: newSets });
      }
      return newData;
    });
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number, restSeconds: number) => {
    setExerciseData(prev => {
      const newData = new Map(prev);
      const exercise = newData.get(exerciseId);
      if (exercise) {
        const newSets = [...exercise.sets];
        const wasCompleted = newSets[setIndex].completed;
        newSets[setIndex] = { ...newSets[setIndex], completed: !wasCompleted };
        newData.set(exerciseId, { ...exercise, sets: newSets });

        // Start rest timer if completing a set (not uncompleting)
        if (!wasCompleted && setIndex < newSets.length - 1) {
          setRestDuration(restSeconds);
          setCurrentRestExercise(exercise.exerciseName);
          setShowRestTimer(true);
        }
      }
      return newData;
    });
  };

  const isExerciseComplete = (exerciseId: string): boolean => {
    const exercise = exerciseData.get(exerciseId);
    if (!exercise) return false;
    return exercise.sets.every(set => set.completed);
  };

  const getCompletedSetsCount = (exerciseId: string): number => {
    const exercise = exerciseData.get(exerciseId);
    if (!exercise) return 0;
    return exercise.sets.filter(set => set.completed).length;
  };

  const isPhaseComplete = (phaseType: 'strength' | 'hypertrophy'): boolean => {
    const exercises = phaseType === 'strength' ? workout.strengthExercises : workout.hypertrophyExercises;
    return exercises.every(ex => isExerciseComplete(ex.id));
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
  };

  const handleHIITComplete = () => {
    finishWorkout(true);
  };

  const handleSkipToHIIT = () => {
    setPhase('hiit');
  };

  const finishWorkout = (hiitCompleted: boolean) => {
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    const exercises: ExerciseLog[] = [];

    exerciseData.forEach(ex => {
      exercises.push({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup as any,
        isStrength: ex.isStrength,
        sets: ex.sets.map((set, i) => ({
          setNumber: i + 1,
          weight: parseFloat(set.weight) || 0,
          reps: parseInt(set.reps) || 0,
          completed: set.completed
        }))
      });
    });

    const completedWorkout: CompletedWorkout = {
      id: `${workout.id}-${Date.now()}`,
      odId: '', // Will be filled by parent
      week: workout.week,
      day: workout.day,
      workoutName: workout.name,
      completedAt: endTime.toISOString(),
      duration,
      exercises,
      hiitCompleted
    };

    setPhase('complete');
    onComplete(completedWorkout);
  };

  const renderPhaseIndicator = () => (
    <div className="phase-indicator">
      <div className={`phase-dot ${phase === 'strength' ? 'active' : ''} ${isPhaseComplete('strength') || ['hypertrophy', 'hiit', 'complete'].includes(phase) ? 'completed' : ''}`}>
        <span>1</span>
        <label>Strength</label>
      </div>
      <div className="phase-line" />
      <div className={`phase-dot ${phase === 'hypertrophy' ? 'active' : ''} ${isPhaseComplete('hypertrophy') || ['hiit', 'complete'].includes(phase) ? 'completed' : ''}`}>
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

  const renderExerciseCard = (exercise: WorkoutExercise, isStrength: boolean) => {
    const exData = exerciseData.get(exercise.id);
    if (!exData) return null;

    const isExpanded = expandedExercise === exercise.id;
    const completedSets = getCompletedSetsCount(exercise.id);
    const totalSets = exercise.sets;
    const isComplete = completedSets === totalSets;

    return (
      <div
        key={exercise.id}
        className={`exercise-card-strong ${isComplete ? 'completed' : ''} ${isExpanded ? 'expanded' : ''}`}
      >
        <div
          className="exercise-card-header"
          onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
        >
          <div className="exercise-info">
            <span className={`completion-check ${isComplete ? 'visible' : ''}`}>✓</span>
            <div>
              <h4>{exercise.name}</h4>
              <span className="muscle-tag-small">{exercise.muscleGroup}</span>
            </div>
          </div>
          <div className="sets-summary">
            {completedSets}/{totalSets} sets
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
          </div>
        </div>

        {isExpanded && (
          <div className="exercise-sets-container">
            <div className="sets-header">
              <span className="set-col">SET</span>
              <span className="previous-col">PREVIOUS</span>
              <span className="weight-col">LBS</span>
              <span className="reps-col">REPS</span>
              <span className="check-col"></span>
            </div>

            {exData.sets.map((set, index) => (
              <div
                key={index}
                className={`set-row ${set.completed ? 'completed' : ''}`}
              >
                <span className="set-col">{index + 1}</span>
                <span className="previous-col">-</span>
                <input
                  type="number"
                  className="weight-input-strong"
                  placeholder="0"
                  value={set.weight}
                  onChange={(e) => updateSetData(exercise.id, index, 'weight', e.target.value)}
                />
                <input
                  type="number"
                  className="reps-input-strong"
                  placeholder={exercise.reps.split('-')[0]}
                  value={set.reps}
                  onChange={(e) => updateSetData(exercise.id, index, 'reps', e.target.value)}
                />
                <button
                  className={`set-check-btn ${set.completed ? 'checked' : ''}`}
                  onClick={() => toggleSetComplete(exercise.id, index, exercise.restSeconds)}
                >
                  ✓
                </button>
              </div>
            ))}

            <div className="exercise-notes">
              <span className="weight-hint">
                {isStrength ? 'Heavy (RPE 8-9)' : 'Moderate (RPE 7-8)'} • Rest: {exercise.restSeconds}s
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (phase === 'complete') {
    return (
      <div className="active-workout complete">
        <div className="completion-screen">
          <div className="completion-icon">✓</div>
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
          <button className="back-btn" onClick={onExit}>← Exit</button>
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
          <button className="back-btn" onClick={onExit}>← Exit</button>
          <h2>{workout.name}</h2>
        </div>
        {renderPhaseIndicator()}
        <RestTimer
          duration={restDuration}
          onComplete={handleRestComplete}
          exerciseName={currentRestExercise}
        />
      </div>
    );
  }

  return (
    <div className="active-workout strong-style">
      <div className="workout-header-bar">
        <button className="back-btn" onClick={onExit}>← Exit</button>
        <h2>{workout.name}</h2>
      </div>

      {renderPhaseIndicator()}

      <div className="workout-content">
        {/* Strength Section */}
        <div className="phase-section">
          <div className="phase-section-header">
            <h3>Strength</h3>
            <span className="phase-subtitle">Heavy weight, low reps</span>
          </div>
          {workout.strengthExercises.map(ex => renderExerciseCard(ex, true))}
        </div>

        {/* Hypertrophy Section */}
        <div className="phase-section">
          <div className="phase-section-header">
            <h3>Hypertrophy</h3>
            <span className="phase-subtitle">Moderate weight, higher reps</span>
          </div>
          {workout.hypertrophyExercises.map(ex => renderExerciseCard(ex, false))}
        </div>

        {/* Action Buttons */}
        <div className="workout-actions">
          <button
            className="secondary-btn"
            onClick={handleSkipToHIIT}
          >
            Skip to HIIT
          </button>
          <button
            className="primary-btn"
            onClick={handleSkipToHIIT}
            disabled={!isPhaseComplete('strength') || !isPhaseComplete('hypertrophy')}
          >
            Continue to HIIT →
          </button>
        </div>
      </div>
    </div>
  );
};
