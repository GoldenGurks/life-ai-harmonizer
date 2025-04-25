
import { Recipe } from '@/types/recipes';

/**
 * Calculates recency penalty to avoid showing the same recipes too often
 * Recently viewed recipes get a lower score
 * 
 * @param recipe - Recipe to score
 * @param recentlyViewed - Recently viewed recipe IDs
 * @returns Score from 0-1
 */
export function calculateRecencyScore(recipe: Recipe, recentlyViewed: string[]): number {
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return 1.0; // No penalty if no history
  }
  
  // If recipe was recently viewed, penalize it
  if (recentlyViewed.includes(recipe.id)) {
    // Find how recently it was viewed (position in the array)
    const recencyIndex = recentlyViewed.indexOf(recipe.id);
    // More recent views get a higher penalty (lower score)
    // Normalize to 0-0.8 scale (never complete exclusion)
    return 0.2 + 0.8 * (recencyIndex / Math.max(1, recentlyViewed.length - 1));
  }
  
  // Recipe wasn't recently viewed, no penalty
  return 1.0;
}
