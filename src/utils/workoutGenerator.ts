import { Exercise, Workout, WorkoutExercise, WeekPlan, HIITSection, HIITExercise, MuscleGroup, WorkoutSettings, WarmupSection, WarmupExercise, CorrectivesSection, CorrectiveExercise, YogaSection, YogaExercise } from '../types';
import { strengthExercises, hypertrophyExercises, hiitExercises, progressionRules, warmupExercises, correctivesExercises, yogaExercises } from '../data/exercises';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Strength: 5 sets x 5 reps, Hypertrophy: 4 sets x 10 reps
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

  // Standard programming: 5x5 strength, 4x10 hypertrophy
  return {
    strengthSets: 5,
    strengthReps: '5',
    hypertrophySets: 4,
    hypertrophyReps: '10',
    intensityMultiplier: 1.0 + (week * 0.01), // Small progressive increase
    volumeMultiplier: 1.0,
  };
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

  return Math.round(suggestedWeight * 2) / 2; // Round to nearest 0.5lbs
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

// Create HIIT section with mixed intensity exercises
// High intensity: 20s work / 10s rest, Low intensity: 40s work / 20s rest
const createHIITSection = (week: number, isDeload: boolean): HIITSection => {
  const highIntensity = hiitExercises.filter(ex => ex.intensity === 'high');
  const lowIntensity = hiitExercises.filter(ex => ex.intensity === 'low');

  // Select 2 high intensity and 2 low intensity exercises
  const selectedHigh = shuffleArray(highIntensity).slice(0, 2);
  const selectedLow = shuffleArray(lowIntensity).slice(0, 2);

  // Alternate high and low intensity
  const allSelected = [selectedHigh[0], selectedLow[0], selectedHigh[1], selectedLow[1]];

  // Calculate total time for one cycle
  // High intensity: 20s work + 10s rest = 30s, Low intensity: 40s work + 20s rest = 60s
  // One cycle = 2 high (60s) + 2 low (120s) = 180s = 3 min
  // For ~8 minutes, we need about 2-3 rounds
  const rounds = 3;

  const hiitExerciseList: HIITExercise[] = allSelected.map(ex => ({
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    duration: ex.intensity === 'high' ? 20 : 40,
    restSeconds: ex.intensity === 'high' ? 10 : 20,
  }));

  // Use average values for the section metadata
  // Actual timing varies per exercise based on intensity
  return {
    exercises: hiitExerciseList,
    workSeconds: 30, // Average (will be overridden per exercise)
    restSeconds: 15, // Average (will be overridden per exercise)
    rounds,
    totalDuration: 480,
  };
};

// Create warm-up section (~5 min)
const createWarmupSection = (): WarmupSection => {
  const cardioExercises = warmupExercises.filter(ex => ex.category === 'cardio');
  const dynamicExercises = warmupExercises.filter(ex => ex.category === 'dynamic');
  const activationExercises = warmupExercises.filter(ex => ex.category === 'activation');

  // Select 2 cardio, 3 dynamic, 2 activation exercises
  const selectedCardio = shuffleArray(cardioExercises).slice(0, 2);
  const selectedDynamic = shuffleArray(dynamicExercises).slice(0, 3);
  const selectedActivation = shuffleArray(activationExercises).slice(0, 2);

  const allSelected: WarmupExercise[] = [
    ...selectedCardio,
    ...selectedDynamic,
    ...selectedActivation
  ];

  const totalDuration = allSelected.reduce((sum, ex) => sum + ex.duration, 0);

  return {
    exercises: allSelected,
    totalDuration
  };
};

// Create correctives section - all 4 exercises every workout
const createCorrectivesSection = (): CorrectivesSection => {
  const totalDuration = correctivesExercises.reduce((sum, ex) => sum + ex.duration, 0);

  return {
    exercises: correctivesExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      duration: ex.duration,
      reps: ex.reps,
      description: ex.description
    })),
    totalDuration
  };
};

