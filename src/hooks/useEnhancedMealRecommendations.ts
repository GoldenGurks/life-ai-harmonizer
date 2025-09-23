/**
 * Enhanced Meal Recommendations Hook
 * 
 * Provides meal recommendations using the enhanced recommendation engine
 * with meal budgets, nutritional scoring, and advanced filtering.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';
import { useUserProfileContext } from '@/context/UserProfileContext';
import { generateMealRecommendations, replaceDislikedRecipe, ScoredRecipe } from '@/services/recommendation/mealRecommendationEngine';
import { recipeData } from '@/data/recipeDatabase';

interface UseEnhancedMealRecommendationsProps {
  recipes?: Recipe[];
  count?: number;
  mealType?: string;
  includeBreakfast?: boolean;
}

interface MealRecommendationState {
  recommendations: ScoredRecipe[];
  isLoading: boolean;
  error: string | null;
  selectedRecipes: ScoredRecipe[];
  rejectedRecipes: string[];
}

export const useEnhancedMealRecommendations = (props?: UseEnhancedMealRecommendationsProps) => {
  const { 
    recipes = recipeData, 
    count = 5, 
    mealType = 'lunch',
    includeBreakfast = true 
  } = props || {};
  
  const { profile, addDislikedMeal } = useUserProfileContext();
  
  const [state, setState] = useState<MealRecommendationState>({
    recommendations: [],
    isLoading: false,
    error: null,
    selectedRecipes: [],
    rejectedRecipes: []
  });

  // Generate recommendations when dependencies change
  const generateRecommendations = useCallback(async () => {
    if (!profile || recipes.length === 0) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const recommendations = generateMealRecommendations(
        profile,
        recipes,
        mealType,
        count,
        includeBreakfast
      );
      
      setState(prev => ({
        ...prev,
        recommendations,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error generating meal recommendations:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
        isLoading: false
      }));
    }
  }, [profile, recipes, mealType, count, includeBreakfast]);

  // Generate recommendations on mount and when dependencies change
  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  // Select a recipe for the meal plan
  const selectRecipe = useCallback((recipe: ScoredRecipe) => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [...prev.selectedRecipes, recipe],
      recommendations: prev.recommendations.filter(r => r.id !== recipe.id)
    }));
    
    // Mark as recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [recipe.id, ...recentlyViewed.filter(id => id !== recipe.id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  }, []);

  // Reject a recipe and get a replacement
  const rejectRecipe = useCallback(async (recipeId: string) => {
    if (!profile) return;
    
    // Add to user's disliked meals
    addDislikedMeal(recipeId);
    
    setState(prev => ({
      ...prev,
      rejectedRecipes: [...prev.rejectedRecipes, recipeId],
      recommendations: prev.recommendations.filter(r => r.id !== recipeId)
    }));
    
    // Try to get a replacement
    const replacement = replaceDislikedRecipe(
      profile,
      recipes,
      [...state.selectedRecipes, ...state.recommendations],
      recipeId,
      mealType
    );
    
    if (replacement) {
      setState(prev => ({
        ...prev,
        recommendations: [...prev.recommendations, replacement]
      }));
    }
  }, [profile, addDislikedMeal, recipes, state.selectedRecipes, state.recommendations, mealType]);

  // Remove a recipe from selections
  const unselectRecipe = useCallback((recipeId: string) => {
    setState(prev => {
      const removedRecipe = prev.selectedRecipes.find(r => r.id === recipeId);
      if (!removedRecipe) return prev;
      
      return {
        ...prev,
        selectedRecipes: prev.selectedRecipes.filter(r => r.id !== recipeId),
        recommendations: [...prev.recommendations, removedRecipe]
      };
    });
  }, []);

  // Clear all selections and regenerate
  const clearAndRegenerate = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedRecipes: [],
      rejectedRecipes: []
    }));
    generateRecommendations();
  }, [generateRecommendations]);

  // Get meal budget info for display
  const mealBudgetInfo = useMemo(() => {
    if (!profile) return null;
    
    const { getMealBudget } = require('@/config/presetRules');
    return getMealBudget(profile, mealType, includeBreakfast);
  }, [profile, mealType, includeBreakfast]);

  return {
    // Current state
    recommendations: state.recommendations,
    selectedRecipes: state.selectedRecipes,
    rejectedRecipes: state.rejectedRecipes,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    selectRecipe,
    rejectRecipe,
    unselectRecipe,
    clearAndRegenerate,
    regenerate: generateRecommendations,
    
    // Helpers
    hasRecommendations: state.recommendations.length > 0,
    hasSelections: state.selectedRecipes.length > 0,
    totalSelected: state.selectedRecipes.length,
    mealBudgetInfo
  };
};