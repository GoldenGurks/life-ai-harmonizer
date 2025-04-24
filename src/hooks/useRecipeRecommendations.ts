
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';
import { useMealPreferences } from './useMealPreferences';
import { Recipe, RecommendationWeights, RecommendationFilters, ScoringPreferences } from '@/types/recipes';
import { recommendationService } from '@/services/recommendationService';
import { recipeData } from '@/data/recipeDatabase';
import { ensureNutrientScore, validateRecipes } from '@/lib/recipeEnrichment';
import { PRESETS } from '@/config/recommendationPresets';

/**
 * Custom hook for recipe recommendations based on user profile and preferences
 * Implements filtering, scoring, and ranking of recipes according to the recommendation architecture
 * 
 * @param initialRecipes - Initial recipe dataset (defaults to recipeData from the database)
 * @returns Object containing recommendation functions and state
 */
export const useRecipeRecommendations = (initialRecipes: Recipe[] = recipeData) => {
  // Ensure all recipes are enriched with nutrientScore
  const enrichedInitialRecipes = ensureNutrientScore(initialRecipes);
  validateRecipes(enrichedInitialRecipes);

  // Access user profile and meal preferences
  const { profile } = useUserProfile();
  const { preferences } = useMealPreferences();
  
  // State for recommendation engine
  const [recipes, setRecipes] = useState<Recipe[]>(enrichedInitialRecipes);
  const [recentlyViewedRecipes, setRecentlyViewedRecipes] = useState<string[]>(() => {
    const stored = localStorage.getItem('recentlyViewedRecipes');
    return stored ? JSON.parse(stored) : [];
  });
  
  // Configurable scoring weights with default values from architecture
  const [scoreWeights, setScoreWeights] = useState<RecommendationWeights>({
    nutritionalFit: 0.35,
    similarityToLikes: 0.20,
    varietyBoost: 0.15,
    pantryMatch: 0.15,
    costScore: 0.10,
    recencyPenalty: 0.05
  });

  // Save recently viewed recipes to localStorage
  useEffect(() => {
    localStorage.setItem('recentlyViewedRecipes', JSON.stringify(recentlyViewedRecipes));
  }, [recentlyViewedRecipes]);

  /**
   * Creates recommendation filters from user profile and preferences
   */
  const createRecommendationFilters = useCallback((): RecommendationFilters => {
    if (!profile || !preferences) {
      return {
        dietaryRestrictions: [],
        dislikedMeals: []
      };
    }
    
    return {
      dietaryRestrictions: profile.dietaryRestrictions || [],
      dislikedMeals: profile.dislikedMeals || [],
      dietaryPreference: preferences.dietaryPreference,
      allergies: preferences.allergies || [],
      maxCookTime: preferences.cookingTime,
      cuisinePreferences: preferences.cuisinePreferences
    };
  }, [profile, preferences]);

  /**
   * Creates scoring preferences from user profile and preferences
   */
  const createScoringPreferences = useCallback((): ScoringPreferences => {
    if (!profile || !preferences) {
      return {
        likedMeals: [],
        pantry: [],
        recommendationPreset: 'Healthy'  // Default preset
      };
    }
    
    return {
      likedMeals: profile.likedMeals || [],
      pantry: profile.pantry || [],
      fitnessGoal: preferences.fitnessGoal,
      likedFoods: preferences.likedFoods || [],
      dislikedFoods: preferences.dislikedFoods || [],
      recentlyViewed: recentlyViewedRecipes,
      calorieTarget: preferences.calorieTarget,
      proteinTarget: preferences.proteinTarget,
      carbTarget: preferences.carbTarget,
      fatTarget: preferences.fatTarget,
      recommendationPreset: preferences.recommendationPreset || 'Healthy',
      recommendationWeights: preferences.recommendationWeights
    };
  }, [profile, preferences, recentlyViewedRecipes]);

  /**
   * Filters recipes based on hard constraints (allergies, diet, disliked ingredients)
   */
  const filteredRecipes = useMemo(() => {
    const filters = createRecommendationFilters();
    return recommendationService.filterRecipes(recipes, filters);
  }, [recipes, createRecommendationFilters]);

  /**
   * Scores and ranks recipes based on user preferences
   */
  const rankedRecipes = useMemo(() => {
    const scoringPreferences = createScoringPreferences();
    return recommendationService.scoreRecipes(
      filteredRecipes, 
      scoringPreferences, 
      scoreWeights
    );
  }, [filteredRecipes, createScoringPreferences, scoreWeights]);

  /**
   * Returns top N recommended recipes
   * @param n - Number of recipes to return
   * @returns Array of top N recipes
   */
  const getTopN = useCallback((n: number) => {
    return rankedRecipes.slice(0, n);
  }, [rankedRecipes]);

  /**
   * Refreshes recipe recommendations with new data
   * @param newRecipes - New recipe data (optional)
   */
  const refresh = useCallback((newRecipes?: Recipe[]) => {
    if (newRecipes) {
      setRecipes(newRecipes);
    }
  }, []);

  /**
   * Updates score weights for the recommendation algorithm
   * @param newWeights - New weight values
   */
  const updateWeights = useCallback((newWeights: Partial<RecommendationWeights>) => {
    setScoreWeights(prev => ({
      ...prev,
      ...newWeights
    }));
  }, []);

  /**
   * Finds alternative similar recipes to the given one
   * @param recipeId - ID of the recipe to find alternatives for
   * @param count - Number of alternatives to return
   * @returns Array of alternative recipes
   */
  const findAlternatives = useCallback((recipeId: string, count: number = 3) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];
    
    return recommendationService.findSimilarRecipes(recipe, recipes, count);
  }, [recipes]);

  /**
   * Marks a recipe as viewed, updating the recently viewed list
   * @param recipeId - ID of the recipe that was viewed
   */
  const markRecipeViewed = useCallback((recipeId: string) => {
    setRecentlyViewedRecipes(prev => {
      // Remove recipe if it's already in the list
      const filtered = prev.filter(id => id !== recipeId);
      // Add to the beginning (most recent)
      return [recipeId, ...filtered].slice(0, 50); // Limit to 50 most recent
    });
  }, []);

  /**
   * Likes a recipe, updating the user profile
   * @param recipeId - ID of the recipe to like
   */
  const likeRecipe = useCallback((recipeId: string) => {
    // This would update the user profile context in a real implementation
    console.log(`Liked recipe: ${recipeId}`);
    
    // Mark as viewed
    markRecipeViewed(recipeId);
  }, [markRecipeViewed]);

  /**
   * Dislikes a recipe, updating the user profile
   * @param recipeId - ID of the recipe to dislike
   */
  const dislikeRecipe = useCallback((recipeId: string) => {
    // This would update the user profile context in a real implementation
    console.log(`Disliked recipe: ${recipeId}`);
    
    // Mark as viewed
    markRecipeViewed(recipeId);
  }, [markRecipeViewed]);

  /**
   * Swaps a recipe for a different one
   * @param recipeId - ID of the recipe to swap out
   * @returns A new recommended recipe
   */
  const swapRecipe = useCallback((recipeId: string): Recipe | undefined => {
    // Mark the current recipe as viewed
    markRecipeViewed(recipeId);
    
    // Temporarily boost variety score to get a different type of recipe
    const tempWeights = {
      ...scoreWeights,
      varietyBoost: scoreWeights.varietyBoost * 2
    };
    
    // Create scoring preferences
    const scoringPreferences = createScoringPreferences();
    
    // Get filtered candidates excluding the current recipe
    const candidates = filteredRecipes.filter(r => r.id !== recipeId);
    
    // Score with temporary weights
    const scored = recommendationService.scoreRecipes(
      candidates,
      scoringPreferences,
      tempWeights
    );
    
    // Return the top recommendation
    return scored[0];
  }, [filteredRecipes, scoreWeights, createScoringPreferences, markRecipeViewed]);
  
  /**
   * Gets diversified recommendations for meal planning
   * @param count - Number of recipes to recommend
   * @param mealType - Type of meal (breakfast, lunch, dinner, any)
   * @param existingSelections - IDs of recipes already selected
   * @returns Array of recommended recipes
   */
  const getDiversifiedRecommendations = useCallback((
    count: number,
    mealType: string = 'any',
    existingSelections: string[] = []
  ) => {
    const scoringPreferences = createScoringPreferences();
    
    return recommendationService.getDiversifiedRecommendations(
      scoringPreferences,
      filteredRecipes,
      count,
      mealType,
      existingSelections
    );
  }, [filteredRecipes, createScoringPreferences]);

  /**
   * Gets recommendations based on specific ingredients
   * Useful for "cook with what you have" feature
   * @param ingredients - List of ingredients to include
   * @param count - Number of recipes to recommend
   * @returns Array of recommended recipes using the specified ingredients
   */
  const getRecommendationsWithIngredients = useCallback((
    ingredients: string[],
    count: number = 5
  ): Recipe[] => {
    // Create scoring preferences with emphasis on pantry match
    const scoringPreferences = {
      ...createScoringPreferences(),
      pantry: ingredients
    };
    
    // Score with emphasis on pantry match
    const tempWeights = {
      ...scoreWeights,
      pantryMatch: 0.5,  // Increase pantry match weight
      nutritionalFit: 0.2,
      similarityToLikes: 0.1,
      varietyBoost: 0.1,
      costScore: 0.05,
      recencyPenalty: 0.05
    };
    
    // Score and rank
    const scored = recommendationService.scoreRecipes(
      filteredRecipes,
      scoringPreferences,
      tempWeights
    );
    
    return scored.slice(0, count);
  }, [filteredRecipes, scoreWeights, createScoringPreferences]);

  return {
    recipes: rankedRecipes,
    getTopN,
    refresh,
    updateWeights,
    findAlternatives,
    scoreWeights,
    markRecipeViewed,
    likeRecipe,
    dislikeRecipe,
    swapRecipe,
    getDiversifiedRecommendations,
    getRecommendationsWithIngredients
  };
};
