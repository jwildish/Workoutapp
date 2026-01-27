import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  UserData,
  WeekPlan,
  WorkoutSettings,
  CompletedWorkout,
  WeightEntry,
  UserWeights
} from '../types';

const USERS_COLLECTION = 'users';

// Get or create user document
export const getOrCreateUser = async (
  odId: string,
  email: string,
  displayName: string,
  photoURL?: string
): Promise<UserData> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }

  // Create new user
  const newUser: UserData = {
    odId,
    email,
    displayName,
    photoURL,
    createdAt: new Date().toISOString(),
    workoutHistory: [],
    weightHistory: {}
  };

  await setDoc(userRef, newUser);
  return newUser;
};

// Get user data
export const getUserData = async (odId: string): Promise<UserData | null> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserData;
  }
  return null;
};

// Save workout plan
export const saveWorkoutPlan = async (
  odId: string,
  plan: WeekPlan[],
  settings: WorkoutSettings
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  await updateDoc(userRef, {
    currentPlan: plan,
    planSettings: settings,
    planGeneratedAt: new Date().toISOString()
  });
};

// Save completed workout to history
export const saveCompletedWorkout = async (
  odId: string,
  workout: CompletedWorkout
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  await updateDoc(userRef, {
    workoutHistory: arrayUnion(workout)
  });
};

// Save weight entry
export const saveWeightEntry = async (
  odId: string,
  entry: WeightEntry
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  const userData = await getUserData(odId);

  if (!userData) return;

  const weightHistory = { ...userData.weightHistory };
  if (!weightHistory[entry.exerciseId]) {
    weightHistory[entry.exerciseId] = [];
  }

  // Check if entry already exists for this week/day
  const existingIndex = weightHistory[entry.exerciseId].findIndex(
    e => e.week === entry.week && e.day === entry.day
  );

  if (existingIndex >= 0) {
    weightHistory[entry.exerciseId][existingIndex] = entry;
  } else {
    weightHistory[entry.exerciseId].push(entry);
  }

  await updateDoc(userRef, { weightHistory });
};

// Get weight history for an exercise
export const getWeightHistory = async (
  odId: string,
  exerciseId: string
): Promise<WeightEntry[]> => {
  const userData = await getUserData(odId);
  if (!userData || !userData.weightHistory[exerciseId]) {
    return [];
  }
  return userData.weightHistory[exerciseId];
};

// Get all weight history
export const getAllWeightHistory = async (odId: string): Promise<UserWeights> => {
  const userData = await getUserData(odId);
  return userData?.weightHistory || {};
};

// Get workout history
export const getWorkoutHistory = async (odId: string): Promise<CompletedWorkout[]> => {
  const userData = await getUserData(odId);
  return userData?.workoutHistory || [];
};

// Update user's current week progress (optional - for tracking)
export const updateUserProgress = async (
  odId: string,
  currentWeek: number,
  currentDay: number
): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, odId);
  await updateDoc(userRef, {
    currentWeek,
    currentDay,
    lastWorkoutAt: new Date().toISOString()
  });
};
