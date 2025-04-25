
import { Recipe } from '@/types/recipes';

/**
 * Calculates how well the recipe uses ingredients from the user's pantry
 * Higher score means more ingredients from pantry (less shopping needed)
 * 
 * @param recipe - Recipe to score
 * @param pantry - User's pantry ingredients
 * @returns Score from 0-1
 */
export function calculatePantryMatchScore(recipe: Recipe, pantry: string[]): number {
  if (!pantry || pantry.length === 0) return 0.5; // Neutral score if pantry empty
  
  const pantryLower = pantry.map(item => item.toLowerCase());
  const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
  
  // Calculate how many recipe ingredients are in pantry
  let matchCount = 0;
  for (const ingredient of recipeIngredients) {
    if (pantryLower.some(item => ingredient.includes(item))) {
      matchCount++;
    }
  }
  
  // Calculate score based on percentage of ingredients in pantry
  const score = matchCount / recipeIngredients.length;
  return score;
}
