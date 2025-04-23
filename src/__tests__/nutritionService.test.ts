
import { describe, it, expect, beforeAll } from 'vitest';
import { loadVegLibrary, getFoodItemById, convertFoodItemToRecipe } from '@/services/nutritionService';
import { FoodItem } from '@/types/recipes';

describe('Nutrition Service', () => {
  let vegLibrary: FoodItem[];

  // Load the library once before all tests
  beforeAll(async () => {
    vegLibrary = await loadVegLibrary();
  });

  it('should load the vegetable library data', async () => {
    expect(vegLibrary.length).toBeGreaterThan(0);
  });

  it('should find rice entries in the library', async () => {
    const whiteRice = await getFoodItemById(251);
    const brownRice = await getFoodItemById(252);
    
    expect(whiteRice).toBeDefined();
    expect(brownRice).toBeDefined();
    
    if (whiteRice) {
      expect(whiteRice.name).toBe('Rice, white, cooked');
      expect(whiteRice.nutrients.calories).toBe(130);
      expect(whiteRice.nutrients.fiber_g).toBe(0.4);
      expect(whiteRice.nutrients.potassium_mg).toBe(35);
    }
    
    if (brownRice) {
      expect(brownRice.name).toBe('Rice, brown, cooked');
      expect(brownRice.nutrients.calories).toBe(123);
      expect(brownRice.nutrients.fiber_g).toBe(1.8);
      expect(brownRice.nutrients.magnesium_mg).toBe(39);
    }
  });
  
  it('should convert FoodItem to Recipe format correctly', async () => {
    const brownRice = await getFoodItemById(252);
    
    if (brownRice) {
      const recipe = convertFoodItemToRecipe(brownRice);
      
      expect(recipe.id).toBe('food-252');
      expect(recipe.title).toBe('Rice, brown, cooked');
      expect(recipe.calories).toBe(123);
      expect(recipe.protein).toBe(2.6);
      expect(recipe.carbs).toBe(25.6);
      expect(recipe.fat).toBe(1.0);
      expect(recipe.fiber).toBe(1.8);
      expect(recipe.category).toBe('Grain');
      expect(recipe.nutrientScore).toBeGreaterThan(0);
      expect(recipe.ingredients).toContain('100 g Rice, brown, cooked');
    }
  });
});
