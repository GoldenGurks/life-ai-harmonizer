
import { useState } from 'react';
import { Recipe, EnrichedRecipe } from '@/types/recipes';
import { ensureNutritionAndCost } from '@/services/nutritionService';

export const useRecipeState = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<EnrichedRecipe | null>(null);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);
  const [extractedRecipes, setExtractedRecipes] = useState<Recipe[]>([]);
  const [enrichedCache, setEnrichedCache] = useState<Map<string, EnrichedRecipe>>(new Map());

  const getEnrichedRecipe = async (recipe: Recipe): Promise<EnrichedRecipe> => {
    if (enrichedCache.has(recipe.id)) {
      return enrichedCache.get(recipe.id)!;
    }

    try {
      const enriched = await ensureNutritionAndCost([recipe]);
      const enrichedRecipe = enriched[0];
      
      setEnrichedCache(prev => new Map(prev).set(recipe.id, enrichedRecipe));
      return enrichedRecipe;
    } catch (error) {
      console.error('Error enriching recipe:', error);
      const fallbackEnriched: EnrichedRecipe = {
        ...recipe,
        nutrition: recipe.nutrition || {
          calories: recipe.calories || 0,
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          fat: recipe.fat || 0,
          fiber: recipe.fiber || 0,
          sugar: recipe.sugar || 0,
          cost: recipe.cost || 0
        }
      };
      
      setEnrichedCache(prev => new Map(prev).set(recipe.id, fallbackEnriched));
      return fallbackEnriched;
    }
  };

  const openRecipeDetail = async (recipe: Recipe) => {
    const enriched = await getEnrichedRecipe(recipe);
    setSelectedRecipe(enriched);
    setIsRecipeDetailOpen(true);
  };

  const handleExtractedRecipe = (recipe: Recipe) => {
    setExtractedRecipes(prev => [recipe, ...prev]);
  };

  return {
    selectedRecipe,
    setSelectedRecipe,
    isRecipeDetailOpen,
    setIsRecipeDetailOpen,
    extractedRecipes,
    enrichedCache,
    getEnrichedRecipe,
    openRecipeDetail,
    handleExtractedRecipe
  };
};
