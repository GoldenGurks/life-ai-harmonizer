import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserPreferences } from "@/types/meal-planning";
import { DEFAULT_RECOMMENDATION_WEIGHTS, PRESETS } from "@/config/recommendationPresets";

const defaultProfile: UserPreferences = {
  mealCount: 3,
  calorieTarget: 2000,
  proteinTarget: 120,
  carbTarget: 200,
  fatTarget: 60,
  dietaryPreference: 'omnivore',
  fitnessGoal: 'maintenance',
  allergies: [],
  intolerances: [],
  cookingTime: 30,
  cookingExperience: 'beginner',
  cuisinePreferences: [],
  budget: 'medium',
  likedMeals: [],
  dislikedMeals: [],
  likedFoods: [],
  dislikedFoods: [],
  pantry: [],
  dietaryRestrictions: [],
  goals: [],
  preferenceHistory: {
    lastUpdated: new Date().toISOString()
  },
  recommendationPreset: 'Healthy',
  recommendationWeights: DEFAULT_RECOMMENDATION_WEIGHTS,
  profileComplete: false,
  authorStyle: '', // Add default authorStyle as empty string
};

interface UserProfileContextValue {
  profile: UserPreferences | null;
  updateProfile: (updates: Partial<UserPreferences>) => void;
  addLikedMeal: (mealId: string) => void;
  addDislikedMeal: (mealId: string) => void;
  resetProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserPreferences | null>(() => {
    const storedProfile = localStorage.getItem('userProfile');
    return storedProfile ? JSON.parse(storedProfile) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserPreferences>) => {
    setProfile(prev => {
      const updatedProfile = { ...prev, ...updates } as UserPreferences;
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const addLikedMeal = (mealId: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updatedLikedMeals = [...(prev.likedMeals || []), mealId];
      const updatedProfile = { ...prev, likedMeals: updatedLikedMeals } as UserPreferences;
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const addDislikedMeal = (mealId: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      const updatedDislikedMeals = [...(prev.dislikedMeals || []), mealId];
      const updatedProfile = { ...prev, dislikedMeals: updatedDislikedMeals } as UserPreferences;
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  const resetProfile = () => {
    localStorage.removeItem('userProfile');
    setProfile(defaultProfile);
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, addLikedMeal, addDislikedMeal, resetProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  }
  return context;
};
