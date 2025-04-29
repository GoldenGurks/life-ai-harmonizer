
import { Recipe } from '@/types/recipes';
import { getIngredientAsString } from '@/utils/ingredientUtils';

/**
 * Calculates a cost score for recipe (lower cost is better)
 * Normalizes recipe cost against typical cost range
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
export function calculateCostScore(recipe: Recipe): number {
  // If recipe has nutrition with cost data, use that
  if (recipe.nutrition?.cost) {
    // Normalize against expected cost range (€2-€15)
    const min = 2;
    const max = 15;
    const actualCost = recipe.nutrition.cost;
    
    // Invert so lower cost = higher score
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, 1 - ((actualCost - min) / (max - min))));
  }
  
  // If recipe has legacy cost field, use that
  if (recipe.cost) {
    // Same normalization as above
    const min = 2;
    const max = 15;
    const actualCost = recipe.cost;
    
    return Math.max(0, Math.min(1, 1 - ((actualCost - min) / (max - min))));
  }
  
  // Estimate based on number of ingredients
  const ingredientCount = recipe.ingredients.length;
  const premiumIngredients = recipe.ingredients.filter(ing => {
    const ingStr = getIngredientAsString(ing).toLowerCase();
    return ingStr.includes('beef') || ingStr.includes('salmon') || 
           ingStr.includes('shrimp') || ingStr.includes('cheese');
  }).length;
  
  // Simple formula: more ingredients and premium ingredients = higher cost = lower score
  const estimatedScore = 1 - ((ingredientCount / 20) * 0.7 + (premiumIngredients / 5) * 0.3);
  
  return Math.max(0, Math.min(1, estimatedScore));
}
