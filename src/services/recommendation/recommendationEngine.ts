
import { Recipe, RecommendationFilters, RecommendationWeights, ScoringPreferences } from '@/types/recipes';
import { filterRecipes } from './filterUtils';
import { calculateNutritionalFitScore } from './nutritionUtils';
import { calculateSimilarityScore } from './similarityUtils';
import { calculateVarietyScore } from './varietyUtils';
import { calculatePantryMatchScore } from './pantryUtils';
import { calculateCostScore } from './costUtils';
import { calculateRecencyScore } from './recencyUtils';
import { findSimilarRecipes } from './similarRecipesUtils';
import { PRESETS } from '@/config/recommendationPresets';

/**
 * Scores recipes based on user preferences and configured weights
 * Implements the weighted scoring algorithm from the architecture
 * 
 * @param recipes - List of filtered recipes to score
 * @param userPreferences - User preferences for scoring
 * @param weights - Configuration of score component weights
 * @returns Scored and ranked recipes
 */
export function scoreRecipes(
  recipes: Recipe[],
  userPreferences: ScoringPreferences,
  weights: RecommendationWeights
): Recipe[] {
  console.log('Scoring recipes with preferences:', userPreferences);
  
  // Calculate scores for each recipe
  const scoredRecipes = recipes.map(recipe => {
    // 1. Nutritional Fit Score (0-1)
    const nutritionalFitScore = calculateNutritionalFitScore(recipe, userPreferences);
    
    // 2. Similarity to Likes Score (0-1)
    const similarityScore = calculateSimilarityScore(
      recipe, 
      userPreferences.likedMeals || [], // Provide empty array if undefined
      recipes, 
      userPreferences.likedFoods || [] // Provide empty array if undefined
    );
    
    // 3. Variety Boost (0-1) - encourage variety in suggestions
    const varietyScore = calculateVarietyScore(
      recipe, 
      userPreferences.likedMeals || [], // Provide empty array if undefined
      userPreferences.recentlyViewed || [] // Provide empty array if undefined
    );
    
    // 4. Pantry Match Score (0-1)
    const pantryScore = calculatePantryMatchScore(recipe, userPreferences.pantry || []);
    
    // 5. Cost Score (0-1) - lower cost is better
    const costScore = calculateCostScore(recipe);
    
    // 6. Recency Penalty (0-1) - penalize recently suggested recipes
    const recencyScore = calculateRecencyScore(recipe, userPreferences.recentlyViewed || []);
    
    // Calculate weighted score
    const weightedScore = 
      weights.nutritionalFit * nutritionalFitScore +
      weights.similarityToLikes * similarityScore +
      weights.varietyBoost * varietyScore +
      weights.pantryMatch * pantryScore + 
      weights.costScore * costScore +
      weights.recencyPenalty * recencyScore;
    
    // For debugging
    const scoreDetails = {
      nutritionalFit: nutritionalFitScore,
      similarityToLikes: similarityScore,
      varietyBoost: varietyScore,
      pantryMatch: pantryScore,
      costScore: costScore,
      recencyPenalty: recencyScore,
      totalScore: weightedScore
    };
    console.log(`Recipe ${recipe.title} scored: ${weightedScore.toFixed(2)}`, scoreDetails);
    
    // Return recipe with score
    return {
      ...recipe,
      score: weightedScore
    };
  });
  
  // Sort by score (highest first)
  return scoredRecipes.sort((a, b) => (b.score || 0) - (a.score || 0));
}

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
export function getDiversifiedRecommendations(
  userPreferences: ScoringPreferences,
  recipes: Recipe[],
  count: number,
  mealType?: string,
  existingSelections: string[] = []
): Recipe[] {
  // Filter recipes by meal type if specified
  let candidates = recipes;
  if (mealType && mealType !== 'any') {
    candidates = recipes.filter(r => 
      r.category.toLowerCase() === mealType.toLowerCase() ||
      r.tags.some(t => t.toLowerCase() === mealType.toLowerCase())
    );
  }
  
  // Get weights from preferences or from preset
  const presetName = userPreferences.recommendationPreset || 'Healthy';
  const presetWeights = PRESETS[presetName] || PRESETS['Healthy'];
  
  const weights: RecommendationWeights = userPreferences.recommendationWeights || presetWeights;
  
  // Add existing selections to recently viewed to avoid duplicates
  const preferencesWithExisting: ScoringPreferences = {
    ...userPreferences,
    // Safely merge recentlyViewed (if exists) with existingSelections
    recentlyViewed: [
      ...(userPreferences.recentlyViewed || []), 
      ...(existingSelections || [])
    ]
  };
  
  const scoredRecipes = scoreRecipes(candidates, preferencesWithExisting, weights);
  
  // Get top N recommendations
  return scoredRecipes.slice(0, count);
}
