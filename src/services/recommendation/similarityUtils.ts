
import { Recipe } from '@/types/recipes';
import { ingredientContains } from '@/utils/ingredientUtils';

/**
 * Calculates similarity between this recipe and previously liked recipes/foods
 * 
 * @param recipe - Recipe to score
 * @param likedMeals - IDs of meals the user has liked
 * @param allRecipes - All available recipes
 * @param likedFoods - Ingredients/foods the user likes
 * @returns Score from 0-1
 */
export function calculateSimilarityScore(
  recipe: Recipe, 
  likedMeals: string[], 
  allRecipes: Recipe[],
  likedFoods?: string[]
): number {
  // If no liked meals or foods, return neutral score
  if ((!likedMeals || likedMeals.length === 0) && (!likedFoods || likedFoods.length === 0)) {
    return 0.5;
  }
  
  let similarityScore = 0;
  
  // Calculate similarity to liked meals
  if (likedMeals && likedMeals.length > 0) {
    // Find the liked recipes
    const likedRecipes = allRecipes.filter(r => likedMeals.includes(r.id));
    
    if (likedRecipes.length > 0) {
      // Tag similarity between current recipe and liked recipes
      let tagSimilarity = 0;
      const currentTags = new Set(recipe.tags?.map(t => t.toLowerCase()) || []);
      
      likedRecipes.forEach(likedRecipe => {
        const likedTags = new Set(likedRecipe.tags?.map(t => t.toLowerCase()) || []);
        const commonTags = [...currentTags].filter(t => likedTags.has(t)).length;
        tagSimilarity += commonTags / Math.max(currentTags.size, 1);
      });
      
      // Normalize tag similarity
      tagSimilarity /= likedRecipes.length;
      similarityScore += tagSimilarity * 0.7; // 70% weight to tag similarity
    }
  }
  
  // Calculate similarity to liked foods/ingredients
  if (likedFoods && likedFoods.length > 0) {
    // Check if recipe contains any liked foods
    let foodMatches = 0;
    for (const food of likedFoods) {
      for (const ingredient of recipe.ingredients) {
        if (ingredientContains(ingredient, food)) {
          foodMatches++;
          break;
        }
      }
    }
    
    const foodSimilarity = foodMatches / Math.max(likedFoods.length, 1);
    similarityScore += foodSimilarity * 0.3; // 30% weight to ingredient similarity
  }
  
  return Math.min(similarityScore, 1); // Ensure score is between 0 and 1
}
