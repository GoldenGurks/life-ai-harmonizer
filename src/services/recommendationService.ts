
import { Recipe, RecommendationWeights, RecommendationFilters, ScoringPreferences, EnrichedRecipe } from '@/types/recipes';
import { validateRecipes } from '@/lib/recipeEnrichment';
import { PRESETS } from '@/config/recommendationPresets';
import { ensureNutritionAndCost } from '@/services/nutritionService';
import { suggestByStyle } from '@/lib/llmPrompts';

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
   * Use LLM to get recipe suggestions based on author style
   * @param style - Author or cuisine style to emulate
   * @param ingredients - List of ingredients to include
   * @returns Enriched recipes from the LLM
   */
  async getLLMRecipeSuggestions(style: string, ingredients: string[]): Promise<EnrichedRecipe[]> {
    // Get recipe suggestions from LLM
    const llmRecipes = await suggestByStyle(style, ingredients);
    
    // Ensure they have nutrition data
    return await ensureNutritionAndCost(llmRecipes);
  },

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
    let scoredRecipes = this.scoreRecipes(filteredRecipes, userPreferences, weights);
    
    // Step 5: Check if we need to use LLM for author style or cold start
    if (userPreferences.authorStyle || scoredRecipes.length === 0) {
      console.log('Using LLM for recommendations - authorStyle:', userPreferences.authorStyle);
      
      // Determine style and ingredients
      const style = userPreferences.authorStyle || 'Mediterranean'; // Default style if none specified
      const ingredients = userPreferences.pantry || []; // Use pantry items as ingredient suggestions
      
      // Get LLM suggestions
      const llmRecipes = await this.getLLMRecipeSuggestions(style, ingredients);
      
      // If we're using LLM due to no recommendations, replace entirely
      if (scoredRecipes.length === 0) {
        scoredRecipes = llmRecipes;
      } 
      // If we're using LLM for style, blend with existing recommendations
      else {
        // Take top half from scored recipes and half from LLM
        const halfCount = Math.ceil(count / 2);
        scoredRecipes = [
          ...scoredRecipes.slice(0, halfCount),
          ...llmRecipes.slice(0, count - halfCount)
        ];
      }
    }
    
    // Return top N recommendations
    return scoredRecipes.slice(0, count);
  }
};
