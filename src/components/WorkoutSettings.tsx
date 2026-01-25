import React from 'react';
import { WorkoutSettings as Settings } from '../types';

interface Props {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const WorkoutSettingsComponent: React.FC<Props> = ({ settings, onSettingsChange }) => {
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 30 && value <= 120) {
      onSettingsChange({ ...settings, workoutDurationMinutes: value });
    }
  };

  const handleFitnessLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      fitnessLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced',
    });
  };

  return (
    <div className="settings-panel">
      <h3>Workout Settings</h3>

      <div className="setting-group">
        <label htmlFor="duration">
          Workout Duration: {settings.workoutDurationMinutes} minutes
        </label>
        <input
          id="duration"
          type="range"
          min="30"
          max="120"
          step="5"
          value={settings.workoutDurationMinutes}
          onChange={handleDurationChange}
        />
        <div className="duration-labels">
          <span>30 min</span>
          <span>120 min</span>
        </div>
      </div>

      <div className="setting-group">
        <label htmlFor="fitness-level">Fitness Level</label>
        <select
          id="fitness-level"
          value={settings.fitnessLevel}
          onChange={handleFitnessLevelChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    </div>
  );
};
