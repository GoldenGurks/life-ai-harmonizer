
import { MealItem, UserPreferences, Recipe } from '@/types/meal-planning';
import { recipeDatabase } from '@/data/recipeDatabase';

export const mealSuggestionService = {
  // Generate meal suggestions based on user preferences
  generateSuggestions(preferences: UserPreferences, count: number = 3, mealType?: string): MealItem[] {
    let suggestions: MealItem[] = [];
    let availableRecipes = [...recipeDatabase];
    
    // Filter by meal type if specified
    if (mealType) {
      availableRecipes = availableRecipes.filter(recipe => 
        recipe.mealType === mealType.toLowerCase() ||
        recipe.tags.includes(mealType.toLowerCase())
      );
    }
    
    // Filter by dietary preference
    if (preferences.dietaryPreference) {
      const dietMap: Record<string, string[]> = {
        'vegan': ['vegan'],
        'vegetarian': ['vegetarian', 'vegan'],
        'pescatarian': ['pescatarian', 'vegetarian', 'vegan'],
        'keto': ['keto', 'low-carb'],
        // omnivore can eat anything, no filtering needed
      };
      
      if (preferences.dietaryPreference !== 'omnivore' && dietMap[preferences.dietaryPreference]) {
        availableRecipes = availableRecipes.filter(recipe => 
          dietMap[preferences.dietaryPreference].some(diet => 
            recipe.tags.includes(diet)
          )
        );
      }
    }
    
    // Filter out allergies
    if (preferences.allergies && preferences.allergies.length > 0) {
      availableRecipes = availableRecipes.filter(recipe => {
        // Check if any ingredient contains allergies
        return !preferences.allergies!.some(allergy => 
          recipe.ingredients.some(ingredient => 
            ingredient.name.toLowerCase().includes(allergy.toLowerCase())
          )
        );
      });
    }
    
    // Filter by cooking time
    if (preferences.cookingTime) {
      availableRecipes = availableRecipes.filter(recipe => 
        (recipe.prepTime + recipe.cookTime) <= preferences.cookingTime!
      );
    }
    
    // Boost recipes that match user's liked foods
    if (preferences.likedFoods && preferences.likedFoods.length > 0) {
      availableRecipes.forEach(recipe => {
        recipe.score = recipe.score || 0;
        
        preferences.likedFoods!.forEach(likedFood => {
          if (recipe.tags.includes(likedFood) || 
              recipe.name.toLowerCase().includes(likedFood.toLowerCase()) ||
              recipe.ingredients.some(i => i.name.toLowerCase().includes(likedFood.toLowerCase()))) {
            recipe.score += 2;
          }
        });
      });
    }
    
    // Penalize recipes that match user's disliked foods
    if (preferences.dislikedFoods && preferences.dislikedFoods.length > 0) {
      availableRecipes.forEach(recipe => {
        recipe.score = recipe.score || 0;
        
        preferences.dislikedFoods!.forEach(dislikedFood => {
          if (recipe.tags.includes(dislikedFood) || 
              recipe.name.toLowerCase().includes(dislikedFood.toLowerCase()) ||
              recipe.ingredients.some(i => i.name.toLowerCase().includes(dislikedFood.toLowerCase()))) {
            recipe.score -= 3;
          }
        });
      });
    }
    
    // Adjust for fitness goals
    if (preferences.fitnessGoal) {
      availableRecipes.forEach(recipe => {
        recipe.score = recipe.score || 0;
        
        switch(preferences.fitnessGoal) {
          case 'weight-loss':
            if (recipe.nutrition.calories < 500) recipe.score += 2;
            if (recipe.tags.includes('low-calorie')) recipe.score += 2;
            break;
          case 'muscle-gain':
            if (recipe.nutrition.protein > 25) recipe.score += 2;
            if (recipe.tags.includes('high-protein')) recipe.score += 2;
            break;
          case 'performance':
            if (recipe.nutrition.carbs > 40) recipe.score += 1;
            if (recipe.tags.includes('energy')) recipe.score += 2;
            break;
        }
      });
    }
    
    // Sort by score and take the top recipes
    availableRecipes.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Convert recipes to meal items
    suggestions = availableRecipes.slice(0, count).map(recipe => ({
      id: recipe.id,
      name: recipe.name,
      description: recipe.description || '',
      calories: recipe.nutrition.calories,
      protein: recipe.nutrition.protein,
      carbs: recipe.nutrition.carbs,
      fat: recipe.nutrition.fat,
      type: recipe.mealType,
      tags: recipe.tags,
      preparationTime: recipe.prepTime,
      cookingTime: recipe.cookTime,
      ingredients: recipe.ingredients.map(i => ({
        name: i.name,
        amount: i.amount.toString(),
        unit: i.unit
      })),
      instructions: recipe.instructions,
      image: recipe.imageUrl,
      nutritionScore: recipe.score || 0
    }));
    
    return suggestions;
  }
};
