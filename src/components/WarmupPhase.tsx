import React, { useState } from 'react';
import { Workout } from '../types';

interface Props {
  workout: Workout;
  onSkip: () => void;
  onComplete: () => void;
  renderPhaseIndicator: () => React.ReactNode;
  onExit: () => void;
}

export const WarmupPhase: React.FC<Props> = ({ workout, onSkip, onComplete, renderPhaseIndicator, onExit }) => {
  const [warmupCompleted, setWarmupCompleted] = useState<Set<string>>(new Set());

  const warmupExercises = workout.warmupSection?.exercises || [];
  const warmupDuration = workout.warmupSection?.totalDuration || 0;

  const isWarmupComplete = warmupExercises.length > 0
    ? warmupCompleted.size === warmupExercises.length
    : true;

  const handleWarmupExerciseComplete = (exerciseId: string) => {
    setWarmupCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  if (warmupExercises.length === 0) {
    return null;
  }

  return (
    <div className="active-workout warmup-phase">
      <div className="workout-header-bar">
        <button className="back-btn" onClick={onExit}>← Exit</button>
        <h2>{workout.name}</h2>
      </div>

      {renderPhaseIndicator()}

      <div className="workout-content">
        <div className="phase-section warmup-section-active">
          <div className="phase-section-header">
            <h3>Warm-Up</h3>
            <span className="phase-subtitle">~{Math.round(warmupDuration / 60)} min</span>
          </div>

          <div className="warmup-exercise-list">
            {warmupExercises.map((exercise) => {
              const isCompleted = warmupCompleted.has(exercise.id);
              return (
                <div
                  key={exercise.id}
                  className={`warmup-exercise-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleWarmupExerciseComplete(exercise.id)}
                >
                  <div className="warmup-exercise-check">
                    <span className={`warmup-check-icon ${isCompleted ? 'checked' : ''}`}>
                      {isCompleted ? '✓' : ''}
                    </span>
                  </div>
                  <div className="warmup-exercise-info">
                    <h4>{exercise.name}</h4>
                    <p>{exercise.description}</p>
                    <div className="warmup-exercise-meta">
                      <span className={`warmup-category ${exercise.category}`}>{exercise.category}</span>
                      <span className="warmup-duration">{exercise.duration}s</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="warmup-progress">
            <div className="warmup-progress-bar">
              <div
                className="warmup-progress-fill"
                style={{ width: `${warmupExercises.length > 0 ? (warmupCompleted.size / warmupExercises.length) * 100 : 0}%` }}
              />
            </div>
            <span className="warmup-progress-text">
              {warmupCompleted.size} / {warmupExercises.length} completed
            </span>
          </div>
        </div>

        <div className="workout-actions">
          <button className="secondary-btn" onClick={onSkip}>
            Skip Warm-Up
          </button>
          <button
            className="primary-btn"
            onClick={onComplete}
            disabled={!isWarmupComplete}
          >
            Continue to Strength →
          </button>
        </div>
      </div>
    </div>
  );
};
