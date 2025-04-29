
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { loadVegLibrary, getFoodItemById, convertFoodItemToRecipe, calculateNutritionAndCost, ensureNutritionAndCost } from '@/services/nutritionService';
import { FoodItem, Recipe, EnrichedRecipe, RecipeIngredient } from '@/types/recipes';
import { getIngredientId, getIngredientAmount, isRecipeIngredient } from '@/utils/ingredientUtils';

describe('Nutrition Service', () => {
  let vegLibrary: FoodItem[];

  // Mock food library data for testing
  const mockLibrary: FoodItem[] = [
    {
      id: 1,
      name: 'Tomato',
      category: 'Vegetable',
      servingSize: 100,
      servingUnit: 'g',
      costPer100g: 0.45,
      nutrients: {
        calories: 18,
        protein_g: 0.9,
        carbs_g: 3.9,
        fat_g: 0.2,
        fiber_g: 1.2,
        sugar_g: 2.6 // Added sugar value
      }
    },
    {
      id: 2,
      name: 'Rice, white',
      category: 'Grain',
      servingSize: 100,
      servingUnit: 'g',
      costPer100g: 0.30,
      nutrients: {
        calories: 130,
        protein_g: 2.7,
        carbs_g: 28.2,
        fat_g: 0.3,
        fiber_g: 0.4,
        sugar_g: 0.1
      }
    },
    {
      id: 3,
      name: 'Olive oil',
      category: 'Oil',
      servingSize: 100,
      servingUnit: 'ml',
      costPer100g: 1.20,
      nutrients: {
        calories: 884,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 100,
        fiber_g: 0,
        sugar_g: 0 // Added sugar value
      }
    }
  ];

  // Mock fetch for testing
  beforeAll(async () => {
    // Mock implementation of fetch
    global.fetch = vi.fn().mockImplementation(() => 
      Promise.resolve({
        text: () => Promise.resolve(mockLibrary.map(item => JSON.stringify(item)).join('\n'))
      })
    );

    vegLibrary = await loadVegLibrary();
  });

  it('should load the vegetable library data', async () => {
    expect(vegLibrary.length).toBeGreaterThan(0);
    expect(vegLibrary[0].name).toBe('Tomato');
  });

  it('should find food items by ID', async () => {
    const tomato = await getFoodItemById(1);
    const rice = await getFoodItemById(2);
    
    expect(tomato).toBeDefined();
    expect(rice).toBeDefined();
    
    if (tomato) {
      expect(tomato.name).toBe('Tomato');
      expect(tomato.nutrients.calories).toBe(18);
      expect(tomato.nutrients.sugar_g).toBe(2.6); // Test sugar value
    }
    
    if (rice) {
      expect(rice.name).toBe('Rice, white');
      expect(rice.nutrients.calories).toBe(130);
      expect(rice.nutrients.sugar_g).toBe(0.1); // Test sugar value
    }
  });
  
  it('should convert FoodItem to Recipe format correctly', async () => {
    const tomato = vegLibrary[0];
    
    const recipe = convertFoodItemToRecipe(tomato);
    
    expect(recipe.id).toBe('food-1');
    expect(recipe.title).toBe('Tomato');
    expect(recipe.nutrition.calories).toBe(18);
    expect(recipe.nutrition.protein).toBe(0.9);
    expect(recipe.nutrition.carbs).toBe(3.9);
    expect(recipe.nutrition.sugar).toBe(2.6); // Test sugar value conversion
    expect(getIngredientId(recipe.ingredients[0])).toBe(1);
    expect(getIngredientAmount(recipe.ingredients[0])).toBe(100);
  });

  it('should calculate nutrition and cost for a recipe', async () => {
    // Rice with olive oil recipe
    const recipe: Recipe = {
      id: 'test-recipe',
      title: 'Simple Rice with Oil',
      image: 'test.jpg',
      time: '20 mins',
      category: 'Side Dish',
      tags: ['Simple', 'Vegetarian'],
      saved: false,
      ingredients: [
        { id: 2, amount: 200, unit: 'g' } as RecipeIngredient, // 200g rice
        { id: 3, amount: 15, unit: 'ml' } as RecipeIngredient  // 15ml olive oil
      ],
      difficulty: 'Easy'
    };
    
    const enriched = await calculateNutritionAndCost(recipe, mockLibrary);
    
    expect(enriched.nutrition).toBeDefined();
    expect(enriched.nutrition.calories).toBe(Math.round(260 + 132.6)); // 200g rice + 15ml oil
    expect(enriched.nutrition.protein).toBe(5.4); // 2.7 * 2
    expect(enriched.nutrition.carbs).toBe(56.4); // 28.2 * 2
    expect(enriched.nutrition.fat).toBe(Math.round((0.3 * 2 + 15) * 10) / 10); // (0.3*2 + 15) rounded
    expect(enriched.nutrition.sugar).toBe(0.2); // 0.1 * 2 (from rice)
    expect(enriched.nutrition.cost).toBeGreaterThan(0);
  });

  it('should handle missing ingredients gracefully', async () => {
    const recipe: Recipe = {
      id: 'test-missing',
      title: 'Recipe with Missing Ingredient',
      image: 'test.jpg',
      time: '10 mins',
      category: 'Test',
      tags: ['Test'],
      saved: false,
      ingredients: [
        { id: 1, amount: 100, unit: 'g' } as RecipeIngredient, // Valid
        { id: 999, amount: 50, unit: 'g' } as RecipeIngredient  // Invalid ID
      ],
      difficulty: 'Easy'
    };
    
    // Mock console.warn to verify warnings are logged
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const enriched = await calculateNutritionAndCost(recipe, mockLibrary);
    
    expect(enriched.nutrition).toBeDefined();
    // Should only include nutrients from tomato
    expect(enriched.nutrition.calories).toBe(18);
    expect(enriched.nutrition.sugar).toBe(2.6); // Should include sugar from tomato
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toContain('missing ingredients');
    
    consoleSpy.mockRestore();
  });

  it('should ensure all recipes have nutrition data', async () => {
    const recipes: Recipe[] = [
      // Recipe with ingredients that need calculation
      {
        id: 'recipe1',
        title: 'Recipe 1',
        image: 'test.jpg',
        time: '20 mins',
        category: 'Main',
        tags: ['Test'],
        saved: false,
        ingredients: [
          { id: 1, amount: 100, unit: 'g' } as RecipeIngredient,
          { id: 2, amount: 100, unit: 'g' } as RecipeIngredient
        ],
        difficulty: 'Medium'
      },
      // Recipe with existing nutrition (should be preserved)
      {
        id: 'recipe2',
        title: 'Recipe 2',
        image: 'test.jpg',
        time: '10 mins',
        category: 'Side',
        tags: ['Test'],
        saved: false,
        ingredients: [],
        difficulty: 'Easy',
        nutrition: {
          calories: 300,
          protein: 10,
          carbs: 40,
          fat: 12,
          fiber: 5,
          sugar: 3,
          cost: 3.50
        }
      },
      // Recipe with legacy nutrition fields
      {
        id: 'recipe3',
        title: 'Recipe 3',
        image: 'test.jpg',
        time: '15 mins',
        category: 'Dessert',
        tags: ['Test'],
        saved: false,
        ingredients: [],
        difficulty: 'Easy',
        calories: 250,
        protein: 5,
        carbs: 35,
        fat: 10,
        fiber: 2,
        sugar: 8
      }
    ];
    
    const enriched = await ensureNutritionAndCost(recipes);
    
    expect(enriched.length).toBe(3);
    
    // First recipe should have calculated nutrition
    expect(enriched[0].nutrition).toBeDefined();
    expect(enriched[0].nutrition.calories).toBeGreaterThan(0);
    expect(enriched[0].nutrition.sugar).toBeDefined(); // Sugar should be calculated
    
    // Second recipe should preserve existing nutrition
    expect(enriched[1].nutrition.calories).toBe(300);
    expect(enriched[1].nutrition.cost).toBe(3.50);
    expect(enriched[1].nutrition.sugar).toBe(3); // Sugar should be preserved
    
    // Third recipe should convert legacy fields to nutrition object
    expect(enriched[2].nutrition.calories).toBe(250);
    expect(enriched[2].nutrition.protein).toBe(5);
    expect(enriched[2].nutrition.sugar).toBe(8); // Legacy sugar should be preserved
    expect(enriched[2].nutrition.cost).toBeGreaterThan(0);
  });
});
