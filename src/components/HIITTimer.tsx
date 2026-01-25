import React, { useState, useEffect, useCallback } from 'react';
import { HIITInterval } from '../types';

interface Props {
  interval: HIITInterval;
  onComplete: () => void;
}

type HIITPhase = 'ready' | 'work' | 'rest' | 'complete';

export const HIITTimer: React.FC<Props> = ({ interval, onComplete }) => {
  const [phase, setPhase] = useState<HIITPhase>('ready');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(3); // 3 second countdown to start
  const [isRunning, setIsRunning] = useState(false);

  const totalTime = (interval.workSeconds + interval.restSeconds) * interval.rounds;

  const handleStart = () => {
    setIsRunning(true);
    setPhase('ready');
    setTimeRemaining(3);
  };

  const moveToNextPhase = useCallback(() => {
    if (phase === 'ready') {
      setPhase('work');
      setTimeRemaining(interval.workSeconds);
    } else if (phase === 'work') {
      if (currentRound >= interval.rounds) {
        setPhase('complete');
        setIsRunning(false);
        onComplete();
      } else {
        setPhase('rest');
        setTimeRemaining(interval.restSeconds);
      }
    } else if (phase === 'rest') {
      setCurrentRound(prev => prev + 1);
      setPhase('work');
      setTimeRemaining(interval.workSeconds);
    }
  }, [phase, currentRound, interval, onComplete]);

  useEffect(() => {
    if (!isRunning || phase === 'complete') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          moveToNextPhase();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phase, moveToNextPhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const completedRounds = currentRound - 1;
    const roundProgress = phase === 'work'
      ? (interval.workSeconds - timeRemaining) / (interval.workSeconds + interval.restSeconds)
      : phase === 'rest'
        ? (interval.workSeconds + interval.restSeconds - timeRemaining) / (interval.workSeconds + interval.restSeconds)
        : 0;
    return ((completedRounds + roundProgress) / interval.rounds) * 100;
  };

  if (!isRunning && phase === 'ready') {
    return (
      <div className="hiit-timer ready-state">
        <h2>HIIT Finisher</h2>
        <div className="hiit-info">
          <h3>{interval.name}</h3>
          <div className="hiit-details">
            <div className="detail">
              <span className="value">{interval.rounds}</span>
              <span className="label">Rounds</span>
            </div>
            <div className="detail">
              <span className="value">{interval.workSeconds}s</span>
              <span className="label">Work</span>
            </div>
            <div className="detail">
              <span className="value">{interval.restSeconds}s</span>
              <span className="label">Rest</span>
            </div>
            <div className="detail">
              <span className="value">{formatTime(totalTime)}</span>
              <span className="label">Total</span>
            </div>
          </div>
        </div>
        <button className="start-hiit-btn" onClick={handleStart}>
          Start HIIT
        </button>
      </div>
    );
  }

  return (
    <div className={`hiit-timer ${phase}`}>
      <div className="hiit-header">
        <h2>{interval.name}</h2>
        <span className="round-indicator">Round {currentRound} of {interval.rounds}</span>
      </div>

      <div className="timer-display">
        {phase === 'ready' && (
          <>
            <div className="phase-label get-ready">GET READY</div>
            <div className="countdown">{timeRemaining}</div>
          </>
        )}

        {phase === 'work' && (
          <>
            <div className="phase-label work">WORK!</div>
            <div className="time-remaining">{timeRemaining}</div>
            <div className="instruction">Go all out!</div>
          </>
        )}

        {phase === 'rest' && (
          <>
            <div className="phase-label rest">REST</div>
            <div className="time-remaining">{timeRemaining}</div>
            <div className="instruction">Catch your breath</div>
          </>
        )}

        {phase === 'complete' && (
          <>
            <div className="phase-label complete">DONE!</div>
            <div className="completion-message">Amazing work!</div>
          </>
        )}
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="rounds-display">
        {Array.from({ length: interval.rounds }).map((_, i) => (
          <div
            key={i}
            className={`round-dot ${i < currentRound - 1 ? 'completed' : ''} ${i === currentRound - 1 ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
