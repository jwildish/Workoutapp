import React, { useState, useEffect } from 'react';

interface Props {
  duration: number;
  onComplete: () => void;
  exerciseName: string;
}

export const RestTimer: React.FC<Props> = ({ duration, onComplete, exerciseName }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className="rest-timer">
      <h2>Rest Period</h2>
      <p className="next-up">Next: {exerciseName}</p>

      <div className="timer-circle">
        <svg viewBox="0 0 100 100">
          <circle
            className="timer-bg"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
          />
          <circle
            className="timer-progress"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="timer-text">{formatTime(timeRemaining)}</div>
      </div>

      <button className="skip-rest-btn" onClick={onComplete}>
        Skip Rest
      </button>
    </div>
  );
};
