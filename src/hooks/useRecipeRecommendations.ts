
import { useState, useMemo, useCallback } from 'react';
import { useUserProfile } from './useUserProfile';
import { useMealPreferences } from './useMealPreferences';
import { Recipe } from '@/types/recipes';
import { recommendationService } from '@/services/recommendationService';

/**
 * Custom hook for recipe recommendations based on user profile and preferences
 * Implements filtering, scoring, and ranking of recipes
 */
export const useRecipeRecommendations = (initialRecipes: Recipe[] = []) => {
  const { profile } = useUserProfile();
  const { preferences } = useMealPreferences();
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [scoreWeights, setScoreWeights] = useState({
    nutritionalFit: 0.35,
    similarityToLikes: 0.20,
    varietyBoost: 0.15,
    pantryMatch: 0.15,
    costScore: 0.10,
    recencyPenalty: 0.05
  });

  /**
   * Filters recipes based on hard constraints (allergies, diet, disliked ingredients)
   */
  const filteredRecipes = useMemo(() => {
    if (!profile) return recipes;
    
    return recommendationService.filterRecipes(recipes, {
      dietaryRestrictions: profile.dietaryRestrictions || [],
      dislikedMeals: profile.dislikedMeals || [],
      dietaryPreference: preferences.dietaryPreference,
      allergies: preferences.allergies || []
    });
  }, [recipes, profile, preferences]);

  /**
   * Scores and ranks recipes based on user preferences
   */
  const rankedRecipes = useMemo(() => {
    if (!profile) return filteredRecipes;
    
    return recommendationService.scoreRecipes(filteredRecipes, {
      likedMeals: profile.likedMeals || [],
      pantry: profile.pantry || [],
      fitnessGoal: preferences.fitnessGoal,
      likedFoods: preferences.likedFoods || [],
      dislikedFoods: preferences.dislikedFoods || []
    }, scoreWeights);
  }, [filteredRecipes, profile, preferences, scoreWeights]);

  /**
   * Returns top N recommended recipes
   */
  const getTopN = useCallback((n: number) => {
    return rankedRecipes.slice(0, n);
  }, [rankedRecipes]);

  /**
   * Refreshes recipe recommendations with new data
   */
  const refresh = useCallback((newRecipes?: Recipe[]) => {
    if (newRecipes) {
      setRecipes(newRecipes);
    }
  }, []);

  /**
   * Updates score weights for the recommendation algorithm
   */
  const updateWeights = useCallback((newWeights: Partial<typeof scoreWeights>) => {
    setScoreWeights(prev => ({
      ...prev,
      ...newWeights
    }));
  }, []);

  /**
   * Finds alternative similar recipes to the given one
   */
  const findAlternatives = useCallback((recipeId: string, count: number = 3) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    return recommendationService.findSimilarRecipes(recipe, recipes, count);
  }, [recipes]);

  return {
    recipes: rankedRecipes,
    getTopN,
    refresh,
    updateWeights,
    findAlternatives,
    scoreWeights
  };
};
