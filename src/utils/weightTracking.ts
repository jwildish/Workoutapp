import { WeightEntry, UserWeights, WeekPlan, WorkoutSettings } from '../types';
import { progressionRules } from '../data/exercises';

const STORAGE_KEY = 'workout_weights';

export const saveWeight = (entry: WeightEntry): void => {
  const weights = getWeights();
  if (!weights[entry.exerciseId]) {
    weights[entry.exerciseId] = [];
  }

  // Check if entry for this week/day already exists
  const existingIndex = weights[entry.exerciseId].findIndex(
    e => e.week === entry.week && e.day === entry.day
  );

  if (existingIndex >= 0) {
    weights[entry.exerciseId][existingIndex] = entry;
  } else {
    weights[entry.exerciseId].push(entry);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
};

export const getWeights = (): UserWeights => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getWeightForExercise = (
  exerciseId: string,
  week: number,
  day: number
): WeightEntry | undefined => {
  const weights = getWeights();
  return weights[exerciseId]?.find(
    e => e.week === week && e.day === day
  );
};

export const getLatestWeightForExercise = (exerciseId: string): WeightEntry | undefined => {
  const weights = getWeights();
  const entries = weights[exerciseId];
  if (!entries || entries.length === 0) return undefined;

  return entries.reduce((latest, current) => {
    if (!latest) return current;
    const latestDate = new Date(latest.date);
    const currentDate = new Date(current.date);
    return currentDate > latestDate ? current : latest;
  });
};

export const getSuggestedWeightForWeek = (
  exerciseId: string,
  targetWeek: number,
  isCompound: boolean,
  isLowerBody: boolean,
  isDeload: boolean
): number | undefined => {
  const weights = getWeights();
  const entries = weights[exerciseId];

  if (!entries || entries.length === 0) return undefined;

  // Get the most recent weight entry
  const latestEntry = entries.reduce((latest, current) => {
    if (!latest) return current;
    if (current.week > latest.week) return current;
    if (current.week === latest.week && current.day > latest.day) return current;
    return latest;
  });

  if (!latestEntry) return undefined;

  // Calculate weeks since last entry
  const weeksDiff = targetWeek - latestEntry.week;
  if (weeksDiff <= 0) return latestEntry.weight;

  // Determine progression rate
  let weeklyIncrease: number;
  let deloadMultiplier: number;

  if (isLowerBody && isCompound) {
    weeklyIncrease = progressionRules.lowerCompound.weeklyIncrease;
    deloadMultiplier = progressionRules.lowerCompound.deloadReduction;
  } else if (isCompound) {
    weeklyIncrease = progressionRules.compound.weeklyIncrease;
    deloadMultiplier = progressionRules.compound.deloadReduction;
  } else {
    weeklyIncrease = progressionRules.isolation.weeklyIncrease;
    deloadMultiplier = progressionRules.isolation.deloadReduction;
  }

  let suggestedWeight = latestEntry.weight + (weeksDiff * weeklyIncrease);

  // Apply deload reduction if it's a deload week
  if (isDeload) {
    suggestedWeight = latestEntry.weight * deloadMultiplier;
  }

  return Math.round(suggestedWeight * 2) / 2; // Round to nearest 0.5lbs
};

export const clearWeights = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportWeights = (): string => {
  return JSON.stringify(getWeights(), null, 2);
};

export const importWeights = (jsonString: string): boolean => {
  try {
    const weights = JSON.parse(jsonString);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
    return true;
  } catch {
    return false;
  }
};
