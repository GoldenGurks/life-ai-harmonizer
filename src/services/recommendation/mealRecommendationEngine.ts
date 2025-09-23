/**
 * Enhanced Meal Recommendation Engine
 * 
 * Integrates meal budgets, nutritional scoring, and advanced filtering
 * to generate personalized meal recommendations based on fitness goals.
 */

import { Recipe, ScoringPreferences } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';
import { calculateMealConstraints, applyHardFilters, calculateNutritionalFitScore } from './mealBudgetService';
import { calculateVarietyScore } from './varietyUtils';
import { calculatePantryMatchScore } from './pantryUtils';
import { calculateCostScore } from './costUtils';
import { calculateRecencyScore } from './recencyUtils';

export interface ScoredRecipe extends Recipe {
  totalScore: number;
  nutritionalFitScore: number;
  varietyScore?: number;
  pantryScore?: number;
  costScore?: number;
  recencyScore?: number;
  likeBonus?: number;
  reasons?: string[]; // Explanation of why this recipe was recommended
}

/**
 * Generate meal recommendations using the enhanced engine
 */
export function generateMealRecommendations(
  userPrefs: UserPreferences,
  recipes: Recipe[],
  mealType: string,
  count: number = 5,
  includeBreakfast: boolean = true
): ScoredRecipe[] {
  console.log(`Generating ${count} ${mealType} recommendations for goal: ${userPrefs.recommendationPreset || userPrefs.fitnessGoal}`);
  
  // Step 1: Calculate meal constraints and budget
  const constraints = calculateMealConstraints(userPrefs, mealType, includeBreakfast);
  console.log(`Meal budget for ${mealType}:`, constraints.budget);
  
  // Step 2: Apply hard filters
  const candidateRecipes = recipes.filter(recipe => {
    // Filter by meal type if specified and recipe has tags
    if (recipe.tags && !recipe.tags.includes(mealType)) {
      // Allow recipes without specific meal type tags to pass through
      const mealTypeTags = ['breakfast', 'lunch', 'dinner', 'snack'];
      const hasMealTypeTag = recipe.tags.some(tag => mealTypeTags.includes(tag));
      if (hasMealTypeTag) {
        return false; // Recipe has meal type tags but not the one we want
      }
    }
    
    // Apply hard nutritional filters
    return applyHardFilters(recipe, constraints);
  });
  
  console.log(`Hard filters reduced ${recipes.length} recipes to ${candidateRecipes.length} candidates`);
  
  // Step 3: Remove disliked recipes
  const filteredRecipes = candidateRecipes.filter(recipe => 
    !userPrefs.dislikedMeals?.includes(recipe.id)
  );
  
  console.log(`After removing dislikes: ${filteredRecipes.length} recipes`);
  
  if (filteredRecipes.length === 0) {
    console.warn('No recipes found after filtering. Consider relaxing constraints.');
    return [];
  }
  
  // Step 4: Score all candidate recipes
  const scoredRecipes: ScoredRecipe[] = filteredRecipes.map(recipe => {
    const scores = scoreRecipe(recipe, userPrefs, constraints);
    return {
      ...recipe,
      ...scores
    };
  });
  
  // Step 5: Sort by total score (descending)
  scoredRecipes.sort((a, b) => b.totalScore - a.totalScore);
  
  // Step 6: Apply variety filter to avoid similar recipes
  const diversifiedRecipes = applyVarietyFilter(scoredRecipes, count * 2); // Get 2x to have room for variety
  
  // Step 7: Return top N recommendations
  const recommendations = diversifiedRecipes.slice(0, count);
  
  console.log(`Final recommendations:`, recommendations.map(r => ({ 
    name: r.title, 
    score: r.totalScore.toFixed(2),
    calories: r.calories,
    protein: r.protein
  })));
  
  return recommendations;
}

/**
 * Score a single recipe against user preferences and meal constraints
 */
