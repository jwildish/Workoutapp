import { Exercise } from '../types';

// Based on research-backed exercise selection (Schoenfeld et al., 2016; Krieger, 2010)
// Compound movements prioritized for strength, isolation for hypertrophy

export const strengthExercises: Exercise[] = [
  // Upper Body Push - Compound
  { id: 's1', name: 'Barbell Bench Press', muscleGroup: 'chest', type: 'strength', description: 'Primary horizontal push - chest, front delts, triceps' },
  { id: 's2', name: 'Overhead Press', muscleGroup: 'shoulders', type: 'strength', description: 'Primary vertical push - delts, upper chest, triceps' },
  { id: 's3', name: 'Incline Barbell Press', muscleGroup: 'chest', type: 'strength', description: 'Upper chest emphasis with shoulder involvement' },
  { id: 's4', name: 'Close-Grip Bench Press', muscleGroup: 'triceps', type: 'strength', description: 'Tricep-focused pressing movement' },

  // Upper Body Pull - Compound
  { id: 's5', name: 'Barbell Row', muscleGroup: 'back', type: 'strength', description: 'Horizontal pull - lats, rhomboids, rear delts' },
  { id: 's6', name: 'Weighted Pull-ups', muscleGroup: 'back', type: 'strength', description: 'Vertical pull - lats, biceps, core' },
  { id: 's7', name: 'Pendlay Row', muscleGroup: 'back', type: 'strength', description: 'Explosive horizontal pull from floor' },
  { id: 's8', name: 'Weighted Chin-ups', muscleGroup: 'back', type: 'strength', description: 'Bicep-emphasized vertical pull' },

  // Lower Body - Compound
  { id: 's9', name: 'Barbell Back Squat', muscleGroup: 'quads', type: 'strength', description: 'King of lower body - quads, glutes, core' },
  { id: 's10', name: 'Romanian Deadlift', muscleGroup: 'hamstrings', type: 'strength', description: 'Hip hinge - hamstrings, glutes, erectors' },
  { id: 's11', name: 'Front Squat', muscleGroup: 'quads', type: 'strength', description: 'Quad-dominant with core emphasis' },
  { id: 's12', name: 'Conventional Deadlift', muscleGroup: 'back', type: 'strength', description: 'Full posterior chain development' },
  { id: 's13', name: 'Hip Thrust', muscleGroup: 'glutes', type: 'strength', description: 'Maximum glute activation (Contreras et al.)' },
  { id: 's14', name: 'Bulgarian Split Squat', muscleGroup: 'quads', type: 'strength', description: 'Unilateral leg strength and balance' },
];

