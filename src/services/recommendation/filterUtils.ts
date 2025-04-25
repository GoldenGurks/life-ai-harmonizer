
import { Recipe, RecommendationFilters } from '@/types/recipes';
import { ensureNutrientScore, validateRecipes } from '@/lib/recipeEnrichment';

/**
 * Filters recipes based on dietary restrictions and preferences
 * Enforces hard constraints (allergies, diet, disliked ingredients)
 * 
 * @param recipes - List of recipes to filter
 * @param constraints - User dietary constraints and preferences
 * @returns Filtered list of recipes that match the user's constraints
 */
export function filterRecipes(
  recipes: Recipe[], 
  constraints: RecommendationFilters
): Recipe[] {
  // Enrich and validate before filtering!
  const enrichedRecipes = ensureNutrientScore(recipes);
  validateRecipes(enrichedRecipes);

  console.log('Filtering recipes with constraints:', constraints);
  let filteredRecipes = [...enrichedRecipes];
  
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
      // Simple string matching for now - in a real app, this would use a more sophisticated
      // ingredient database with allergen classifications
      return !constraints.allergies?.some(allergen => 
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(allergen.toLowerCase())
        )
      );
    });
  }
  
  // Filter by maximum cooking time (if specified)
  if (constraints.maxCookTime && constraints.maxCookTime > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => {
      // Convert time string to minutes (assumes format like "25 mins" or "1 hr 30 mins")
      const timeString = recipe.time.toLowerCase();
      
      // Handle recipes with cookTimeMinutes already defined
      if (recipe.cookTimeMinutes) {
        return recipe.cookTimeMinutes <= constraints.maxCookTime!;
      }
      
      // Extract minutes from time string
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
    // If user has cuisine preferences, boost those recipes but don't exclude others completely
    // This is a "soft" filter that will be handled in scoring
  }
  
  console.log(`Filtered ${recipes.length} recipes down to ${filteredRecipes.length}`);
  return filteredRecipes;
}
