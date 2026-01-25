export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  description: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'full-body';

export type ExerciseType = 'strength' | 'hypertrophy' | 'hiit';

export interface WorkoutExercise extends Exercise {
  sets: number;
  reps: string;
  restSeconds: number;
  weight: string;
}

export interface HIITInterval {
  name: string;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
}

export interface Workout {
  id: string;
  week: number;
  day: number;
  name: string;
  targetMuscles: MuscleGroup[];
  strengthExercises: WorkoutExercise[];
  hypertrophyExercises: WorkoutExercise[];
  hiitSection: HIITInterval;
  totalDurationMinutes: number;
}

export interface WeekPlan {
  week: number;
  workouts: Workout[];
  focus: string;
  intensityLevel: number;
}

export interface WorkoutSettings {
  workoutDurationMinutes: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableEquipment: string[];
}

export type WorkoutPhase = 'warmup' | 'strength' | 'hypertrophy' | 'hiit' | 'cooldown' | 'complete';
