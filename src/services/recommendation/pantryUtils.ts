
import { Recipe } from '@/types/recipes';
import { ingredientContains } from '@/utils/ingredientUtils';

/**
 * Calculates how well a recipe matches available pantry items
 * 
 * @param recipe - Recipe to score
 * @param pantry - List of available ingredients
 * @returns Score from 0-1
 */
export function calculatePantryMatchScore(recipe: Recipe, pantry: string[]): number {
  // If no pantry items, return neutral score
  if (!pantry || pantry.length === 0) {
    return 0.5;
  }
  
  // Count ingredients that match pantry items
  let matchCount = 0;
  
  for (const ingredient of recipe.ingredients) {
    for (const pantryItem of pantry) {
      if (ingredientContains(ingredient, pantryItem)) {
        matchCount++;
        break;
      }
    }
  }
  
  // Calculate percentage of recipe ingredients found in pantry
  return matchCount / Math.max(recipe.ingredients.length, 1);
}
