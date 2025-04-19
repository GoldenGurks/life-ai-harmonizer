
import { MealItem, UserPreferences, Recipe } from '@/types/meal-planning';
import { recipeData } from '@/data/recipeDatabase';

export const mealSuggestionService = {
  // Generate meal suggestions based on user preferences
  generateSuggestions(preferences: UserPreferences, count: number = 3, mealType?: string): MealItem[] {
    let suggestions: MealItem[] = [];
    let availableRecipes = [...recipeData];
    
    // Filter by meal type if specified
    if (mealType) {
      availableRecipes = availableRecipes.filter(recipe => 
        recipe.category.toLowerCase() === mealType.toLowerCase() ||
        recipe.tags.some(tag => tag.toLowerCase() === mealType.toLowerCase())
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
            recipe.tags.some(tag => tag.toLowerCase() === diet.toLowerCase())
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
            ingredient.toLowerCase().includes(allergy.toLowerCase())
          )
        );
      });
    }
    
    // Filter by cooking time
    if (preferences.cookingTime) {
      availableRecipes = availableRecipes.filter(recipe => {
        const recipeTime = parseInt(recipe.time.match(/\d+/)?.[0] || '0');
        return recipeTime <= preferences.cookingTime!;
      });
    }
    
    // Boost recipes that match user's liked foods
    if (preferences.likedFoods && preferences.likedFoods.length > 0) {
      availableRecipes.forEach(recipe => {
        let score = 0;
        
        preferences.likedFoods!.forEach(likedFood => {
          if (recipe.tags.some(tag => tag.toLowerCase().includes(likedFood.toLowerCase())) || 
              recipe.title.toLowerCase().includes(likedFood.toLowerCase()) ||
              recipe.ingredients.some(i => i.toLowerCase().includes(likedFood.toLowerCase()))) {
            score += 2;
          }
        });
        
        // @ts-ignore - Adding score property dynamically
        recipe.score = score;
      });
    }
    
    // Penalize recipes that match user's disliked foods
    if (preferences.dislikedFoods && preferences.dislikedFoods.length > 0) {
      availableRecipes.forEach(recipe => {
        // @ts-ignore - Ensure score property exists
        recipe.score = recipe.score || 0;
        
        preferences.dislikedFoods!.forEach(dislikedFood => {
          if (recipe.tags.some(tag => tag.toLowerCase().includes(dislikedFood.toLowerCase())) || 
              recipe.title.toLowerCase().includes(dislikedFood.toLowerCase()) ||
              recipe.ingredients.some(i => i.toLowerCase().includes(dislikedFood.toLowerCase()))) {
            // @ts-ignore - Modifying score property
            recipe.score -= 3;
          }
        });
      });
    }
    
    // Adjust for fitness goals
    if (preferences.fitnessGoal) {
      availableRecipes.forEach(recipe => {
        // @ts-ignore - Ensure score property exists
        recipe.score = recipe.score || 0;
        
        switch(preferences.fitnessGoal) {
          case 'weight-loss':
            if (recipe.calories < 500) {
              // @ts-ignore - Modifying score property
              recipe.score += 2;
            }
            if (recipe.tags.some(tag => tag.toLowerCase() === 'low-calorie')) {
              // @ts-ignore - Modifying score property
              recipe.score += 2;
            }
            break;
          case 'muscle-gain':
            if (recipe.protein > 25) {
              // @ts-ignore - Modifying score property
              recipe.score += 2;
            }
            if (recipe.tags.some(tag => tag.toLowerCase() === 'high-protein')) {
              // @ts-ignore - Modifying score property
              recipe.score += 2;
            }
            break;
          case 'performance':
            if (recipe.carbs > 40) {
              // @ts-ignore - Modifying score property
              recipe.score += 1;
            }
            if (recipe.tags.some(tag => tag.toLowerCase() === 'energy')) {
              // @ts-ignore - Modifying score property
              recipe.score += 2;
            }
            break;
        }
      });
    }
    
    // Sort by score and take the top recipes
    // @ts-ignore - Sort by score property
    availableRecipes.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    // Convert recipes to meal items
    suggestions = availableRecipes.slice(0, count).map(recipe => {
      const mealType = recipe.category.toLowerCase();
      // Ensure the meal type is one of the valid types
      const validType = ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType) 
        ? mealType as "breakfast" | "lunch" | "dinner" | "snack" 
        : "snack";
        
      return {
        id: recipe.id,
        name: recipe.title,
        description: recipe.title,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fat: recipe.fat,
        type: validType,
        tags: recipe.tags,
        preparationTime: parseInt(recipe.time.match(/\d+/)?.[0] || '0'),
        cookingTime: parseInt(recipe.time.match(/\d+/)?.[0] || '0'),
        ingredients: recipe.ingredients.map(i => ({
          name: i,
          amount: '1',
          unit: 'serving'
        })),
        instructions: recipe.ingredients,
        image: recipe.image,
        nutritionScore: 0,
        difficulty: recipe.difficulty
      };
    }) as MealItem[];
    
    return suggestions;
  }
};
