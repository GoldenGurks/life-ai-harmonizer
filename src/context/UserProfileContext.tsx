
import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserPreferences {
  dietaryRestrictions: string[];
  goals: string[];
  likedMeals: string[];
  dislikedMeals: string[];
  pantry: string[];
  profileComplete: boolean;
}

interface UserProfileContextProps {
  profile: UserPreferences;
  updateProfile: (input: Partial<UserPreferences>) => void;
  addLikedMeal: (mealId: string) => void;
  addDislikedMeal: (mealId: string) => void;
  resetProfile: () => void;
}

const defaultProfile: UserPreferences = {
  dietaryRestrictions: [],
  goals: [],
  likedMeals: [],
  dislikedMeals: [],
  pantry: [],
  profileComplete: false,
};

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem("userProfile");
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  // Generic update, merges partial input
  const updateProfile = (input: Partial<UserPreferences>) => {
    setProfile((prev) => ({ ...prev, ...input }));
  };

  // Add a meal to liked (removes from disliked if present)
  const addLikedMeal = (mealId: string) => {
    setProfile((prev) => ({
      ...prev,
      likedMeals: prev.likedMeals.includes(mealId) ? prev.likedMeals : [...prev.likedMeals, mealId],
      dislikedMeals: prev.dislikedMeals.filter((id) => id !== mealId),
    }));
  };

  // Add a meal to disliked (removes from liked if present)
  const addDislikedMeal = (mealId: string) => {
    setProfile((prev) => ({
      ...prev,
      dislikedMeals: prev.dislikedMeals.includes(mealId) ? prev.dislikedMeals : [...prev.dislikedMeals, mealId],
      likedMeals: prev.likedMeals.filter((id) => id !== mealId),
    }));
  };

  // Reset profile (re-onboarding)
  const resetProfile = () => {
    setProfile(defaultProfile);
    localStorage.removeItem("userProfile");
  };

  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, addLikedMeal, addDislikedMeal, resetProfile }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  return ctx;
};
