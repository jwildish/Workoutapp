import React from 'react';
import { WeekPlan } from '../types';

interface Props {
  weeks: WeekPlan[];
  selectedWeek: number;
  onWeekSelect: (week: number) => void;
}

export const WeekSelector: React.FC<Props> = ({ weeks, selectedWeek, onWeekSelect }) => {
  return (
    <div className="week-selector">
      <h3>8-Week Hypertrophy Program</h3>
      <div className="week-grid">
        {weeks.map((weekPlan) => (
          <button
            key={weekPlan.week}
            className={`week-button ${selectedWeek === weekPlan.week ? 'active' : ''} ${weekPlan.isDeload ? 'deload-week' : ''}`}
            onClick={() => onWeekSelect(weekPlan.week)}
          >
            <span className="week-number">
              Week {weekPlan.week}
              {weekPlan.isDeload && <span className="deload-tag">Deload</span>}
            </span>
            <span className="intensity-bar">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className={`intensity-dot ${i < weekPlan.intensityLevel ? 'filled' : ''} ${weekPlan.isDeload ? 'deload-dot' : ''}`}
                />
              ))}
            </span>
          </button>
        ))}
      </div>
      {weeks[selectedWeek - 1] && (
        <div className={`week-focus ${weeks[selectedWeek - 1].isDeload ? 'deload-focus' : ''}`}>
          <strong>Focus:</strong> {weeks[selectedWeek - 1].focus}
        </div>
      )}
    </div>
  );
};
