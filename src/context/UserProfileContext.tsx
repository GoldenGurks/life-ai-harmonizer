
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Interface defining the user preferences structure
 * Used for storing user-specific settings and preferences
 */
export interface UserPreferences {
  dietaryRestrictions: string[];  // User's dietary restrictions (e.g., "gluten-free", "vegan")
  goals: string[];                // User's nutrition goals (e.g., "weight loss", "muscle gain")
  likedMeals: string[];           // IDs of meals the user has liked
  dislikedMeals: string[];        // IDs of meals the user has disliked
  pantry: string[];               // Items currently in user's pantry
  profileComplete: boolean;       // Whether the user has completed onboarding
}

/**
 * Interface defining the shape of the context
 * Exposes functions to interact with the user profile
 */
interface UserProfileContextProps {
  profile: UserPreferences;
  updateProfile: (input: Partial<UserPreferences>) => void;
  addLikedMeal: (mealId: string) => void;
  addDislikedMeal: (mealId: string) => void;
  resetProfile: () => void;
}

/**
 * Default profile state when no user preferences exist
 */
const defaultProfile: UserPreferences = {
  dietaryRestrictions: [],
  goals: [],
  likedMeals: [],
  dislikedMeals: [],
  pantry: [],
  profileComplete: false,
};

// Create context with undefined default (will be set by provider)
const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

/**
 * Provider component that makes the user profile available to any
 * child component that calls the useUserProfile hook
 * 
 * @param children - Child components that will have access to the context
 */
export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or use default if not present
  const [profile, setProfile] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  // Persist profile changes to localStorage
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  /**
   * Updates profile with partial input
   * Merges new values with existing profile
   * 
   * @param input - Partial profile object with updated values
   */
  const updateProfile = (input: Partial<UserPreferences>) => {
    setProfile((prev) => ({ ...prev, ...input }));
  };

  /**
   * Adds a meal to the liked list and removes from disliked if present
   * 
   * @param mealId - ID of the meal to mark as liked
   */
  const addLikedMeal = (mealId: string) => {
    setProfile((prev) => ({
      ...prev,
      likedMeals: prev.likedMeals.includes(mealId) ? prev.likedMeals : [...prev.likedMeals, mealId],
      dislikedMeals: prev.dislikedMeals.filter((id) => id !== mealId),
    }));
  };

  /**
   * Adds a meal to the disliked list and removes from liked if present
   * 
   * @param mealId - ID of the meal to mark as disliked
   */
  const addDislikedMeal = (mealId: string) => {
    setProfile((prev) => ({
      ...prev,
      dislikedMeals: prev.dislikedMeals.includes(mealId) ? prev.dislikedMeals : [...prev.dislikedMeals, mealId],
      likedMeals: prev.likedMeals.filter((id) => id !== mealId),
    }));
  };

  /**
   * Resets the user profile to default state
   * Used for re-onboarding or when user wants to start over
   */
  const resetProfile = () => {
    setProfile(defaultProfile);
    localStorage.removeItem("userProfile");
  };

  // Provide context value to children
  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, addLikedMeal, addDislikedMeal, resetProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Custom hook to use the user profile context
 * Provides easy access to profile state and update functions
 * 
 * @returns The user profile context
 * @throws Error if used outside of UserProfileProvider
 */
export const useUserProfileContext = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  return ctx;
};
