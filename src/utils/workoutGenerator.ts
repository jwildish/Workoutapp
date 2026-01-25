import { Exercise, Workout, WorkoutExercise, WeekPlan, HIITInterval, MuscleGroup, WorkoutSettings } from '../types';
import { strengthExercises, hypertrophyExercises, hiitExercises, workoutSplits } from '../data/exercises';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getExercisesByMuscleGroup = (exercises: Exercise[], muscleGroups: readonly MuscleGroup[]): Exercise[] => {
  return exercises.filter(ex => muscleGroups.includes(ex.muscleGroup));
};

const getProgressiveOverload = (week: number): { strengthSets: number; strengthReps: string; hypertrophySets: number; hypertrophyReps: string; restMultiplier: number } => {
  // Progressive overload through the 8 weeks
  // Weeks 1-2: Foundation (moderate volume)
  // Weeks 3-4: Building (increased volume)
  // Weeks 5-6: Peak (high volume)
  // Weeks 7-8: Intensification (heavier weight, moderate volume)

  if (week <= 2) {
    return {
      strengthSets: 4,
      strengthReps: '5',
      hypertrophySets: 3,
      hypertrophyReps: '10-12',
      restMultiplier: 1,
    };
  } else if (week <= 4) {
    return {
      strengthSets: 4,
      strengthReps: '4-5',
      hypertrophySets: 4,
      hypertrophyReps: '10-12',
      restMultiplier: 0.95,
    };
  } else if (week <= 6) {
    return {
      strengthSets: 5,
      strengthReps: '3-5',
      hypertrophySets: 4,
      hypertrophyReps: '12-15',
      restMultiplier: 0.9,
    };
  } else {
    return {
      strengthSets: 5,
      strengthReps: '3',
      hypertrophySets: 3,
      hypertrophyReps: '8-10',
      restMultiplier: 1,
    };
  }
};

const getWeekFocus = (week: number): string => {
  if (week <= 2) return 'Foundation Phase - Building movement patterns and baseline strength';
  if (week <= 4) return 'Accumulation Phase - Increasing training volume';
  if (week <= 6) return 'Intensification Phase - Peak volume and metabolic stress';
  return 'Realization Phase - Maximize strength with reduced volume';
};

const createStrengthExercise = (exercise: Exercise, week: number): WorkoutExercise => {
  const progression = getProgressiveOverload(week);
  return {
    ...exercise,
    sets: progression.strengthSets,
    reps: progression.strengthReps,
    restSeconds: Math.floor(180 * progression.restMultiplier),
    weight: 'Heavy (RPE 8-9)',
  };
};

const createHypertrophyExercise = (exercise: Exercise, week: number): WorkoutExercise => {
  const progression = getProgressiveOverload(week);
  return {
    ...exercise,
    sets: progression.hypertrophySets,
    reps: progression.hypertrophyReps,
    restSeconds: Math.floor(90 * progression.restMultiplier),
    weight: 'Moderate (RPE 7-8)',
  };
};

const createHIITSection = (week: number): HIITInterval => {
  // HIIT structure progresses through weeks
  // Early weeks: longer rest, shorter work
  // Later weeks: shorter rest, longer work

  const hiitExercise = shuffleArray(hiitExercises)[0];

  if (week <= 2) {
    return {
      name: hiitExercise.name,
      workSeconds: 20,
      restSeconds: 40,
      rounds: 8, // 8 rounds x (20+40) = 8 minutes
    };
  } else if (week <= 4) {
    return {
      name: hiitExercise.name,
      workSeconds: 25,
      restSeconds: 35,
      rounds: 8,
    };
  } else if (week <= 6) {
    return {
      name: hiitExercise.name,
      workSeconds: 30,
      restSeconds: 30,
      rounds: 8,
    };
  } else {
    return {
      name: hiitExercise.name,
      workSeconds: 30,
      restSeconds: 20,
      rounds: 10, // Slightly more rounds to fill 8+ minutes
    };
  }
};

