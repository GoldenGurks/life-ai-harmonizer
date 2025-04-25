
import { Recipe } from '@/types/recipes';

/**
 * Calculates variety score to prevent recommending too-similar recipes
 * Ensures diversity in recommendations
 * 
 * @param recipe - Recipe to score
 * @param likedMeals - Recently liked meals
 * @param recentlyViewed - Recently viewed recipes
 * @returns Score from 0-1
 */
export function calculateVarietyScore(recipe: Recipe, likedMeals: string[], recentlyViewed?: string[]): number {
  // Basic variety scoring - combine dish type and ingredient variety
  // Higher score means more variety (different from recent selections)
  
  // If no history, return neutral variety score
  if ((!likedMeals || likedMeals.length === 0) && (!recentlyViewed || recentlyViewed.length === 0)) {
    return 0.8; // Slightly favor variety when no history
  }
  
  // Default variety score
  let varietyScore = 0.5;
  
  // More advanced implementation would compare recipe vectors 
  // or ingredients to recent meals to ensure diversity
  
  // For now, implement a simple heuristic based on recipe category
  const recentCategories = new Set<string>();
  
  // Add categories from liked meals
  if (likedMeals && likedMeals.length > 0) {
    // This would work better with actual recipe objects, but for now
    // just use the category from the recipe ID if we can extract it
    likedMeals.forEach(id => {
      if (id.includes('_')) {
        const category = id.split('_')[0];
        recentCategories.add(category.toLowerCase());
      }
    });
  }
  
  // Check if current recipe category is different from recent categories
  const differentCategory = !recentCategories.has(recipe.category.toLowerCase());
  
  // Bonus for recipes that are different from recent categories
  if (differentCategory) {
    varietyScore += 0.3;
  }
  
  return Math.min(varietyScore, 1); // Ensure score is between 0 and 1
}
