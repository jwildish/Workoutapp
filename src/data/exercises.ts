import { Exercise } from '../types';

// Strength exercises - 5 sets x 5 reps, pick 2 per workout
export const strengthExercises: Exercise[] = [
  { id: 's1', name: 'Weighted Pull-ups', muscleGroup: 'back', type: 'strength', description: 'Vertical pull - lats, biceps, core' },
  { id: 's2', name: 'Bench Press', muscleGroup: 'chest', type: 'strength', description: 'Primary horizontal push - chest, front delts, triceps' },
  { id: 's3', name: 'Dumbbell Curl', muscleGroup: 'biceps', type: 'strength', description: 'Bicep strength and mass builder' },
  { id: 's4', name: 'Underhand Row', muscleGroup: 'back', type: 'strength', description: 'Horizontal pull with bicep emphasis' },
  { id: 's5', name: 'Bulgarian Split Squat', muscleGroup: 'quads', type: 'strength', description: 'Unilateral leg strength and balance' },
  { id: 's6', name: 'DB Reverse Lunge', muscleGroup: 'quads', type: 'strength', description: 'Unilateral leg strength with glute activation' },
  { id: 's7', name: 'Overhead Press', muscleGroup: 'shoulders', type: 'strength', description: 'Primary vertical push - delts, upper chest, triceps' },
  { id: 's8', name: 'Front Squat', muscleGroup: 'quads', type: 'strength', description: 'Quad-dominant with core emphasis' },
];

