import React, { useState } from 'react';
import { Workout, WeightEntry } from '../types';
import { saveWeight, getSuggestedWeightForWeek } from '../utils/weightTracking';
import './WorkoutCard.css';

interface Props {
  workout: Workout;
  onStartWorkout: (workout: Workout) => void;
}

export const WorkoutCard: React.FC<Props> = ({ workout, onStartWorkout }) => {
  const [weights, setWeights] = useState<Record<string, string>>({});

  const handleWeightChange = (exerciseId: string, value: string) => {
    setWeights(prev => ({ ...prev, [exerciseId]: value }));
  };

  const handleWeightSave = (exerciseId: string) => {
    const weightValue = parseFloat(weights[exerciseId]);
    if (isNaN(weightValue)) return;

    const entry: WeightEntry = {
      exerciseId,
      week: workout.week,
      day: workout.day,
      weight: weightValue,
      reps: 0,
      date: new Date().toISOString(),
    };
    saveWeight(entry);
  };

  const getSuggested = (exerciseId: string, isCompound: boolean, muscleGroup: string): string => {
    const isLower = ['quads', 'hamstrings', 'glutes'].includes(muscleGroup);
    const suggested = getSuggestedWeightForWeek(
      exerciseId,
      workout.week,
      isCompound,
      isLower,
      workout.isDeload
    );
    return suggested ? `${suggested}` : '';
  };

  return (
    <div className={`workout-card ${workout.isDeload ? 'deload' : ''}`}>
      <div className="workout-header">
        <div>
          <h4>{workout.name}</h4>
          {workout.isDeload && <span className="deload-badge">DELOAD WEEK</span>}
        </div>
        <span className="workout-duration">{workout.totalDurationMinutes} min</span>
      </div>

      <div className="workout-targets">
        {workout.targetMuscles.map((muscle) => (
          <span key={muscle} className="muscle-tag">
            {muscle}
          </span>
        ))}
      </div>

      <div className="workout-sections">
        {workout.warmupSection?.exercises?.length > 0 && (
          <div className="section warmup-section">
            <h5>Warm-Up ({Math.round(workout.warmupSection.totalDuration / 60)} min)</h5>
            <div className="warmup-exercises">
              {workout.warmupSection.exercises.map((ex) => (
                <span key={ex.id} className={`warmup-tag ${ex.category}`}>
                  {ex.name} ({ex.duration}s)
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="section strength-section">
          <h5>Strength (Heavy/Low Volume)</h5>
          <ul>
            {workout.strengthExercises.map((ex) => {
              const suggested = getSuggested(ex.id, ex.isCompound, ex.muscleGroup);
              return (
                <li key={ex.id}>
                  <div className="exercise-info">
                    <span className="exercise-name">{ex.name}</span>
                    <span className="exercise-details">
                      {ex.sets} x {ex.reps} | Rest: {ex.restSeconds}s
                    </span>
                  </div>
                  <div className="weight-input-group">
                    <input
                      type="number"
                      step="0.5"
                      placeholder={suggested || 'lbs'}
                      value={weights[ex.id] || ''}
                      onChange={(e) => handleWeightChange(ex.id, e.target.value)}
                      onBlur={() => handleWeightSave(ex.id)}
                      className="weight-input"
                    />
                    <span className="weight-unit">lbs</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="section hypertrophy-section">
          <h5>Hypertrophy (Moderate/High Volume)</h5>
          <ul>
            {workout.hypertrophyExercises.map((ex) => {
              const suggested = getSuggested(ex.id, ex.isCompound, ex.muscleGroup);
              return (
                <li key={ex.id}>
                  <div className="exercise-info">
                    <span className="exercise-name">{ex.name}</span>
                    <span className="exercise-details">
                      {ex.sets} x {ex.reps} | Rest: {ex.restSeconds}s
                    </span>
                  </div>
                  <div className="weight-input-group">
                    <input
                      type="number"
                      step="0.5"
                      placeholder={suggested || 'lbs'}
                      value={weights[ex.id] || ''}
                      onChange={(e) => handleWeightChange(ex.id, e.target.value)}
                      onBlur={() => handleWeightSave(ex.id)}
                      className="weight-input"
                    />
                    <span className="weight-unit">lbs</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {workout.correctivesSection?.exercises?.length > 0 && (
          <div className="section correctives-section">
            <h5>Correctives ({Math.round(workout.correctivesSection.totalDuration / 60)} min)</h5>
            <div className="correctives-exercises">
              {workout.correctivesSection.exercises.map((ex) => (
                <span key={ex.id} className="correctives-tag">
                  {ex.name} {ex.reps && `(${ex.reps})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {workout.hiitSection?.exercises?.length > 0 && (
          <div className="section hiit-section">
            <h5>HIIT Finisher (8 min)</h5>
            <div className="hiit-format">
              Mixed intervals: 20-40s work / 10-20s rest x {workout.hiitSection.rounds} rounds
            </div>
            <div className="hiit-exercises">
              {workout.hiitSection.exercises.map((ex, idx) => (
                <span
                  key={idx}
                  className={`hiit-exercise-tag ${ex.muscleGroup === 'core' ? 'core-exercise' : ''}`}
                >
                  {ex.muscleGroup === 'core' && '🔥 '}
                  {ex.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {workout.yogaSection?.exercises?.length > 0 && (
          <div className="section yoga-section">
            <h5>Yoga Flow ({Math.round(workout.yogaSection.totalDuration / 60)} min)</h5>
            <div className="yoga-exercises">
              {workout.yogaSection.exercises.map((ex) => (
                <span key={ex.id} className="yoga-tag">
                  {ex.name} ({ex.duration}s)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="start-workout-btn" onClick={() => onStartWorkout(workout)}>
        Start Workout
      </button>
    </div>
  );
};
