
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recommendationService } from '@/services/recommendationService';
import * as llmPrompts from '@/lib/llmPrompts';
import { Recipe, ScoringPreferences } from '@/types/recipes';

// Mock the llmPrompts module
vi.mock('@/lib/llmPrompts', () => ({
  suggestByStyle: vi.fn()
}));

// Mock ensureNutritionAndCost
vi.mock('@/services/nutritionService', () => ({
  ensureNutritionAndCost: vi.fn((recipes) => Promise.resolve(recipes.map(recipe => ({
    ...recipe,
    nutrition: {
      calories: 300,
      protein: 20,
      carbs: 30,
      fat: 10,
      fiber: 5,
      sugar: 5,
      cost: 3.99
    }
  }))))
}));

describe('Recommendation Service LLM Integration', () => {
  const mockRecipes: Recipe[] = [
    {
      id: 'recipe1',
      title: 'Test Recipe 1',
      image: 'test.jpg',
      time: '30 mins',
      category: 'Main',
      tags: ['Test', 'Main'],
      saved: false,
      ingredients: [{ id: 1, amount: 100, unit: 'g' }],
      difficulty: 'Medium',
      servings: 2 // Added servings
    },
    {
      id: 'recipe2',
      title: 'Test Recipe 2',
      image: 'test.jpg',
      time: '20 mins',
      category: 'Side',
      tags: ['Test', 'Side'],
      saved: false,
      ingredients: [{ id: 2, amount: 200, unit: 'g' }],
      difficulty: 'Easy',
      servings: 1 // Added servings
    }
  ];

  const mockLLMRecipes: Recipe[] = [
    {
      id: 'llm-italian-1',
      title: 'Italian Style Pasta',
      image: 'placeholder.svg',
      time: '25 mins',
      category: 'Main',
      tags: ['Italian', 'LLM-Generated'],
      saved: false,
      ingredients: [{ id: 101, amount: 100, unit: 'g' }],
      difficulty: 'Medium',
      authorStyle: 'Italian',
      servings: 2 // Added servings
    },
    {
      id: 'llm-italian-2',
      title: 'Italian Risotto',
      image: 'placeholder.svg',
      time: '35 mins',
      category: 'Main',
      tags: ['Italian', 'LLM-Generated'],
      saved: false,
      ingredients: [{ id: 102, amount: 150, unit: 'g' }],
      difficulty: 'Medium',
      authorStyle: 'Italian',
      servings: 2 // Added servings
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock suggestByStyle to return mock LLM recipes
    vi.mocked(llmPrompts.suggestByStyle).mockResolvedValue(mockLLMRecipes);
  });

  it('should return LLM suggestions when authorStyle is specified', async () => {
    const userPreferences: ScoringPreferences = {
      likedMeals: [],
      pantry: ['tomato', 'pasta'],
      recommendationPreset: 'Healthy',
      authorStyle: 'Italian'
    };

    const filters = {
      dietaryRestrictions: [],
      dislikedMeals: []
    };

    const recommendations = await recommendationService.getRecommendations(
      mockRecipes,
      userPreferences,
      filters,
      3
    );

    // Verify suggestByStyle was called
    expect(llmPrompts.suggestByStyle).toHaveBeenCalledWith(
      'Italian',
      ['tomato', 'pasta']
    );

    // Should include recipes from both sources
    expect(recommendations.length).toBeGreaterThan(0);
    
    // At least one recipe should have authorStyle set to Italian
    const hasLLMRecipe = recommendations.some(recipe => 
      recipe.authorStyle === 'Italian' && recipe.tags.includes('LLM-Generated')
    );
    expect(hasLLMRecipe).toBe(true);
  });

  it('should use LLM recipes for cold start (when no filtered recipes)', async () => {
    const userPreferences: ScoringPreferences = {
      likedMeals: [],
      pantry: [],
      recommendationPreset: 'Healthy',
    };

    // Create an empty array to simulate no recipes passing filters
    const emptyRecipes: Recipe[] = [];
    const emptyFilters = {
      dietaryRestrictions: [],
      dislikedMeals: []
    };

    // Override the filterRecipes method to return an empty array
    const originalFilterRecipes = recommendationService.filterRecipes;
    recommendationService.filterRecipes = vi.fn().mockReturnValue([]);

    try {
      const recommendations = await recommendationService.getRecommendations(
        emptyRecipes,
        userPreferences,
        emptyFilters,
        3
      );
  
      // Should use the default style for cold start
      expect(llmPrompts.suggestByStyle).toHaveBeenCalledWith(
        'Mediterranean',  // Default style when none provided
        []
      );
  
      // Should return LLM-generated recipes
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations.some(recipe => 
        recipe.tags.includes('LLM-Generated')
      )).toBe(true);
    } finally {
      // Restore original function
      recommendationService.filterRecipes = originalFilterRecipes;
    }
  });

  it('should expose getLLMRecipeSuggestions method', async () => {
    const recipes = await recommendationService.getLLMRecipeSuggestions('French', ['butter', 'cream']);
    
    expect(llmPrompts.suggestByStyle).toHaveBeenCalledWith('French', ['butter', 'cream']);
    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty('nutrition');
  });
});
