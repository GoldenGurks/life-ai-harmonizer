
import { RecipeIngredient } from "@/types/recipes";

/**
 * Type guard to check if an ingredient is a RecipeIngredient object
 */
export function isRecipeIngredient(ingredient: string | RecipeIngredient): ingredient is RecipeIngredient {
  return typeof ingredient !== 'string' && ingredient !== null && typeof ingredient === 'object' && 'id' in ingredient;
}

/**
 * Safely convert any ingredient type to a string representation
 */
export function getIngredientAsString(ingredient: string | RecipeIngredient): string {
  if (isRecipeIngredient(ingredient)) {
    return ingredient.name || `Ingredient #${ingredient.id} (${ingredient.amount}${ingredient.unit})`;
  }
  return ingredient;
}

/**
 * Get ingredient ID safely (returns -1 if it's a string)
 */
export function getIngredientId(ingredient: string | RecipeIngredient): number {
  if (isRecipeIngredient(ingredient)) {
    return ingredient.id;
  }
  return -1; // Invalid ID for string ingredients
}

/**
 * Get ingredient amount safely (returns 0 if it's a string)
 */
export function getIngredientAmount(ingredient: string | RecipeIngredient): number {
  if (isRecipeIngredient(ingredient)) {
    return ingredient.amount;
  }
  return 0; // Default amount for string ingredients
}

/**
 * Checks if an ingredient contains a specific term (case insensitive)
 */
export function ingredientContains(ingredient: string | RecipeIngredient, term: string): boolean {
  const ingredientStr = getIngredientAsString(ingredient).toLowerCase();
  return ingredientStr.includes(term.toLowerCase());
}
