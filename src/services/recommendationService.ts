
import { Recipe, RecommendationWeights, RecommendationFilters, ScoringPreferences, EnrichedRecipe } from '@/types/recipes';
import { validateRecipes } from '@/lib/recipeEnrichment';
import { PRESETS } from '@/config/recommendationPresets';
import { ensureNutritionAndCost } from '@/services/nutritionService';

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
  async preprocessRecipes(recipes: Recipe[]): Promise<EnrichedRecipe[]> {
    // Ensure all recipes have nutrition data calculated
    const enrichedRecipes = await ensureNutritionAndCost(recipes);
    
    // Validate the recipes
    validateRecipes(enrichedRecipes);
    
    return enrichedRecipes;
  },
  
  /**
   * Filters recipes based on user constraints
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
  getDiversifiedRecommendations,

  /**
   * Complete recommendation pipeline - preprocess, filter, score and rank recipes
   */
  async getRecommendations(
    recipes: Recipe[],
    userPreferences: ScoringPreferences,
    filters: RecommendationFilters,
    count: number = 5
  ): Promise<EnrichedRecipe[]> {
    // Step 1: Preprocess recipes (ensure nutrition data)
    const enrichedRecipes = await this.preprocessRecipes(recipes);
    
    // Step 2: Apply hard filters
    const filteredRecipes = this.filterRecipes(enrichedRecipes, filters);
    
    // Step 3: Get weights from preferences or preset
    const presetName = userPreferences.recommendationPreset || 'Healthy';
    const weights = userPreferences.recommendationWeights || PRESETS[presetName];
    
    // Step 4: Score and rank recipes
    const scoredRecipes = this.scoreRecipes(filteredRecipes, userPreferences, weights);
    
    // Step 5: Return top N recommendations
    return scoredRecipes.slice(0, count);
  }
};
