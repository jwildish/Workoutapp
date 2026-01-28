import React, { useState, useEffect, useCallback } from 'react';
import { HIITSection } from '../types';
import './HIITTimer.css';

interface Props {
  hiitSection: HIITSection;
  onComplete: () => void;
}

type HIITPhase = 'ready' | 'work' | 'rest' | 'complete';

export const HIITTimer: React.FC<Props> = ({ hiitSection, onComplete }) => {
  const [phase, setPhase] = useState<HIITPhase>('ready');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [isRunning, setIsRunning] = useState(false);

  const exercises = hiitSection.exercises;
  const totalExercises = exercises.length;
  const totalTime = hiitSection.totalDuration;

  const currentExercise = exercises[currentExerciseIndex];

  const handleStart = () => {
    setIsRunning(true);
    setPhase('ready');
    setTimeRemaining(3);
  };

  const moveToNextPhase = useCallback(() => {
    if (phase === 'ready') {
      setPhase('work');
      // Use per-exercise work duration
      setTimeRemaining(exercises[0].duration);
    } else if (phase === 'work') {
      // Move to rest after work - use per-exercise rest duration
      setPhase('rest');
      setTimeRemaining(currentExercise.restSeconds);
    } else if (phase === 'rest') {
      // Move to next exercise or next round
      const nextExerciseIndex = currentExerciseIndex + 1;

      if (nextExerciseIndex >= totalExercises) {
        // Completed all exercises in this round
        if (currentRound >= hiitSection.rounds) {
          // Completed all rounds
          setPhase('complete');
          setIsRunning(false);
          onComplete();
        } else {
          // Start next round
          setCurrentRound(prev => prev + 1);
          setCurrentExerciseIndex(0);
          setPhase('work');
          // Use first exercise's work duration for new round
          setTimeRemaining(exercises[0].duration);
        }
      } else {
        // Move to next exercise
        setCurrentExerciseIndex(nextExerciseIndex);
        setPhase('work');
        // Use next exercise's work duration
        setTimeRemaining(exercises[nextExerciseIndex].duration);
      }
    }
  }, [phase, currentRound, currentExerciseIndex, totalExercises, exercises, currentExercise, hiitSection.rounds, onComplete]);

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
    const totalCycles = hiitSection.rounds * totalExercises;
    const completedCycles = (currentRound - 1) * totalExercises + currentExerciseIndex;
    const currentWorkTime = currentExercise?.duration || 30;
    const currentRestTime = currentExercise?.restSeconds || 15;
    const cycleProgress = phase === 'work'
      ? (currentWorkTime - timeRemaining) / (currentWorkTime + currentRestTime)
      : phase === 'rest'
        ? (currentWorkTime + currentRestTime - timeRemaining) / (currentWorkTime + currentRestTime)
        : 0;
    return ((completedCycles + cycleProgress) / totalCycles) * 100;
  };

  if (!isRunning && phase === 'ready') {
    return (
      <div className="hiit-timer ready-state">
        <h2>HIIT Finisher</h2>
        <div className="hiit-info">
          <h3>{exercises.length} Exercises Circuit</h3>
          <div className="hiit-exercise-list">
            {exercises.map((ex, idx) => (
              <span
                key={idx}
                className={`hiit-exercise-preview ${ex.muscleGroup === 'core' ? 'core-exercise' : ''}`}
              >
                {ex.muscleGroup === 'core' && '🔥 '}
                {ex.name}
              </span>
            ))}
          </div>
          <div className="hiit-details">
            <div className="detail">
              <span className="value">{hiitSection.rounds}</span>
              <span className="label">Rounds</span>
            </div>
            <div className="detail">
              <span className="value">20-40s</span>
              <span className="label">Work</span>
            </div>
            <div className="detail">
              <span className="value">10-20s</span>
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
        <h2>Round {currentRound} of {hiitSection.rounds}</h2>
        <span className="round-indicator">
          Exercise {currentExerciseIndex + 1} of {totalExercises}
        </span>
      </div>

      <div className="timer-display">
        {phase === 'ready' && (
          <>
            <div className="phase-label get-ready">GET READY</div>
            <div className="countdown">{timeRemaining}</div>
            <div className="instruction">First up: {exercises[0].name}</div>
          </>
        )}

        {phase === 'work' && (
          <>
            <div className="phase-label work">WORK!</div>
            <div className="current-exercise-name">
              {currentExercise.muscleGroup === 'core' && '🔥 '}
              {currentExercise.name}
            </div>
            <div className="time-remaining">{timeRemaining}</div>
            <div className="instruction">Go all out!</div>
          </>
        )}

        {phase === 'rest' && (
          <>
            <div className="phase-label rest">REST</div>
            <div className="time-remaining">{timeRemaining}</div>
            <div className="instruction">
              Next: {exercises[(currentExerciseIndex + 1) % totalExercises]?.name || exercises[0].name}
            </div>
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

      <div className="exercise-indicators">
        {exercises.map((ex, i) => (
          <div
            key={i}
            className={`exercise-dot ${i < currentExerciseIndex ? 'completed' : ''} ${i === currentExerciseIndex ? 'current' : ''} ${ex.muscleGroup === 'core' ? 'core' : ''}`}
            title={ex.name}
          />
        ))}
      </div>

      <div className="rounds-display">
        {Array.from({ length: hiitSection.rounds }).map((_, i) => (
          <div
            key={i}
            className={`round-dot ${i < currentRound - 1 ? 'completed' : ''} ${i === currentRound - 1 ? 'current' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