// Hypertrophy exercises - 4 sets x 10 reps, pick 3 per workout
export const hypertrophyExercises: Exercise[] = [
  { id: 'h1', name: 'Face Pulls', muscleGroup: 'back', type: 'hypertrophy', description: 'Rear delts and external rotators' },
  { id: 'h2', name: 'Dumbbell High Pulls', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Explosive shoulder and trap development' },
  { id: 'h3', name: 'Waiter Curls', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Long head bicep emphasis with constant tension' },
  { id: 'h4', name: 'Cable Lateral Raise', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Constant tension lateral delt work' },
  { id: 'h5', name: 'Tricep Dip', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Compound tricep and chest builder' },
  { id: 'h6', name: 'Lying Tricep Extension', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Long head tricep isolation' },
  { id: 'h7', name: 'Dumbbell Wrist Curl', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Forearm flexor development' },
  { id: 'h8', name: 'Incline Bench Press', muscleGroup: 'chest', type: 'hypertrophy', description: 'Upper chest emphasis' },
  { id: 'h9', name: 'Deadlift', muscleGroup: 'back', type: 'hypertrophy', description: 'Full posterior chain development' },
  { id: 'h10', name: 'Dumbbell Squat', muscleGroup: 'quads', type: 'hypertrophy', description: 'Quad and glute builder' },
  { id: 'h11', name: 'Toes to Bar', muscleGroup: 'core', type: 'hypertrophy', description: 'Advanced core and hip flexor work' },
  { id: 'h12', name: 'Wall Walk', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Shoulder stability and strength' },
  { id: 'h13', name: 'Lateral Raise', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Side delt isolation for width' },
  { id: 'h14', name: 'Front Raise', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Front delt isolation' },
  { id: 'h15', name: 'Calf Raise', muscleGroup: 'calves', type: 'hypertrophy', description: 'Gastrocnemius and soleus development' },
];

// HIIT exercises with intensity levels
// High intensity: 20s work / 10s rest (explosive movements)
// Low intensity: 40s work / 20s rest (sustained movements)
export interface HIITExerciseData extends Exercise {
  intensity: 'high' | 'low';
}

export const hiitExercises: HIITExerciseData[] = [
  // High intensity exercises (20s work / 10s rest)
  { id: 'hiit1', name: 'Burpees', muscleGroup: 'full-body', type: 'hiit', description: 'Full body explosive conditioning', intensity: 'high' },
  { id: 'hiit2', name: 'Box Jumps', muscleGroup: 'quads', type: 'hiit', description: 'Plyometric power', intensity: 'high' },
  { id: 'hiit3', name: 'Jump Squats', muscleGroup: 'quads', type: 'hiit', description: 'Lower body power', intensity: 'high' },
  { id: 'hiit4', name: 'Sprint', muscleGroup: 'full-body', type: 'hiit', description: 'Maximum effort cardio', intensity: 'high' },
  { id: 'hiit5', name: 'High Knees', muscleGroup: 'core', type: 'hiit', description: 'Core and cardio', intensity: 'high' },

  // Low intensity exercises (40s work / 20s rest)
  { id: 'hiit6', name: 'Plank', muscleGroup: 'core', type: 'hiit', description: 'Core stability hold', intensity: 'low' },
  { id: 'hiit7', name: 'Side Plank', muscleGroup: 'core', type: 'hiit', description: 'Oblique stability hold', intensity: 'low' },
  { id: 'hiit8', name: 'Banana Sit-ups', muscleGroup: 'core', type: 'hiit', description: 'Full core contraction', intensity: 'low' },
  { id: 'hiit9', name: 'Mountain Climbers', muscleGroup: 'core', type: 'hiit', description: 'Core and cardio', intensity: 'low' },
  { id: 'hiit10', name: 'Push-ups', muscleGroup: 'chest', type: 'hiit', description: 'Upper body endurance', intensity: 'low' },
  { id: 'hiit11', name: 'Diamond Push-ups', muscleGroup: 'triceps', type: 'hiit', description: 'Tricep-focused push-ups', intensity: 'low' },
];

// Warm-up exercises - dynamic movements to prepare for workout
export interface WarmupExercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  category: 'cardio' | 'dynamic' | 'activation';
}

export const warmupExercises: WarmupExercise[] = [
  // Light cardio (2-3 min)
  { id: 'w1', name: 'Jumping Jacks', duration: 60, description: 'Light cardio to raise heart rate', category: 'cardio' },
  { id: 'w2', name: 'High Knees', duration: 30, description: 'Activate hip flexors and raise heart rate', category: 'cardio' },
  { id: 'w3', name: 'Arm Circles', duration: 30, description: 'Shoulder mobility and blood flow', category: 'cardio' },

  // Dynamic stretches (2-3 min)
  { id: 'w4', name: 'Leg Swings', duration: 30, description: 'Hip mobility - front to back', category: 'dynamic' },
  { id: 'w5', name: 'Walking Lunges', duration: 45, description: 'Dynamic hip flexor stretch', category: 'dynamic' },
  { id: 'w6', name: 'Arm Swings', duration: 30, description: 'Chest and shoulder opener', category: 'dynamic' },
  { id: 'w7', name: 'Bodyweight Squats', duration: 45, description: 'Lower body activation', category: 'dynamic' },
  { id: 'w8', name: 'Hip Circles', duration: 30, description: 'Hip joint mobility', category: 'dynamic' },

  // Muscle activation (1-2 min)
  { id: 'w9', name: 'Band Pull-Aparts', duration: 30, description: 'Rear delt and upper back activation', category: 'activation' },
  { id: 'w10', name: 'Glute Bridges', duration: 30, description: 'Glute activation before legs', category: 'activation' },
  { id: 'w11', name: 'Cat-Cow Stretch', duration: 30, description: 'Spine mobility', category: 'activation' },
  { id: 'w12', name: 'Scapular Push-ups', duration: 30, description: 'Shoulder blade activation', category: 'activation' },
];

// Progressive overload recommendations based on Prilepin's Chart and modern research
export const progressionRules = {
  compound: {
    weeklyIncrease: 5, // lbs for upper body compounds
    deloadReduction: 0.6, // 60% of working weight
  },
  isolation: {
    weeklyIncrease: 2.5, // lbs for isolation movements
    deloadReduction: 0.5, // 50% of working weight
  },
  lowerCompound: {
    weeklyIncrease: 10, // lbs for squats/deadlifts
    deloadReduction: 0.6,
  }
};
