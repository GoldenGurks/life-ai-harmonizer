
import { useState, useEffect } from 'react';
import { MealItem } from '@/types/meal-planning';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { toast } from 'sonner';
import { convertRecipeToMealItem } from './WeeklyPlanTab';
import { useLanguage } from '@/hooks/useLanguage';
import { useMealPreferences } from '@/hooks/useMealPreferences';

/**
 * Interface for displaying the weekly meal plan
 */
export interface WeeklyPlanDisplay {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

/**
 * Hook to manage meal planning functionality
 */
export const useMealManager = (currentDay: string, days: string[]) => {
  const { t } = useLanguage();
  const { isSetupComplete, weeklySettings } = useMealPreferences();
  
  // Get dishCount from weekly settings
  const dishCount = weeklySettings.dishCount;
  
  // Load recipe recommendations with the current dish count
  const { recommendations } = useRecipeRecommendations({ count: dishCount });
  
  // State for meal plans
  const [mealPlans, setMealPlans] = useState<WeeklyPlanDisplay[]>([]);

  // Initialize meal plans based on recommendations
  useEffect(() => {
    // Skip if no recommendations are available
    if (recommendations.length === 0) return;

    // Create a plan object for each day of the week
    const newPlans = days.map((day, idx) => {
      const recipe = recommendations[idx];
      const mealItem = recipe
        ? convertRecipeToMealItem(recipe)
        : undefined;

      return {
        id: day.toLowerCase(),
        name: `${day}'s Plan`,
        day,
        meals: mealItem ? [mealItem] : [],
        totalNutrition: mealItem
          ? {
              calories: mealItem.calories,
              protein: mealItem.protein,
              carbs: mealItem.carbs,
              fat: mealItem.fat,
              fiber: mealItem.fiber,
            }
          : undefined,
      } as WeeklyPlanDisplay;
    });

    setMealPlans(newPlans);
  }, [recommendations, days]);

  /**
   * Handle meal change by replacing a meal in the current day's plan
   * @param mealId ID of the meal to change
   */
  const handleMealChange = (mealId: string) => {
    if (!isSetupComplete) {
      toast.error(t('mealPlanning.completeSetupFirst'));
      return;
    }

    toast.success(t('mealPlanning.mealOptions'));
    
    // Find the current plan and meal to replace
    const currentPlan = mealPlans.find(plan => plan.day === currentDay);
    if (!currentPlan) return;
    
    const mealToReplace = currentPlan.meals.find(meal => meal.id === mealId);
    if (!mealToReplace) return;
    
    // Find a replacement from recommendations
    const replacementMeal = recommendations.find(recipe => 
      recipe.id !== mealId
    );
    
    if (!replacementMeal) {
      toast.error(t('mealPlanning.noAlternativesAvailable'));
      return;
    }
    
    // Convert to meal item and update the plan
    const newMealItem = convertRecipeToMealItem(replacementMeal);
    
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === currentDay) {
        const updatedMeals = plan.meals.map(meal => 
          meal.id === mealId ? newMealItem : meal
        );
        
        const totalNutrition = {
          calories: updatedMeals.reduce((sum, meal) => sum + meal.calories, 0),
          protein: updatedMeals.reduce((sum, meal) => sum + meal.protein, 0),
          carbs: updatedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
          fat: updatedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0),
          fiber: updatedMeals.reduce((sum, meal) => sum + (meal.fiber || 0), 0)
        };
        
        return {
          ...plan,
          meals: updatedMeals,
          totalNutrition
        };
      }
      return plan;
    });
    
    setMealPlans(updatedPlans);
    toast.success(t('mealPlanning.mealUpdated'));
  };

  /**
   * Handle adding a meal to a specific day
   * @param meal Meal to add
   * @param day Day to add the meal to
   */
  const handleAddMealToDay = (meal: MealItem, day: string) => {
    const dayPlan = mealPlans.find(plan => plan.day === day);
    if (!dayPlan) return;
    
    const hasMealType = dayPlan.meals.some(existingMeal => existingMeal.type === meal.type);
    
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === day) {
        const updatedMeals = hasMealType
          ? plan.meals.map(existingMeal => 
              existingMeal.type === meal.type ? meal : existingMeal
            )
          : [...plan.meals, meal];
        
        const totalNutrition = {
          calories: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
          protein: updatedMeals.reduce((sum, m) => sum + m.protein, 0),
          carbs: updatedMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
          fat: updatedMeals.reduce((sum, m) => sum + (m.fat || 0), 0),
          fiber: updatedMeals.reduce((sum, m) => sum + (m.fiber || 0), 0)
        };
        
        return {
          ...plan,
          meals: updatedMeals,
          totalNutrition
        };
      }
      return plan;
    });
    
    setMealPlans(updatedPlans);
    toast.success(t('mealPlanning.mealAdded', { name: meal.name, day }));
  };

  return {
    mealPlans,
    handleMealChange,
    handleAddMealToDay
  };
};
