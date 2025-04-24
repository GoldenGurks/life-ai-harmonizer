import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserPreferences } from "@/types/meal-planning";
import { DEFAULT_RECOMMENDATION_WEIGHTS, PRESETS } from "@/config/recommendationPresets";

/**
 * Context props exposing profile and actions
 */
interface UserProfileContextProps {
  profile: UserPreferences;
  updateProfile: (input: Partial<UserPreferences>) => void;
  addLikedMeal: (mealId: string) => void;
  addDislikedMeal: (mealId: string) => void;
  addLikedFood: (food: string) => void;
  addDislikedFood: (food: string) => void;
  resetProfile: () => void;
}

/**
 * Default profile state for new users
 */
const defaultProfile: UserPreferences = {
  mealCount: 3,
  calorieTarget: 2000,
  proteinTarget: 50,
  carbTarget: 250,
  fatTarget: 70,
  fitnessGoal: 'general',
  dietaryPreference: '',
  allergies: [],
  intolerances: [],
  cookingTime: 30,
  cookingExperience: 'Beginner',
  cuisinePreferences: [],
  budget: 'medium',
  likedMeals: [],
  dislikedMeals: [],
  likedFoods: [],
  dislikedFoods: [],
  pantry: [],
  preferenceHistory: [],
  onlyLikedRecipes: false,
  recommendationPreset: 'Healthy',
  recommendationWeights: DEFAULT_RECOMMENDATION_WEIGHTS,
  profileComplete: false,
};

// Create the context
const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

/**
 * Provider wraps the app and persists profile to localStorage
 */
export const UserProfileProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [profile, setProfile] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (input: Partial<UserPreferences>) => {
    setProfile(prev => ({ ...prev, ...input }));
  };

  const addLikedMeal = (id: string) => updateProfile({
    likedMeals: profile.likedMeals.includes(id)
      ? profile.likedMeals
      : [...profile.likedMeals, id],
    dislikedMeals: profile.dislikedMeals.filter(x => x !== id),
  });

  const addDislikedMeal = (id: string) => updateProfile({
    dislikedMeals: profile.dislikedMeals.includes(id)
      ? profile.dislikedMeals
      : [...profile.dislikedMeals, id],
    likedMeals: profile.likedMeals.filter(x => x !== id),
  });

  const addLikedFood = (food: string) => updateProfile({
    likedFoods: profile.likedFoods.includes(food)
      ? profile.likedFoods
      : [...profile.likedFoods, food],
  });

  const addDislikedFood = (food: string) => updateProfile({
    dislikedFoods: profile.dislikedFoods.includes(food)
      ? profile.dislikedFoods
      : [...profile.dislikedFoods, food],
  });

  const resetProfile = () => {
    localStorage.removeItem('userProfile');
    setProfile(defaultProfile);
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        addLikedMeal,
        addDislikedMeal,
        addLikedFood,
        addDislikedFood,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Hook to access the user profile context
 */
export const useUserProfileContext = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfileContext must be inside UserProfileProvider');
  return ctx;
};
