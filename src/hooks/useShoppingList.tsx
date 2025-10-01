import { useMemo } from 'react';
import type { MealItem } from '@/types/meal-planning';

interface PantryItem {
  name: string;
  quantity: number;
  unit: string;
}

interface ShoppingItem {
  name: string;
  amount: number;
  unit: string;
}

export const useShoppingList = (weeklyPlan: MealItem[], pantryItems: PantryItem[]) => {
  // Memoize ingredient extraction from recipes
  const recipeIngredients = useMemo(() => {
    const ingredientMap = new Map<string, { amount: number; unit: string }>();

    weeklyPlan.forEach(recipe => {
      recipe.ingredients?.forEach(ing => {
        const key = ing.name.toLowerCase();
        const existing = ingredientMap.get(key);
        const ingAmount = typeof ing.amount === 'number' ? ing.amount : 0;
        
        if (existing) {
          // Aggregate amounts (assuming same unit)
          ingredientMap.set(key, {
            amount: existing.amount + ingAmount,
            unit: ing.unit || existing.unit
          });
        } else {
          ingredientMap.set(key, {
            amount: ingAmount,
            unit: ing.unit || 'unit'
          });
        }
      });
    });

    return ingredientMap;
  }, [weeklyPlan]);

  // Memoize pantry availability map
  const pantryMap = useMemo(() => {
    return new Map(
      pantryItems.map(item => [
        item.name.toLowerCase(),
        { quantity: item.quantity, unit: item.unit }
      ])
    );
  }, [pantryItems]);

  // Calculate shopping list (only when dependencies change)
  const shoppingList = useMemo(() => {
    const needed: ShoppingItem[] = [];

    recipeIngredients.forEach((needed_data, ingredient) => {
      const available = pantryMap.get(ingredient);
      const availableAmount = available?.quantity || 0;
      const toBuy = Math.max(0, needed_data.amount - availableAmount);

      if (toBuy > 0) {
        needed.push({
          name: ingredient,
          amount: Number(toBuy.toFixed(2)),
          unit: needed_data.unit
        });
      }
    });

    return needed.sort((a, b) => a.name.localeCompare(b.name));
  }, [recipeIngredients, pantryMap]);

  return { shoppingList };
};
