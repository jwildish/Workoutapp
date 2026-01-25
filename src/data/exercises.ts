import { Exercise } from '../types';

export const strengthExercises: Exercise[] = [
  // Chest
  { id: 's1', name: 'Barbell Bench Press', muscleGroup: 'chest', type: 'strength', description: 'Compound chest movement for maximum strength' },
  { id: 's2', name: 'Incline Dumbbell Press', muscleGroup: 'chest', type: 'strength', description: 'Upper chest focused pressing' },

  // Back
  { id: 's3', name: 'Barbell Deadlift', muscleGroup: 'back', type: 'strength', description: 'Full posterior chain compound lift' },
  { id: 's4', name: 'Weighted Pull-ups', muscleGroup: 'back', type: 'strength', description: 'Vertical pulling for lat development' },
  { id: 's5', name: 'Barbell Row', muscleGroup: 'back', type: 'strength', description: 'Horizontal rowing for back thickness' },

  // Shoulders
  { id: 's6', name: 'Overhead Press', muscleGroup: 'shoulders', type: 'strength', description: 'Compound shoulder pressing' },
  { id: 's7', name: 'Push Press', muscleGroup: 'shoulders', type: 'strength', description: 'Explosive overhead movement' },

  // Legs
  { id: 's8', name: 'Barbell Back Squat', muscleGroup: 'quads', type: 'strength', description: 'King of leg exercises' },
  { id: 's9', name: 'Front Squat', muscleGroup: 'quads', type: 'strength', description: 'Quad-dominant squatting' },
  { id: 's10', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', type: 'strength', description: 'Hamstring and glute focused' },
  { id: 's11', name: 'Hip Thrust', muscleGroup: 'glutes', type: 'strength', description: 'Maximum glute activation' },
];

export const hypertrophyExercises: Exercise[] = [
  // Chest
  { id: 'h1', name: 'Dumbbell Flyes', muscleGroup: 'chest', type: 'hypertrophy', description: 'Chest isolation for stretch' },
  { id: 'h2', name: 'Cable Crossover', muscleGroup: 'chest', type: 'hypertrophy', description: 'Constant tension chest work' },
  { id: 'h3', name: 'Incline Dumbbell Flyes', muscleGroup: 'chest', type: 'hypertrophy', description: 'Upper chest isolation' },
  { id: 'h4', name: 'Machine Chest Press', muscleGroup: 'chest', type: 'hypertrophy', description: 'Controlled chest pressing' },

  // Back
  { id: 'h5', name: 'Lat Pulldown', muscleGroup: 'back', type: 'hypertrophy', description: 'Lat width development' },
  { id: 'h6', name: 'Seated Cable Row', muscleGroup: 'back', type: 'hypertrophy', description: 'Back thickness builder' },
  { id: 'h7', name: 'Single Arm Dumbbell Row', muscleGroup: 'back', type: 'hypertrophy', description: 'Unilateral back work' },
  { id: 'h8', name: 'Face Pulls', muscleGroup: 'back', type: 'hypertrophy', description: 'Rear delt and upper back' },

  // Shoulders
  { id: 'h9', name: 'Lateral Raises', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Side delt isolation' },
  { id: 'h10', name: 'Front Raises', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Front delt targeting' },
  { id: 'h11', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Rear deltoid isolation' },
  { id: 'h12', name: 'Arnold Press', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Full range shoulder press' },

  // Arms
  { id: 'h13', name: 'Barbell Curl', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Classic bicep builder' },
  { id: 'h14', name: 'Hammer Curls', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Brachialis and bicep work' },
  { id: 'h15', name: 'Incline Dumbbell Curls', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Stretched position curls' },
  { id: 'h16', name: 'Tricep Pushdowns', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Tricep isolation' },
  { id: 'h17', name: 'Skull Crushers', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Long head tricep focus' },
  { id: 'h18', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Stretched position tricep work' },

  // Legs
  { id: 'h19', name: 'Leg Press', muscleGroup: 'quads', type: 'hypertrophy', description: 'High volume quad work' },
  { id: 'h20', name: 'Leg Extension', muscleGroup: 'quads', type: 'hypertrophy', description: 'Quad isolation' },
  { id: 'h21', name: 'Walking Lunges', muscleGroup: 'quads', type: 'hypertrophy', description: 'Unilateral leg development' },
  { id: 'h22', name: 'Leg Curl', muscleGroup: 'hamstrings', type: 'hypertrophy', description: 'Hamstring isolation' },
  { id: 'h23', name: 'Stiff Leg Deadlift', muscleGroup: 'hamstrings', type: 'hypertrophy', description: 'Hamstring stretch and contract' },
  { id: 'h24', name: 'Cable Pull Through', muscleGroup: 'glutes', type: 'hypertrophy', description: 'Glute focused hinge' },
  { id: 'h25', name: 'Bulgarian Split Squat', muscleGroup: 'glutes', type: 'hypertrophy', description: 'Single leg glute builder' },
  { id: 'h26', name: 'Calf Raises', muscleGroup: 'calves', type: 'hypertrophy', description: 'Calf development' },

  // Core
  { id: 'h27', name: 'Cable Crunches', muscleGroup: 'core', type: 'hypertrophy', description: 'Weighted ab work' },
  { id: 'h28', name: 'Hanging Leg Raises', muscleGroup: 'core', type: 'hypertrophy', description: 'Lower ab focus' },
];

export const hiitExercises: Exercise[] = [
  { id: 'hiit1', name: 'Burpees', muscleGroup: 'full-body', type: 'hiit', description: 'Full body explosive movement' },
  { id: 'hiit2', name: 'Mountain Climbers', muscleGroup: 'core', type: 'hiit', description: 'Core and cardio combo' },
  { id: 'hiit3', name: 'Jump Squats', muscleGroup: 'quads', type: 'hiit', description: 'Explosive leg power' },
  { id: 'hiit4', name: 'Box Jumps', muscleGroup: 'quads', type: 'hiit', description: 'Plyometric leg training' },
  { id: 'hiit5', name: 'Battle Ropes', muscleGroup: 'full-body', type: 'hiit', description: 'Upper body cardio blast' },
  { id: 'hiit6', name: 'Kettlebell Swings', muscleGroup: 'full-body', type: 'hiit', description: 'Hip hinge cardio' },
  { id: 'hiit7', name: 'Rowing Sprints', muscleGroup: 'full-body', type: 'hiit', description: 'Full body cardio' },
  { id: 'hiit8', name: 'Bike Sprints', muscleGroup: 'quads', type: 'hiit', description: 'Lower body cardio blast' },
  { id: 'hiit9', name: 'High Knees', muscleGroup: 'core', type: 'hiit', description: 'Running in place' },
  { id: 'hiit10', name: 'Jumping Lunges', muscleGroup: 'quads', type: 'hiit', description: 'Explosive lunge variation' },
  { id: 'hiit11', name: 'Plyo Push-ups', muscleGroup: 'chest', type: 'hiit', description: 'Explosive upper body' },
  { id: 'hiit12', name: 'Sled Push', muscleGroup: 'full-body', type: 'hiit', description: 'Leg drive cardio' },
];

export const workoutSplits = {
  push: ['chest', 'shoulders', 'triceps'] as const,
  pull: ['back', 'biceps'] as const,
  legs: ['quads', 'hamstrings', 'glutes', 'calves'] as const,
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'] as const,
  lower: ['quads', 'hamstrings', 'glutes', 'calves'] as const,
  fullBody: ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes'] as const,
};
