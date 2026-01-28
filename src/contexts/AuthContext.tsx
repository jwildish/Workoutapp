import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Minimal shape matching what the app needs from a user
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_KEY = 'hypertrophy_guest_session';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing guest session first
    const guestSession = localStorage.getItem(GUEST_KEY);
    if (guestSession) {
      setUser(JSON.parse(guestSession));
      setIsGuest(true);
      setLoading(false);
      return;
    }

    // Listen for Firebase auth changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        setIsGuest(false);
      } else {
        setUser(null);
        setIsGuest(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      // Clear any guest session
      localStorage.removeItem(GUEST_KEY);
      setIsGuest(false);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInAsGuest = (): void => {
    const guestUser: AppUser = {
      uid: `guest_${Date.now()}`,
      email: null,
      displayName: 'Guest',
      photoURL: null
    };
    localStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
    setIsGuest(true);
  };

  const signOut = async (): Promise<void> => {
    try {
      if (isGuest) {
        localStorage.removeItem(GUEST_KEY);
        setUser(null);
        setIsGuest(false);
      } else {
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isGuest,
    signInWithGoogle,
    signInAsGuest,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
