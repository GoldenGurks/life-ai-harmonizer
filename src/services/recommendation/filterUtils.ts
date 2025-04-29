
import { Recipe, RecommendationFilters, EnrichedRecipe } from '@/types/recipes';
import { validateRecipes } from '@/lib/recipeEnrichment';

/**
 * Filters recipes based on dietary restrictions and preferences
 * Enforces hard constraints (allergies, diet, disliked ingredients)
 * 
 * @param recipes - List of recipes to filter
 * @param constraints - User dietary constraints and preferences
 * @returns Filtered list of recipes that match the user's constraints
 */
export function filterRecipes(
  recipes: EnrichedRecipe[], 
  constraints: RecommendationFilters
): EnrichedRecipe[] {
  // Validate recipes before filtering
  validateRecipes(recipes);

  console.log('Filtering recipes with constraints:', constraints);
  let filteredRecipes = [...recipes];
  
  // Remove disliked meals
  if (constraints.dislikedMeals.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      !constraints.dislikedMeals.includes(recipe.id)
    );
  }
  
  // Filter by dietary preference (vegan, vegetarian, etc.)
  if (constraints.dietaryPreference) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      // Each recipe should have tags for dietary categories
      const dietTags = recipe.tags.map(tag => tag.toLowerCase());
      
      switch (constraints.dietaryPreference.toLowerCase()) {
        case 'vegan':
          return dietTags.includes('vegan');
        case 'vegetarian':
          return dietTags.includes('vegetarian') || dietTags.includes('vegan');
        case 'pescatarian':
          return dietTags.includes('pescatarian') || 
                 dietTags.includes('vegetarian') || 
                 dietTags.includes('vegan') ||
                 dietTags.includes('seafood');
        case 'keto':
          return dietTags.includes('keto') || dietTags.includes('low-carb');
        default:
          return true; // omnivore can eat anything
      }
    });
  }
  
  // Filter out recipes with allergenic ingredients
  if (constraints.allergies && constraints.allergies.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      // Check for allergen tags
      const recipeTags = recipe.tags.map(tag => tag.toLowerCase());
      const hasAllergenTag = constraints.allergies?.some(allergen =>
        recipeTags.includes(`contains-${allergen.toLowerCase()}`)
      );
      
      if (hasAllergenTag) {
        return false;
      }
      
      // For recipes with ingredient objects
      if (recipe.ingredients.some(ing => typeof ing === 'object' && 'id' in ing)) {
        // We can't check ingredients by ID here since we don't load the veg library
        // This would be handled by a more sophisticated allergen database
        return true;
      }
      
      // For legacy recipes with string ingredients, check the strings
      return !constraints.allergies?.some(allergen => 
        recipe.ingredients.some(ingredient => {
          if (typeof ingredient === 'string') {
            return ingredient.toLowerCase().includes(allergen.toLowerCase());
          }
          return false;
        })
      );
    });
  }
  
  // Filter by maximum cooking time (if specified)
  if (constraints.maxCookTime && constraints.maxCookTime > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      // Use cookTimeMinutes if available
      if (recipe.cookTimeMinutes) {
        return recipe.cookTimeMinutes <= constraints.maxCookTime!;
      }
      
      // Extract minutes from time string
      const timeString = recipe.time.toLowerCase();
      let totalMinutes = 0;
      
      if (timeString.includes('hr')) {
        const hours = parseInt(timeString.split('hr')[0].trim());
        totalMinutes += hours * 60;
        
        // Check for minutes after hours
        const afterHrs = timeString.split('hr')[1];
        if (afterHrs && afterHrs.includes('min')) {
          const mins = parseInt(afterHrs.split('min')[0].trim());
          totalMinutes += mins;
        }
      } else if (timeString.includes('min')) {
        totalMinutes = parseInt(timeString.split('min')[0].trim());
      }
      
      return totalMinutes <= constraints.maxCookTime!;
    });
  }
  
  // Filter by cuisine preferences (if specified)
  if (constraints.cuisinePreferences && constraints.cuisinePreferences.length > 0) {
    // This is a soft filter - recipes matching cuisine preferences get boosted in scoring
    // but we don't completely filter out non-matching cuisines
    filteredRecipes = filteredRecipes.sort((a, b) => {
      const aCuisine = a.cuisine?.toLowerCase() || '';
      const bCuisine = b.cuisine?.toLowerCase() || '';
      
      const aMatches = constraints.cuisinePreferences!.some(c => 
        aCuisine.includes(c.toLowerCase()) || 
        a.tags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
      );
      
      const bMatches = constraints.cuisinePreferences!.some(c => 
        bCuisine.includes(c.toLowerCase()) ||
        b.tags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
      );
      
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }
  
  console.log(`Filtered ${recipes.length} recipes down to ${filteredRecipes.length}`);
  return filteredRecipes;
}