function scoreRecipe(
  recipe: Recipe, 
  userPrefs: UserPreferences, 
  constraints: any
): {
  totalScore: number;
  nutritionalFitScore: number;
  varietyScore?: number;
  pantryScore?: number;
  costScore?: number;
  recencyScore?: number;
  likeBonus?: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Core nutritional fit score (most important)
  const nutritionalFitScore = calculateNutritionalFitScore(recipe, constraints);
  if (nutritionalFitScore > 0.8) reasons.push('Great nutritional fit');
  
  // Variety score (avoid repetitive ingredients)
  const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
  const varietyScore = calculateVarietyScore(recipe, recentlyViewed, []);
  if (varietyScore > 0.7) reasons.push('Good variety');
  
  // Pantry match score
  const pantryScore = calculatePantryMatchScore(recipe, userPrefs.pantry || []);
  if (pantryScore > 0.5) reasons.push('Uses pantry ingredients');
  
  // Cost score  
  const costScore = calculateCostScore(recipe);
  if (costScore > 0.7) reasons.push('Budget-friendly');
  
  // Recency score (avoid recently viewed)
  const recencyScore = calculateRecencyScore(recipe, recentlyViewed);
  
  // Like bonus
  const likeBonus = userPrefs.likedMeals?.includes(recipe.id) ? 0.2 : 0;
  if (likeBonus > 0) reasons.push('You liked this before');
  
  // Get weights from user preferences
  const weights = userPrefs.recommendationWeights || {
    nutritionalFit: 0.4,
    varietyBoost: 0.15,
    pantryMatch: 0.15,
    costScore: 0.15,
    recencyPenalty: 0.1,
    similarityToLikes: 0.05,
    metadataOverlap: 0.0,
    vectorSimilarity: 0.0,
    collaborativeFiltering: 0.0
  };
  
  // Calculate weighted total score
  const totalScore = (
    nutritionalFitScore * weights.nutritionalFit +
    varietyScore * weights.varietyBoost +
    pantryScore * weights.pantryMatch +
    costScore * weights.costScore +
    recencyScore * weights.recencyPenalty +
    likeBonus
  );
  
  return {
    totalScore: Math.max(0, Math.min(1, totalScore)),
    nutritionalFitScore,
    varietyScore,
    pantryScore,
    costScore,
    recencyScore,
    likeBonus,
    reasons
  };
}

/**
 * Apply variety filter to avoid too many similar recipes
 */
function applyVarietyFilter(scoredRecipes: ScoredRecipe[], maxCount: number): ScoredRecipe[] {
  const selected: ScoredRecipe[] = [];
  const usedMainIngredients = new Set<string>();
  
  for (const recipe of scoredRecipes) {
    if (selected.length >= maxCount) break;
    
    // Extract main ingredients (first 2-3 ingredients usually)
    const mainIngredients = recipe.ingredients
      .slice(0, 3)
      .map(ing => typeof ing === 'string' ? ing : ing.name || '')
      .map(name => name.toLowerCase().split(' ')[0]); // First word only
    
    // Check if this recipe shares too many main ingredients with already selected ones
    const overlap = mainIngredients.filter(ing => usedMainIngredients.has(ing)).length;
    const overlapRatio = overlap / Math.max(mainIngredients.length, 1);
    
    // Allow recipe if overlap is low (< 50%) or if it's a really high-scoring recipe
    if (overlapRatio < 0.5 || recipe.totalScore > 0.85) {
      selected.push(recipe);
      mainIngredients.forEach(ing => usedMainIngredients.add(ing));
    }
  }
  
  return selected;
}

/**
 * Replace a disliked recipe with the next best alternative
 */
export function replaceDislikedRecipe(
  userPrefs: UserPreferences,
  allRecipes: Recipe[],
  currentSelections: Recipe[],
  dislikedRecipeId: string,
  mealType: string
): ScoredRecipe | null {
  // Get fresh recommendations excluding current selections and the disliked recipe
  const excludeIds = [...currentSelections.map(r => r.id), dislikedRecipeId];
  const availableRecipes = allRecipes.filter(r => !excludeIds.includes(r.id));
  
  const recommendations = generateMealRecommendations(
    userPrefs,
    availableRecipes,
    mealType,
    1, // Just need one replacement
    true
  );
  
  return recommendations[0] || null;
}