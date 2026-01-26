import { Exercise, Workout, WorkoutExercise, WeekPlan, HIITSection, HIITExercise, MuscleGroup, WorkoutSettings } from '../types';
import { strengthExercises, hypertrophyExercises, hiitExercises, workoutSplits, progressionRules } from '../data/exercises';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getExercisesByMuscleGroup = (exercises: Exercise[], muscleGroups: readonly string[]): Exercise[] => {
  return exercises.filter(ex => muscleGroups.includes(ex.muscleGroup));
};

// Based on periodization research (Stone et al., Bompa & Haff)
// Week 4 is deload week with reduced volume and intensity
const getProgressiveOverload = (week: number, isDeload: boolean): {
  strengthSets: number;
  strengthReps: string;
  hypertrophySets: number;
  hypertrophyReps: string;
  intensityMultiplier: number;
  volumeMultiplier: number;
} => {
  // Deload week (week 4): reduce volume by 40%, intensity by 10%
  if (isDeload) {
    return {
      strengthSets: 3,
      strengthReps: '5',
      hypertrophySets: 2,
      hypertrophyReps: '10',
      intensityMultiplier: 0.9,
      volumeMultiplier: 0.6,
    };
  }

  // Progressive overload through 8 weeks (excluding deload)
  // Based on linear periodization principles
  if (week <= 2) {
    // Accumulation phase - moderate intensity, building volume
    return {
      strengthSets: 4,
      strengthReps: '6',
      hypertrophySets: 3,
      hypertrophyReps: '10-12',
      intensityMultiplier: 1.0,
      volumeMultiplier: 1.0,
    };
  } else if (week <= 4) {
    // Transmutation phase - increasing intensity
    return {
      strengthSets: 4,
      strengthReps: '5',
      hypertrophySets: 3,
      hypertrophyReps: '8-10',
      intensityMultiplier: 1.025, // 2.5% increase
      volumeMultiplier: 1.0,
    };
  } else if (week <= 6) {
    // Intensification phase - peak intensity
    return {
      strengthSets: 5,
      strengthReps: '4-5',
      hypertrophySets: 4,
      hypertrophyReps: '8-12',
      intensityMultiplier: 1.05, // 5% increase from start
      volumeMultiplier: 1.1,
    };
  } else {
    // Realization phase - maintain intensity, optimize performance
    return {
      strengthSets: 4,
      strengthReps: '3-5',
      hypertrophySets: 3,
      hypertrophyReps: '6-10',
      intensityMultiplier: 1.075, // 7.5% increase from start
      volumeMultiplier: 0.9,
    };
  }
};

const getWeekFocus = (week: number, isDeload: boolean): string => {
  if (isDeload) return 'Deload Week - Recovery and adaptation. Reduce weights by 40%, focus on form.';
  if (week <= 2) return 'Accumulation Phase - Building work capacity and movement patterns';
  if (week <= 4) return 'Transmutation Phase - Converting volume to intensity';
  if (week <= 6) return 'Intensification Phase - Peak training stress';
  return 'Realization Phase - Expressing strength gains';
};

const isCompoundExercise = (exercise: Exercise): boolean => {
  const compoundNames = [
    'Bench Press', 'Squat', 'Deadlift', 'Row', 'Press', 'Pull-up', 'Chin-up',
    'Hip Thrust', 'Dips', 'Lunge', 'Split Squat'
  ];
  return compoundNames.some(name => exercise.name.includes(name));
};

