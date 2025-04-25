
import { Recipe } from '@/types/recipes';

/**
 * Calculates cost-effectiveness score
 * Lower cost = higher score
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
export function calculateCostScore(recipe: Recipe): number {
  // If we have explicit cost data, use it
  if (recipe.cost) {
    // Normalize cost on a 0-1 scale where 0 is expensive and 1 is cheap
    // Assume cost range is from $2-$20 per serving
    const maxCost = 20;
    const minCost = 2;
    return 1 - Math.min(1, Math.max(0, (recipe.cost - minCost) / (maxCost - minCost)));
  }
  
  // If no explicit cost, estimate based on ingredients count and protein source
  // More ingredients generally means more expensive
  const ingredientCountPenalty = Math.min(0.5, recipe.ingredients.length / 20);
  
  // Check for expensive protein sources
  const hasExpensiveProtein = recipe.ingredients.some(ing => {
    const lowerIng = ing.toLowerCase();
    return lowerIng.includes('steak') || 
           lowerIng.includes('salmon') || 
           lowerIng.includes('shrimp') ||
           lowerIng.includes('lamb');
  });
  
  const proteinPenalty = hasExpensiveProtein ? 0.3 : 0;
  
  // Calculate final cost score (higher = more cost-effective)
  return Math.max(0, 1 - ingredientCountPenalty - proteinPenalty);
}
