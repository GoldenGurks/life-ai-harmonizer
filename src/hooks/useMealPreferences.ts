
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
  // New fields for tracking preference history
  preferenceHistory: {
    quickSetupProfile: '',
    lastUpdated: new Date().toISOString()
  }
};

export const useMealPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('mealPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    return localStorage.getItem('mealPreferencesComplete') === 'true';
  });

  // Weekly meal count management
  const [weeklyMealCount, setWeeklyMealCount] = useState<number>(() => {
    const savedCount = localStorage.getItem('weeklyMealCount');
    return savedCount ? parseInt(savedCount) : 7;
  });

  useEffect(() => {
    localStorage.setItem('mealPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('weeklyMealCount', weeklyMealCount.toString());
  }, [weeklyMealCount]);

  // Check if we need to reset weekly meal count (once per week)
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

    // Reset if it's been a week
    if (diffDays >= 7) {
      setWeeklyMealCount(7); // Default value
      localStorage.setItem('lastWeeklyCountReset', today.toISOString());
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { 
        ...prev, 
        ...updates, 
        preferenceHistory: { 
          ...prev.preferenceHistory, 
          lastUpdated: new Date().toISOString() 
        } 
      };
      return updated;
    });
    toast.success('Preferences updated');
  };

  const updateWeeklyMealCount = (count: number) => {
    setWeeklyMealCount(count);
  };

  const addLikedFood = (foodId: string) => {
    setPreferences(prev => {
      // Remove from disliked if present
      const updatedDisliked = prev.dislikedFoods?.filter(id => id !== foodId) || [];
      
      // Add to liked if not already there
      const updatedLiked = prev.likedFoods?.includes(foodId) 
        ? prev.likedFoods 
        : [...(prev.likedFoods || []), foodId];

      return {
        ...prev,
        likedFoods: updatedLiked,
        dislikedFoods: updatedDisliked,
        preferenceHistory: {
          ...prev.preferenceHistory,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const addDislikedFood = (foodId: string) => {
    setPreferences(prev => {
      // Remove from liked if present
      const updatedLiked = prev.likedFoods?.filter(id => id !== foodId) || [];
      
      // Add to disliked if not already there
      const updatedDisliked = prev.dislikedFoods?.includes(foodId) 
        ? prev.dislikedFoods 
        : [...(prev.dislikedFoods || []), foodId];

      return {
        ...prev,
        likedFoods: updatedLiked,
        dislikedFoods: updatedDisliked,
        preferenceHistory: {
          ...prev.preferenceHistory,
          lastUpdated: new Date().toISOString()
        }
      };
    });
  };

  const setQuickSetupProfile = (profileName: string) => {
    setPreferences(prev => ({
      ...prev,
      preferenceHistory: {
        ...prev.preferenceHistory,
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
          ...prev.preferenceHistory,
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
    updatePreferences,
    updateWeeklyMealCount,
    addLikedFood,
    addDislikedFood,
    setQuickSetupProfile,
    completeSetup,
    resetPreferences,
  };
};
