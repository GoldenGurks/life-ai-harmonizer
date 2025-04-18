
import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/meal-planning';
import { toast } from 'sonner';

const defaultPreferences: UserPreferences = {
  dietaryPreference: 'omnivore',
  fitnessGoal: 'maintenance',
  allergies: [],
  intolerances: [],
  cookingExperience: 'intermediate',
  cookingTime: 30,
  likedFoods: [],
  dislikedFoods: [],
  cuisinePreferences: [],
  mealSizePreference: 'medium',
  mealFrequency: 3,
};

export const useMealPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('mealPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    return localStorage.getItem('mealPreferencesComplete') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mealPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    toast.success('Preferences updated');
  };

  const completeSetup = (finalPreferences?: Partial<UserPreferences>) => {
    if (finalPreferences) {
      setPreferences(prev => ({ ...prev, ...finalPreferences }));
    }
    setIsSetupComplete(true);
    localStorage.setItem('mealPreferencesComplete', 'true');
    toast.success('Setup completed successfully');
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    setIsSetupComplete(false);
    localStorage.removeItem('mealPreferencesComplete');
    toast.info('Preferences have been reset');
  };

  return {
    preferences,
    isSetupComplete,
    updatePreferences,
    completeSetup,
    resetPreferences,
  };
};
