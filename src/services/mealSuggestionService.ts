import { MealItem, UserPreferences } from '@/types/meal-planning';
import { Recipe } from '@/types/recipes';
import { recipeData } from '@/data/recipeDatabase';
import { getIngredientAsString, ingredientContains } from '@/utils/ingredientUtils';

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
          dietMap[preferences.dietaryPreference!].some(diet => 
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
          recipe.ingredients.some(ingredient => ingredientContains(ingredient, allergy))
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
              recipe.ingredients.some(i => ingredientContains(i, likedFood))) {
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
              recipe.ingredients.some(i => ingredientContains(i, dislikedFood))) {
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
    
    // Map Recipe objects to MealItem for compatibility
    const topRecipes = availableRecipes.slice(0, count);
    suggestions = topRecipes.map(recipe => {
      // Determine appropriate meal type based on the request or recipe category
      let mealItemType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' = 'lunch';
      
      if (mealType && mealType !== 'any') {
        // Use the requested meal type if it's a valid MealItem type
        if (['breakfast', 'lunch', 'dinner', 'snack', 'dessert'].includes(mealType.toLowerCase())) {
          mealItemType = mealType.toLowerCase() as any;
        }
      } else {
        // Try to determine from recipe category or tags
        const lowerCategory = recipe.category.toLowerCase();
        if (lowerCategory.includes('breakfast')) {
          mealItemType = 'breakfast';
        } else if (lowerCategory.includes('lunch')) {
          mealItemType = 'lunch';
        } else if (lowerCategory.includes('dinner')) {
          mealItemType = 'dinner';
        } else if (lowerCategory.includes('snack')) {
          mealItemType = 'snack';
        } else if (lowerCategory.includes('dessert')) {
          mealItemType = 'dessert';
        }
      }
      
      // Get nutrition data, either from the new nutrition object or from legacy properties
      const nutrition = recipe.nutrition || {
        calories: recipe.calories || 0,
        protein: recipe.protein || 0,
        carbs: recipe.carbs || 0,
        fat: recipe.fat || 0,
        fiber: recipe.fiber || 0,
        sugar: recipe.sugar || 0,
        cost: recipe.cost || 0
      };
      
      return {
        id: recipe.id,
        name: recipe.title,
        description: `${recipe.difficulty} recipe: ${recipe.tags.join(', ')}`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        sugar: nutrition.sugar || 0,
        type: mealItemType,
        tags: recipe.tags,
        preparationTime: 15, // Default values since these might not exist in Recipe
        cookingTime: parseInt(recipe.time) || 25,
        ingredients: recipe.ingredients.map(ing => {
          // Handle both string and RecipeIngredient types
          const ingredientStr = getIngredientAsString(ing);
          const parts = ingredientStr.split(' ');
          return {
            name: parts.slice(1).join(' ') || ingredientStr,
            amount: parts[0] || '1',
            unit: 'unit'
          };
        }),
        instructions: recipe.instructions || ['No detailed instructions available.'],
        image: recipe.image,
        nutritionScore: recipe.nutrientScore || 5
      };
    });

    return suggestions;
  }
};