const getSuggestedWeight = (
  exercise: Exercise,
  week: number,
  isDeload: boolean,
  baseWeight?: number
): number | undefined => {
  if (!baseWeight) return undefined;

  const isCompound = isCompoundExercise(exercise);
  const isLowerCompound = ['quads', 'hamstrings', 'glutes'].includes(exercise.muscleGroup) && isCompound;

  let weeklyIncrease: number;
  if (isLowerCompound) {
    weeklyIncrease = progressionRules.lowerCompound.weeklyIncrease;
  } else if (isCompound) {
    weeklyIncrease = progressionRules.compound.weeklyIncrease;
  } else {
    weeklyIncrease = progressionRules.isolation.weeklyIncrease;
  }

  // Calculate weight based on week progression
  const progression = getProgressiveOverload(week, isDeload);
  const weeksSinceStart = week - 1;
  let suggestedWeight = baseWeight + (weeksSinceStart * weeklyIncrease);

  // Apply intensity multiplier
  suggestedWeight *= progression.intensityMultiplier;

  // Deload reduction
  if (isDeload) {
    const deloadReduction = isCompound ? progressionRules.compound.deloadReduction : progressionRules.isolation.deloadReduction;
    suggestedWeight *= deloadReduction;
  }

  return Math.round(suggestedWeight * 2) / 2; // Round to nearest 0.5kg
};

const createStrengthExercise = (exercise: Exercise, week: number, isDeload: boolean): WorkoutExercise => {
  const progression = getProgressiveOverload(week, isDeload);
  const isCompound = isCompoundExercise(exercise);

  return {
    ...exercise,
    sets: progression.strengthSets,
    reps: progression.strengthReps,
    restSeconds: isDeload ? 120 : 180,
    weight: isDeload ? 'Deload: 60% of normal' : 'Heavy (RPE 8-9)',
    isCompound,
    suggestedWeight: undefined, // Will be filled by user
  };
};

const createHypertrophyExercise = (exercise: Exercise, week: number, isDeload: boolean): WorkoutExercise => {
  const progression = getProgressiveOverload(week, isDeload);
  const isCompound = isCompoundExercise(exercise);

  return {
    ...exercise,
    sets: progression.hypertrophySets,
    reps: progression.hypertrophyReps,
    restSeconds: isDeload ? 60 : 90,
    weight: isDeload ? 'Deload: 50% of normal' : 'Moderate (RPE 7-8)',
    isCompound,
    suggestedWeight: undefined,
  };
};

// Create HIIT section with 4+ exercises, at least 2 ab exercises
const createHIITSection = (week: number, isDeload: boolean): HIITSection => {
  const coreExercises = hiitExercises.filter(ex => ex.muscleGroup === 'core');
  const otherExercises = hiitExercises.filter(ex => ex.muscleGroup !== 'core');

  // Select at least 2 core/ab exercises
  const selectedCore = shuffleArray(coreExercises).slice(0, 2);
  // Select 2 other exercises (cardio/full body)
  const selectedOther = shuffleArray(otherExercises).slice(0, 2);

  const allSelected = shuffleArray([...selectedCore, ...selectedOther]);

  // Adjust timing based on week and deload
  let workSeconds: number;
  let restSeconds: number;

  if (isDeload) {
    workSeconds = 20;
    restSeconds = 40;
  } else if (week <= 2) {
    workSeconds = 20;
    restSeconds = 40;
  } else if (week <= 4) {
    workSeconds = 25;
    restSeconds = 35;
  } else if (week <= 6) {
    workSeconds = 30;
    restSeconds = 30;
  } else {
    workSeconds = 30;
    restSeconds = 25;
  }

  // Calculate rounds to fill ~8 minutes
  // Each exercise cycles through, then repeat
  const cycleTime = (workSeconds + restSeconds) * allSelected.length;
  const rounds = Math.ceil(480 / cycleTime); // 480 seconds = 8 minutes

  const hiitExerciseList: HIITExercise[] = allSelected.map(ex => ({
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    duration: workSeconds,
  }));

  return {
    exercises: hiitExerciseList,
    workSeconds,
    restSeconds,
    rounds,
    totalDuration: 480,
  };
};

type SplitType = 'pushA' | 'pullA' | 'pushB' | 'pullB';

const getSplitForDay = (day: number): SplitType => {
  const splits: SplitType[] = ['pushA', 'pullA', 'pushB', 'pullB'];
  return splits[(day - 1) % 4];
};

