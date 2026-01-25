import React from 'react';
import { Workout } from '../types';

interface Props {
  workout: Workout;
  onStartWorkout: (workout: Workout) => void;
}

export const WorkoutCard: React.FC<Props> = ({ workout, onStartWorkout }) => {
  return (
    <div className="workout-card">
      <div className="workout-header">
        <h4>{workout.name}</h4>
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
        <div className="section strength-section">
          <h5>Strength (Heavy/Low Volume)</h5>
          <ul>
            {workout.strengthExercises.map((ex) => (
              <li key={ex.id}>
                <span className="exercise-name">{ex.name}</span>
                <span className="exercise-details">
                  {ex.sets} x {ex.reps} | Rest: {ex.restSeconds}s
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section hypertrophy-section">
          <h5>Hypertrophy (Moderate/High Volume)</h5>
          <ul>
            {workout.hypertrophyExercises.map((ex) => (
              <li key={ex.id}>
                <span className="exercise-name">{ex.name}</span>
                <span className="exercise-details">
                  {ex.sets} x {ex.reps} | Rest: {ex.restSeconds}s
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="section hiit-section">
          <h5>HIIT Finisher (8 min)</h5>
          <p>
            <strong>{workout.hiitSection.name}</strong>
            <br />
            {workout.hiitSection.rounds} rounds: {workout.hiitSection.workSeconds}s work / {workout.hiitSection.restSeconds}s rest
          </p>
        </div>
      </div>

      <button className="start-workout-btn" onClick={() => onStartWorkout(workout)}>
        Start Workout
      </button>
    </div>
  );
};