type SplitType = 'push' | 'pull' | 'legs' | 'upper' | 'lower';

const getSplitForDay = (day: number): { splitType: SplitType; name: string } => {
  const splits: { splitType: SplitType; name: string }[] = [
    { splitType: 'push', name: 'Push Day' },
    { splitType: 'pull', name: 'Pull Day' },
    { splitType: 'legs', name: 'Leg Day' },
    { splitType: 'upper', name: 'Upper Body' },
    { splitType: 'lower', name: 'Lower Body' },
    { splitType: 'push', name: 'Push Day' },
  ];
  return splits[(day - 1) % splits.length];
};

const calculateWorkoutDuration = (
  strengthExercises: WorkoutExercise[],
  hypertrophyExercises: WorkoutExercise[],
  hiit: HIITInterval
): number => {
  // Estimate time for strength section
  const strengthTime = strengthExercises.reduce((total, ex) => {
    const timePerSet = 45; // seconds per set
    const restTime = ex.restSeconds * (ex.sets - 1);
    return total + (timePerSet * ex.sets) + restTime;
  }, 0);

  // Estimate time for hypertrophy section
  const hypertrophyTime = hypertrophyExercises.reduce((total, ex) => {
    const timePerSet = 40;
    const restTime = ex.restSeconds * (ex.sets - 1);
    return total + (timePerSet * ex.sets) + restTime;
  }, 0);

  // HIIT section
  const hiitTime = (hiit.workSeconds + hiit.restSeconds) * hiit.rounds;

  return Math.ceil((strengthTime + hypertrophyTime + hiitTime) / 60);
};

export const generateWorkout = (week: number, day: number, settings: WorkoutSettings): Workout => {
  const { splitType, name } = getSplitForDay(day);
  const targetMuscles = workoutSplits[splitType] as unknown as MuscleGroup[];

  // Get exercises for this split
  const availableStrength = shuffleArray(getExercisesByMuscleGroup(strengthExercises, targetMuscles));
  const availableHypertrophy = shuffleArray(getExercisesByMuscleGroup(hypertrophyExercises, targetMuscles));

  // Select 2 strength exercises
  const selectedStrength = availableStrength.slice(0, 2).map(ex => createStrengthExercise(ex, week));

  // Select 3 hypertrophy exercises
  const selectedHypertrophy = availableHypertrophy.slice(0, 3).map(ex => createHypertrophyExercise(ex, week));

  // Create HIIT section
  const hiitSection = createHIITSection(week);

  const totalDuration = calculateWorkoutDuration(selectedStrength, selectedHypertrophy, hiitSection);

  return {
    id: `w${week}-d${day}`,
    week,
    day,
    name: `Week ${week} - ${name}`,
    targetMuscles,
    strengthExercises: selectedStrength,
    hypertrophyExercises: selectedHypertrophy,
    hiitSection,
    totalDurationMinutes: Math.max(totalDuration, settings.workoutDurationMinutes),
  };
};

export const generateWeekPlan = (week: number, settings: WorkoutSettings): WeekPlan => {
  const workoutsPerWeek = 5; // 5 workout days per week
  const workouts: Workout[] = [];

  for (let day = 1; day <= workoutsPerWeek; day++) {
    workouts.push(generateWorkout(week, day, settings));
  }

  return {
    week,
    workouts,
    focus: getWeekFocus(week),
    intensityLevel: Math.min(week, 6) + (week > 6 ? 2 : 0), // Intensity peaks at week 6, then adjusts
  };
};

export const generate8WeekPlan = (settings: WorkoutSettings): WeekPlan[] => {
  const plan: WeekPlan[] = [];

  for (let week = 1; week <= 8; week++) {
    plan.push(generateWeekPlan(week, settings));
  }

  return plan;
};

export const defaultSettings: WorkoutSettings = {
  workoutDurationMinutes: 60,
  fitnessLevel: 'intermediate',
  availableEquipment: ['barbell', 'dumbbell', 'cable', 'machine'],
};