const calculateWorkoutDuration = (
  strengthExercises: WorkoutExercise[],
  hypertrophyExercises: WorkoutExercise[],
  hiit: HIITSection
): number => {
  const strengthTime = strengthExercises.reduce((total, ex) => {
    const timePerSet = 45;
    const restTime = ex.restSeconds * (ex.sets - 1);
    return total + (timePerSet * ex.sets) + restTime;
  }, 0);

  const hypertrophyTime = hypertrophyExercises.reduce((total, ex) => {
    const timePerSet = 40;
    const restTime = ex.restSeconds * (ex.sets - 1);
    return total + (timePerSet * ex.sets) + restTime;
  }, 0);

  const hiitTime = hiit.totalDuration;

  return Math.ceil((strengthTime + hypertrophyTime + hiitTime) / 60);
};

export const generateWorkout = (week: number, day: number, settings: WorkoutSettings): Workout => {
  const isDeload = week === 4; // Week 4 is deload week
  const splitType = getSplitForDay(day);
  const split = workoutSplits[splitType];

  const targetMuscles = [...split.strength, ...split.hypertrophy].filter(
    (v, i, a) => a.indexOf(v) === i
  ) as MuscleGroup[];

  // Get exercises for this split
  const availableStrength = shuffleArray(
    getExercisesByMuscleGroup(strengthExercises, split.strength)
  );
  const availableHypertrophy = shuffleArray(
    getExercisesByMuscleGroup(hypertrophyExercises, split.hypertrophy)
  );

  // Select 2 strength exercises
  const selectedStrength = availableStrength
    .slice(0, 2)
    .map(ex => createStrengthExercise(ex, week, isDeload));

  // Select 3 hypertrophy exercises
  const selectedHypertrophy = availableHypertrophy
    .slice(0, 3)
    .map(ex => createHypertrophyExercise(ex, week, isDeload));

  // Create HIIT section with 4 exercises (2+ ab exercises)
  const hiitSection = createHIITSection(week, isDeload);

  const totalDuration = calculateWorkoutDuration(selectedStrength, selectedHypertrophy, hiitSection);

  return {
    id: `w${week}-d${day}`,
    week,
    day,
    name: `Week ${week} - ${split.name}`,
    splitType,
    targetMuscles,
    strengthExercises: selectedStrength,
    hypertrophyExercises: selectedHypertrophy,
    hiitSection,
    totalDurationMinutes: Math.max(totalDuration, settings.workoutDurationMinutes),
    isDeload,
  };
};

export const generateWeekPlan = (week: number, settings: WorkoutSettings): WeekPlan => {
  const isDeload = week === 4;
  const workoutsPerWeek = 4; // 4-day split
  const workouts: Workout[] = [];

  for (let day = 1; day <= workoutsPerWeek; day++) {
    workouts.push(generateWorkout(week, day, settings));
  }

  return {
    week,
    workouts,
    focus: getWeekFocus(week, isDeload),
    intensityLevel: isDeload ? 3 : Math.min(week, 6) + (week > 6 ? 1 : 0),
    isDeload,
  };
};

export const generate8WeekPlan = (settings: WorkoutSettings): WeekPlan[] => {
  const plan: WeekPlan[] = [];

  for (let week = 1; week <= 8; week++) {
    plan.push(generateWeekPlan(week, settings));
  }

  return plan;
};

// Calculate suggested weight increase for next week
export const calculateWeightProgression = (
  exerciseId: string,
  currentWeight: number,
  isCompound: boolean,
  muscleGroup: MuscleGroup,
  completedAllSets: boolean
): number => {
  if (!completedAllSets) return currentWeight; // Don't increase if sets weren't completed

  const isLowerCompound = ['quads', 'hamstrings', 'glutes'].includes(muscleGroup) && isCompound;

  let increase: number;
  if (isLowerCompound) {
    increase = progressionRules.lowerCompound.weeklyIncrease;
  } else if (isCompound) {
    increase = progressionRules.compound.weeklyIncrease;
  } else {
    increase = progressionRules.isolation.weeklyIncrease;
  }

  return Math.round((currentWeight + increase) * 2) / 2; // Round to nearest 0.5kg
};

export const defaultSettings: WorkoutSettings = {
  workoutDurationMinutes: 60,
  fitnessLevel: 'intermediate',
  availableEquipment: ['barbell', 'dumbbell', 'cable', 'machine'],
};
