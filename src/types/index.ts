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
  suggestedWeight?: number; // in kg
  previousWeight?: number; // last recorded weight
  isCompound: boolean;
}

export interface HIITExercise {
  name: string;
  muscleGroup: MuscleGroup;
  duration: number; // seconds
}

export interface HIITSection {
  exercises: HIITExercise[];
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  totalDuration: number; // 8 minutes = 480 seconds
}

export interface Workout {
  id: string;
  week: number;
  day: number;
  name: string;
  splitType: string;
  targetMuscles: MuscleGroup[];
  strengthExercises: WorkoutExercise[];
  hypertrophyExercises: WorkoutExercise[];
  hiitSection: HIITSection;
  totalDurationMinutes: number;
  isDeload: boolean;
}

export interface WeekPlan {
  week: number;
  workouts: Workout[];
  focus: string;
  intensityLevel: number;
  isDeload: boolean;
}

export interface WorkoutSettings {
  workoutDurationMinutes: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableEquipment: string[];
}

export type WorkoutPhase = 'warmup' | 'strength' | 'hypertrophy' | 'hiit' | 'cooldown' | 'complete';

// Weight tracking
export interface WeightEntry {
  exerciseId: string;
  week: number;
  day: number;
  weight: number; // in kg
  reps: number;
  date: string;
}

export interface UserWeights {
  [exerciseId: string]: WeightEntry[];
}

// For export
export interface ExportData {
  plan: WeekPlan[];
  weights: Record<string, WeightEntry[]>;
  settings: WorkoutSettings;
  exportDate: string;
}
