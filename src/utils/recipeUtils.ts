
import { Recipe, EnrichedRecipe } from '@/types/recipes';

/**
 * Safely get sugar value from a recipe, handling both new and legacy formats
 */
export function getRecipeSugar(recipe: Recipe): number {
  if (recipe.nutrition?.sugar !== undefined) {
    return recipe.nutrition.sugar;
  }
  // Use nullish coalescing to handle undefined sugar
  return recipe.sugar ?? 0;
}

/**
 * Safely get all nutrition values from a recipe, handling both new and legacy formats
 */
export function getRecipeNutrition(recipe: Recipe) {
  // If recipe already has the nutrition object, use it
  if (recipe.nutrition) {
    return recipe.nutrition;
  }
  
  // Otherwise use legacy fields
  return {
    calories: recipe.calories || 0,
    protein: recipe.protein || 0,
    carbs: recipe.carbs || 0, 
    fat: recipe.fat || 0,
    fiber: recipe.fiber || 0,
    sugar: recipe.sugar ?? 0, // Use nullish coalescing for sugar
    cost: recipe.cost || 0
  };
}

/**
 * Convert a Recipe to an EnrichedRecipe with complete nutrition data
 */
export function enrichRecipe(recipe: Recipe): EnrichedRecipe {
  if (recipe.nutrition) {
    return recipe as EnrichedRecipe;
  }
  
  return {
    ...recipe,
    nutrition: {
      calories: recipe.calories || 0,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0,
      fiber: recipe.fiber || 0,
      sugar: recipe.sugar ?? 0, // Use nullish coalescing for sugar
      cost: recipe.cost || 0
    }
  };
}