export const hypertrophyExercises: Exercise[] = [
  // Chest - Hypertrophy
  { id: 'h1', name: 'Dumbbell Bench Press', muscleGroup: 'chest', type: 'hypertrophy', description: 'Greater ROM than barbell variation' },
  { id: 'h2', name: 'Incline Dumbbell Press', muscleGroup: 'chest', type: 'hypertrophy', description: 'Upper chest focus with full stretch' },
  { id: 'h3', name: 'Cable Flyes', muscleGroup: 'chest', type: 'hypertrophy', description: 'Constant tension through full ROM' },
  { id: 'h4', name: 'Dips', muscleGroup: 'chest', type: 'hypertrophy', description: 'Lower chest and tricep emphasis' },

  // Back - Hypertrophy
  { id: 'h5', name: 'Lat Pulldown', muscleGroup: 'back', type: 'hypertrophy', description: 'Lat isolation with controlled tempo' },
  { id: 'h6', name: 'Seated Cable Row', muscleGroup: 'back', type: 'hypertrophy', description: 'Mid-back thickness builder' },
  { id: 'h7', name: 'Single Arm Dumbbell Row', muscleGroup: 'back', type: 'hypertrophy', description: 'Unilateral back development' },
  { id: 'h8', name: 'Face Pulls', muscleGroup: 'back', type: 'hypertrophy', description: 'Rear delts and external rotators' },
  { id: 'h9', name: 'Straight Arm Pulldown', muscleGroup: 'back', type: 'hypertrophy', description: 'Lat isolation without bicep involvement' },

  // Shoulders - Hypertrophy
  { id: 'h10', name: 'Lateral Raises', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Side delt isolation - key for width' },
  { id: 'h11', name: 'Rear Delt Flyes', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Posterior deltoid isolation' },
  { id: 'h12', name: 'Arnold Press', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Full delt activation through rotation' },
  { id: 'h13', name: 'Cable Lateral Raises', muscleGroup: 'shoulders', type: 'hypertrophy', description: 'Constant tension lateral work' },

  // Arms - Hypertrophy
  { id: 'h14', name: 'Barbell Curl', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Classic mass builder for biceps' },
  { id: 'h15', name: 'Incline Dumbbell Curls', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Long head emphasis at stretch' },
  { id: 'h16', name: 'Hammer Curls', muscleGroup: 'biceps', type: 'hypertrophy', description: 'Brachialis and forearm development' },
  { id: 'h17', name: 'Tricep Pushdowns', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Lateral head isolation' },
  { id: 'h18', name: 'Overhead Tricep Extension', muscleGroup: 'triceps', type: 'hypertrophy', description: 'Long head emphasis at stretch' },
  { id: 'h19', name: 'Skull Crushers', muscleGroup: 'triceps', type: 'hypertrophy', description: 'All three heads with stretch' },

  // Lower Body - Hypertrophy
  { id: 'h20', name: 'Leg Press', muscleGroup: 'quads', type: 'hypertrophy', description: 'High volume quad work without spinal load' },
  { id: 'h21', name: 'Leg Extension', muscleGroup: 'quads', type: 'hypertrophy', description: 'Quad isolation - rectus femoris focus' },
  { id: 'h22', name: 'Walking Lunges', muscleGroup: 'quads', type: 'hypertrophy', description: 'Unilateral with glute stretch' },
  { id: 'h23', name: 'Leg Curl', muscleGroup: 'hamstrings', type: 'hypertrophy', description: 'Hamstring isolation at knee' },
  { id: 'h24', name: 'Stiff Leg Deadlift', muscleGroup: 'hamstrings', type: 'hypertrophy', description: 'Hamstring emphasis hip hinge' },
  { id: 'h25', name: 'Glute Bridge', muscleGroup: 'glutes', type: 'hypertrophy', description: 'Glute activation and hypertrophy' },
  { id: 'h26', name: 'Cable Pull Through', muscleGroup: 'glutes', type: 'hypertrophy', description: 'Hip hinge pattern with constant tension' },
  { id: 'h27', name: 'Standing Calf Raises', muscleGroup: 'calves', type: 'hypertrophy', description: 'Gastrocnemius emphasis' },
  { id: 'h28', name: 'Seated Calf Raises', muscleGroup: 'calves', type: 'hypertrophy', description: 'Soleus emphasis' },

  // Core
  { id: 'h29', name: 'Cable Crunches', muscleGroup: 'core', type: 'hypertrophy', description: 'Weighted ab flexion' },
  { id: 'h30', name: 'Hanging Leg Raises', muscleGroup: 'core', type: 'hypertrophy', description: 'Lower ab and hip flexor work' },
];

// HIIT exercises - includes cardio and core work
export const hiitExercises: Exercise[] = [
  // Full body cardio
  { id: 'hiit1', name: 'Burpees', muscleGroup: 'full-body', type: 'hiit', description: 'Full body conditioning' },
  { id: 'hiit2', name: 'Kettlebell Swings', muscleGroup: 'full-body', type: 'hiit', description: 'Hip hinge cardio' },

  // Lower body
  { id: 'hiit3', name: 'Jump Squats', muscleGroup: 'quads', type: 'hiit', description: 'Lower body power' },
  { id: 'hiit4', name: 'Box Jumps', muscleGroup: 'quads', type: 'hiit', description: 'Plyometric power' },
  { id: 'hiit5', name: 'Jumping Lunges', muscleGroup: 'quads', type: 'hiit', description: 'Unilateral leg power' },

  // Core/Ab exercises (at least 2 per HIIT session)
  { id: 'hiit6', name: 'Mountain Climbers', muscleGroup: 'core', type: 'hiit', description: 'Core and cardio' },
  { id: 'hiit7', name: 'Bicycle Crunches', muscleGroup: 'core', type: 'hiit', description: 'Obliques and rectus abdominis' },
  { id: 'hiit8', name: 'Plank to Push-up', muscleGroup: 'core', type: 'hiit', description: 'Core stability with movement' },
  { id: 'hiit9', name: 'V-Ups', muscleGroup: 'core', type: 'hiit', description: 'Full ab contraction' },
  { id: 'hiit10', name: 'Russian Twists', muscleGroup: 'core', type: 'hiit', description: 'Rotational core work' },
  { id: 'hiit11', name: 'Dead Bug', muscleGroup: 'core', type: 'hiit', description: 'Anti-extension core stability' },
  { id: 'hiit12', name: 'Flutter Kicks', muscleGroup: 'core', type: 'hiit', description: 'Lower ab endurance' },
  { id: 'hiit13', name: 'Plank Jacks', muscleGroup: 'core', type: 'hiit', description: 'Core stability with cardio' },
];

// 4-Day Push/Pull Split with reduced leg volume (legs on pull days only)
// Upper body 2x/week, lower body 1x/week per muscle group
export const workoutSplits = {
  pushA: {
    name: 'Push A',
    strength: ['chest', 'shoulders'] as const,
    hypertrophy: ['chest', 'triceps', 'shoulders'] as const,
    description: 'Chest and shoulder pressing movements'
  },
  pullA: {
    name: 'Pull A + Legs',
    strength: ['back', 'quads'] as const,
    hypertrophy: ['back', 'biceps', 'quads', 'hamstrings'] as const,
    description: 'Pulling movements with quad and hamstring work'
  },
  pushB: {
    name: 'Push B',
    strength: ['chest', 'shoulders'] as const,
    hypertrophy: ['chest', 'triceps', 'shoulders'] as const,
    description: 'Chest and shoulder pressing movements'
  },
  pullB: {
    name: 'Pull B + Legs',
    strength: ['back', 'hamstrings'] as const,
    hypertrophy: ['back', 'biceps', 'glutes', 'calves'] as const,
    description: 'Pulling movements with glute and calf work'
  }
};

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