// Create yoga flow section - 2 minute cooldown routine
const createYogaSection = (): YogaSection => {
  const totalDuration = yogaExercises.reduce((sum, ex) => sum + ex.duration, 0);

  return {
    exercises: yogaExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      duration: ex.duration,
      description: ex.description
    })),
    totalDuration
  };
};

const calculateWorkoutDuration = (
  warmup: WarmupSection,
  strengthExercises: WorkoutExercise[],
  hypertrophyExercises: WorkoutExercise[],
  correctives: CorrectivesSection,
  hiit: HIITSection,
  yoga: YogaSection
): number => {
  const warmupTime = warmup.totalDuration;

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

  const correctivesTime = correctives.totalDuration;
  const hiitTime = hiit.totalDuration;
  const yogaTime = yoga.totalDuration;

  return Math.ceil((warmupTime + strengthTime + hypertrophyTime + correctivesTime + hiitTime + yogaTime) / 60);
};

const generateWorkout = (
  week: number,
  day: number,
  settings: WorkoutSettings,
  usedStrengthIds: Set<string>,
  usedHypertrophyIds: Set<string>
): Workout => {
  const isDeload = week === 4; // Week 4 is deload week

  // Get available exercises from the full pool, excluding already used ones this week
  const availableStrength = shuffleArray(
    strengthExercises.filter(ex => !usedStrengthIds.has(ex.id))
  );
  const availableHypertrophy = shuffleArray(
    hypertrophyExercises.filter(ex => !usedHypertrophyIds.has(ex.id))
  );

  // Create warm-up section
  const warmupSection = createWarmupSection();

  // Select 2 strength exercises (no repeats within week)
  const selectedStrengthExercises = availableStrength.slice(0, 2);
  selectedStrengthExercises.forEach(ex => usedStrengthIds.add(ex.id));
  const selectedStrength = selectedStrengthExercises
    .map(ex => createStrengthExercise(ex, week, isDeload));

  // Select 3 hypertrophy exercises (no repeats within week)
  const selectedHypertrophyExercises = availableHypertrophy.slice(0, 3);
  selectedHypertrophyExercises.forEach(ex => usedHypertrophyIds.add(ex.id));
  const selectedHypertrophy = selectedHypertrophyExercises
    .map(ex => createHypertrophyExercise(ex, week, isDeload));

  // Get target muscles from selected exercises
  const targetMuscles = [...new Set([
    ...selectedStrengthExercises.map(ex => ex.muscleGroup),
    ...selectedHypertrophyExercises.map(ex => ex.muscleGroup)
  ])] as MuscleGroup[];

  // Create correctives section
  const correctivesSection = createCorrectivesSection();

  // Create HIIT section with 4 exercises (mixed intensity)
  const hiitSection = createHIITSection(week, isDeload);

  // Create yoga cooldown section
  const yogaSection = createYogaSection();

  const totalDuration = calculateWorkoutDuration(warmupSection, selectedStrength, selectedHypertrophy, correctivesSection, hiitSection, yogaSection);

  return {
    id: `w${week}-d${day}`,
    week,
    day,
    name: `Week ${week} - Day ${day}`,
    splitType: `day${day}`,
    targetMuscles,
    warmupSection,
    strengthExercises: selectedStrength,
    hypertrophyExercises: selectedHypertrophy,
    correctivesSection,
    hiitSection,
    yogaSection,
    totalDurationMinutes: Math.max(totalDuration, settings.workoutDurationMinutes),
    isDeload,
  };
};

export const generateWeekPlan = (week: number, settings: WorkoutSettings): WeekPlan => {
  const isDeload = week === 4;
  const workoutsPerWeek = 4; // 4-day split
  const workouts: Workout[] = [];

  // Track used exercises across the week to prevent repeats
  const usedStrengthIds = new Set<string>();
  const usedHypertrophyIds = new Set<string>();

  for (let day = 1; day <= workoutsPerWeek; day++) {
    workouts.push(generateWorkout(week, day, settings, usedStrengthIds, usedHypertrophyIds));
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
