import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types/meal-planning';
import { toast } from 'sonner';
import { WeeklySetupSettings } from '@/components/meal-planning/WeeklySetupModal';
import { DEFAULT_RECOMMENDATION_WEIGHTS } from '@/config/recommendationPresets';

const defaultPreferences: UserPreferences = {
  mealCount: 3,
  calorieTarget: 2000,
  proteinTarget: 120,
  carbTarget: 200,
  fatTarget: 60,
  dietaryPreference: 'omnivore',
  fitnessGoal: 'maintenance',
  allergies: [],
  cookingTime: 30,
  cuisinePreferences: [],
  budget: 'medium',
  likedFoods: [],
  dislikedFoods: [],
  recommendationPreset: 'Healthy',
  intolerances: [],
  cookingExperience: 'intermediate',
  preferenceHistory: {
    lastUpdated: new Date().toISOString()
  },
  likedMeals: [],
  dislikedMeals: [],
  pantry: [],
  dietaryRestrictions: [], // Add missing properties
  goals: [],
  recommendationWeights: DEFAULT_RECOMMENDATION_WEIGHTS,
  profileComplete: false,
  authorStyle: '',
};

export const useMealPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('mealPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    return localStorage.getItem('mealPreferencesComplete') === 'true';
  });

  const [weeklyMealCount, setWeeklyMealCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('weeklyMealCount');
    return savedCount ? parseInt(savedCount) : 7;
  });

  // Add weekly settings state
  const [weeklySettings, setWeeklySettings] = useState<WeeklySetupSettings>(() => {
    const savedSettings = localStorage.getItem('weeklyMealSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : { dishCount: weeklyMealCount, includeBreakfast: true };
  });

  useEffect(() => {
    localStorage.setItem('mealPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('weeklyMealCount', weeklyMealCount.toString());
  }, [weeklyMealCount]);

  // Save weekly settings when changed
  useEffect(() => {
    localStorage.setItem('weeklyMealSettings', JSON.stringify(weeklySettings));
  }, [weeklySettings]);

  useEffect(() => {
    const lastResetDate = localStorage.getItem('lastWeeklyCountReset');
    const today = new Date();
    
    if (!lastResetDate) {
      localStorage.setItem('lastWeeklyCountReset', today.toISOString());
      return;
    }

    const lastReset = new Date(lastResetDate);
    const diffTime = Math.abs(today.getTime() - lastReset.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays >= 7) {
      setWeeklyMealCount(7);
      localStorage.setItem('lastWeeklyCountReset', today.toISOString());
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { 
        ...prev, 
        ...updates, 
        preferenceHistory: { 
          ...prev.preferenceHistory!, 
          lastUpdated: new Date().toISOString() 
        } 
      };
      return updated;
    });
    toast.success('Preferences updated');
  };

  const updateWeeklyMealCount = (count: number) => {
    setWeeklyMealCount(count);
    // Also update weekly settings to keep them in sync
    setWeeklySettings(prev => ({
      ...prev,
      dishCount: count
    }));
  };

  const updateWeeklySettings = (settings: WeeklySetupSettings) => {
    setWeeklySettings(settings);
    // Update meal count to keep it in sync with dish count
    setWeeklyMealCount(settings.dishCount);
  };

  const addLikedFood = (foodId: string) => {
    setPreferences(prev => {
      const updatedDisliked = prev.dislikedFoods?.filter(id => id !== foodId) || [];
      
      const updatedLiked = prev.likedFoods?.includes(foodId) 
        ? prev.likedFoods 
        : [...(prev.likedFoods || []), foodId];

      return {
        ...prev,
        likedFoods: updatedLiked,
        dislikedFoods: updatedDisliked,
        preferenceHistory: {
          ...prev.preferenceHistory!,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const addDislikedFood = (foodId: string) => {
    setPreferences(prev => {
      const updatedLiked = prev.likedFoods?.filter(id => id !== foodId) || [];
      
      const updatedDisliked = prev.dislikedFoods?.includes(foodId) 
        ? prev.dislikedFoods 
        : [...(prev.dislikedFoods || []), foodId];

      return {
        ...prev,
        likedFoods: updatedLiked,
        dislikedFoods: updatedDisliked,
        preferenceHistory: {
          ...prev.preferenceHistory!,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const setQuickSetupProfile = (profileName: string) => {
    setPreferences(prev => ({
      ...prev,
      preferenceHistory: {
        ...prev.preferenceHistory!,
        quickSetupProfile: profileName,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const completeSetup = (finalPreferences?: Partial<UserPreferences>) => {
    if (finalPreferences) {
      setPreferences(prev => ({ 
        ...prev, 
        ...finalPreferences,
        preferenceHistory: {
          ...prev.preferenceHistory!,
          lastUpdated: new Date().toISOString()
        }
      }));
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
    weeklyMealCount,
    weeklySettings,
    updatePreferences,
    updateWeeklyMealCount,
    updateWeeklySettings,
    addLikedFood,
    addDislikedFood,
    setQuickSetupProfile,
    completeSetup,
    resetPreferences,
  };
};
