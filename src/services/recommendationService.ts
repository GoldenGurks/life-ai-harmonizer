
import { Recipe, RecommendationWeights, RecommendationFilters, ScoringPreferences } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';
import { ensureNutrientScore, validateRecipes } from '@/lib/recipeEnrichment';
import { PRESETS } from '@/config/recommendationPresets';

// Import from the refactored modules
import { filterRecipes } from './recommendation/filterUtils';
import { scoreRecipes, getDiversifiedRecommendations } from './recommendation/recommendationEngine';
import { findSimilarRecipes } from './recommendation/similarRecipesUtils';

/**
 * Service responsible for recipe recommendations, filtering, scoring, and ranking
 * Implements the recommendation architecture with filtering, scoring, and ranking
 */
export const recommendationService = {
  /**
   * Filters recipes based on dietary restrictions and preferences
   * Enforces hard constraints (allergies, diet, disliked ingredients)
   * 
   * @param recipes - List of recipes to filter
   * @param constraints - User dietary constraints and preferences
   * @returns Filtered list of recipes that match the user's constraints
   */
  filterRecipes,
  
  /**
   * Scores recipes based on user preferences and configured weights
   * Implements the weighted scoring algorithm from the architecture
   * 
   * @param recipes - List of filtered recipes to score
   * @param userPreferences - User preferences for scoring
   * @param weights - Configuration of score component weights
   * @returns Scored and ranked recipes
   */
  scoreRecipes,
  
  /**
   * Finds similar recipes to the provided recipe
   * Uses content-based similarity (ingredients, tags)
   * 
   * @param recipe - Source recipe to find alternatives for
   * @param allRecipes - Pool of recipes to search for alternatives
   * @param count - Number of alternatives to return
   * @returns List of similar recipes
   */
  findSimilarRecipes,
  
  /**
   * Gets diversified recommendations for meal planning
   * Ensures variety across the meal plan
   * 
   * @param userPreferences - User preferences
   * @param recipes - Available recipes
   * @param count - Number of recipes to recommend
   * @param mealType - Type of meal to recommend (breakfast, lunch, dinner)
   * @returns List of recommended recipes
   */
  getDiversifiedRecommendations
};
