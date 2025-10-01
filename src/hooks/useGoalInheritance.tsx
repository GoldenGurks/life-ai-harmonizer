import { useState, useEffect, useCallback } from 'react';

interface UserGoals {
  preset: 'healthy' | 'weightLoss' | 'muscleGain';
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

const DEFAULT_GOALS: UserGoals = {
  preset: 'healthy',
  calorieTarget: 2000,
  proteinTarget: 100,
  carbsTarget: 250,
  fatTarget: 65,
};

export const useGoalInheritance = () => {
  const [goals, setGoals] = useState<UserGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from localStorage with defaults fallback
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const localGoals = localStorage.getItem('userGoals');
        if (localGoals) {
          const parsed = JSON.parse(localGoals);
          setGoals(parsed);
        } else {
          setGoals(DEFAULT_GOALS);
          localStorage.setItem('userGoals', JSON.stringify(DEFAULT_GOALS));
        }
      } catch (error) {
        console.error('Failed to load goals:', error);
        setGoals(DEFAULT_GOALS);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, []);

  // Update goals (persist to localStorage)
  const updateGoals = useCallback(async (updates: Partial<UserGoals>) => {
    if (!goals) return;

    const newGoals = { ...goals, ...updates };
    setGoals(newGoals);

    // Persist to localStorage immediately
    localStorage.setItem('userGoals', JSON.stringify(newGoals));
  }, [goals]);

  return { goals, updateGoals, isLoading };
};
