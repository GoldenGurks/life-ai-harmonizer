
import { Recipe } from '@/types/recipes';

/**
 * Finds similar recipes to the provided recipe
 * Uses content-based similarity (ingredients, tags)
 * 
 * @param recipe - Source recipe to find alternatives for
 * @param allRecipes - Pool of recipes to search for alternatives
 * @param count - Number of alternatives to return
 * @returns List of similar recipes
 */
export function findSimilarRecipes(
  recipe: Recipe, 
  allRecipes: Recipe[],
  count: number = 3
): Recipe[] {
  // Create a map of recipes with similarity scores
  const similarityMap = allRecipes
    .filter(r => r.id !== recipe.id) // Filter out the source recipe
    .map(r => {
      // Calculate ingredient overlap
      const sourceIngredients = new Set(recipe.ingredients.map(i => i.toLowerCase()));
      const targetIngredients = new Set(r.ingredients.map(i => i.toLowerCase()));
      
      // Calculate tag overlap
      const sourceTags = new Set(recipe.tags?.map(t => t.toLowerCase()) || []);
      const targetTags = new Set(r.tags?.map(t => t.toLowerCase()) || []);
      
      // Calculate similarity score based on ingredients and tags
      const ingredientOverlap = [...sourceIngredients].filter(i => targetIngredients.has(i)).length;
      const tagOverlap = [...sourceTags].filter(t => targetTags.has(t)).length;
      
      // Weighted similarity score
      const similarityScore = 
        (ingredientOverlap / Math.max(sourceIngredients.size, 1)) * 0.7 + 
        (tagOverlap / Math.max(sourceTags.size, 1)) * 0.3;
      
      return {
        ...r,
        score: similarityScore
      };
    });
  
  // Sort by similarity and return top N
  return similarityMap
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, count);
}
