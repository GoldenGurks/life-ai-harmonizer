
import { describe, it, expect, vi } from 'vitest';
import { suggestByStyle } from '@/lib/llmPrompts';

describe('LLM Prompts', () => {
  it('should generate mock recipes based on style and ingredients', async () => {
    const style = 'Italian';
    const ingredients = ['tomato', 'basil', 'mozzarella'];
    
    const recipes = await suggestByStyle(style, ingredients);
    
    // Verify we got the expected number of recipes
    expect(recipes.length).toBe(5);
    
    // Check that recipes have the expected properties
    recipes.forEach(recipe => {
      expect(recipe).toHaveProperty('id');
      expect(recipe).toHaveProperty('title');
      expect(recipe).toHaveProperty('ingredients');
      expect(recipe).toHaveProperty('nutrition');
      expect(recipe.authorStyle).toBe(style);
      expect(recipe.tags).toContain(style);
      expect(recipe.tags).toContain('LLM-Generated');
    });
    
    // Check that titles reference the style
    expect(recipes.some(recipe => recipe.title.includes(style))).toBe(true);
    
    // Check that at least some recipes use the provided ingredients
    const ingredientsUsed = recipes.some(recipe => 
      recipe.title.toLowerCase().includes(ingredients[0]) || 
      recipe.title.toLowerCase().includes(ingredients[1])
    );
    expect(ingredientsUsed).toBe(true);
  });
  
  it('should handle empty ingredients list', async () => {
    const style = 'French';
    const ingredients: string[] = [];
    
    const recipes = await suggestByStyle(style, ingredients);
    
    // Should still generate recipes with default ingredients
    expect(recipes.length).toBe(5);
    expect(recipes[0].authorStyle).toBe(style);
  });
  
  it('should handle errors gracefully', async () => {
    // Mock console.error to avoid cluttering test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a scenario that would cause an error
    const originalSuggestByStyle = suggestByStyle;
    const mockErrorFn = vi.fn().mockRejectedValue(new Error('API error'));
    
    try {
      // @ts-ignore - Replace with mock for testing
      global.suggestByStyle = mockErrorFn;
      
      const recipes = await suggestByStyle('Test', ['ingredient']);
      
      // Should return empty array on error
      expect(recipes).toEqual([]);
      
    } finally {
      // Restore original function and console
      global.suggestByStyle = originalSuggestByStyle;
      consoleSpy.mockRestore();
    }
  });
});
