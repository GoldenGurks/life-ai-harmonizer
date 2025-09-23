/**
 * Meal Budget Service
 * 
 * Handles calculation of nutritional budgets for individual meals
 * based on user preferences, fitness goals, and meal planning settings.
 */

import { Recipe } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';
import { getMealBudget, getNutritionalConstraints, MealBudget } from '@/config/presetRules';

export interface MealConstraints {
  budget: MealBudget;
  hardFilters: {
    maxCalories: number;
    minCalories: number;
    maxSugar: number;
    requiredTags?: string[];
    excludedIngredients?: string[];
    maxCookingTime?: number;
  };
  tolerances: {
    calorieTolerance: number;
    proteinTolerance: number;
    carbTolerance: number;
    fatTolerance: number;
  };
}

/**
 * Calculate meal constraints based on user preferences
 */
export function calculateMealConstraints(
  userPrefs: UserPreferences,
  mealType: string,
  includeBreakfast: boolean = true
): MealConstraints {
  // Get meal budget
  const budget = getMealBudget(userPrefs, mealType, includeBreakfast);
  
  // Get nutritional constraints for the goal
  const goal = userPrefs.recommendationPreset || userPrefs.fitnessGoal || 'Healthy';
  const constraints = getNutritionalConstraints(goal);
  
  // Apply different tolerances for breakfast
  const isBreakfast = mealType === 'breakfast';
  const calorieTolerancePct = isBreakfast ? constraints.breakfastCalorieTolerance : constraints.calorieTolerancePct;
  const proteinTolerancePct = isBreakfast ? constraints.breakfastProteinTolerance : constraints.proteinTolerancePct;
  
  // Calculate hard filter limits
  const maxCalories = Math.round(budget.kcalTarget * (1 + calorieTolerancePct * 1.6)); // 1.6x tolerance for hard cap
  const minCalories = Math.round(budget.kcalTarget * (1 - calorieTolerancePct * 0.6)); // 0.6x tolerance for hard floor
  
  // Build excluded ingredients from allergies and dislikes
  const excludedIngredients = [
    ...userPrefs.allergies,
    ...userPrefs.intolerances,
    ...userPrefs.dislikedFoods
  ];
  
  // Required tags based on dietary preferences
  const requiredTags = [];
  if (userPrefs.dietaryPreference === 'vegetarian') requiredTags.push('vegetarian');
  if (userPrefs.dietaryPreference === 'vegan') requiredTags.push('vegan');
  if (userPrefs.dietaryRestrictions.includes('gluten-free')) requiredTags.push('gluten-free');
  if (userPrefs.dietaryRestrictions.includes('dairy-free')) requiredTags.push('dairy-free');
  
  return {
    budget,
    hardFilters: {
      maxCalories,
      minCalories,
      maxSugar: budget.sugarHardCap_g,
      requiredTags: requiredTags.length > 0 ? requiredTags : undefined,
      excludedIngredients: excludedIngredients.length > 0 ? excludedIngredients : undefined,
      maxCookingTime: userPrefs.cookingTime || undefined
    },
    tolerances: {
      calorieTolerance: calorieTolerancePct,
      proteinTolerance: proteinTolerancePct,
      carbTolerance: 0.25, // More flexible with carbs
      fatTolerance: 0.30   // Most flexible with fats
    }
  };
}

/**
 * Apply hard filters to remove recipes that don't meet basic requirements
 */
export function applyHardFilters(recipe: Recipe, constraints: MealConstraints): boolean {
  const { hardFilters } = constraints;
  
  // Check calorie bounds
  if (recipe.calories > hardFilters.maxCalories || recipe.calories < hardFilters.minCalories) {
    return false;
  }
  
  // Check sugar hard cap
  if (recipe.sugar && recipe.sugar > hardFilters.maxSugar) {
    return false;
  }
  
  // Check cooking time (skip if recipe doesn't have cooking time info)
  // Note: Recipe interface doesn't include cooking time fields, so we skip this filter for now
  // TODO: Add cookingTime or preparationTime to Recipe interface if needed
  
  // Check required tags (dietary restrictions)
  if (hardFilters.requiredTags) {
    const recipeTags = recipe.tags || [];
    const hasAllRequiredTags = hardFilters.requiredTags.every(tag => 
      recipeTags.includes(tag)
    );
    if (!hasAllRequiredTags) {
      return false;
    }
  }
  
  // Check excluded ingredients (allergies, dislikes)
  if (hardFilters.excludedIngredients) {
    const recipeIngredientNames = recipe.ingredients.map(ing => 
      typeof ing === 'string' ? ing : ing.name || ''
    ).map(name => name.toLowerCase());
    
    const hasExcludedIngredient = hardFilters.excludedIngredients.some(excluded =>
      recipeIngredientNames.some(ingredient => 
        ingredient.includes(excluded.toLowerCase())
      )
    );
    
    if (hasExcludedIngredient) {
      return false;
    }
  }
  
  return true;
}

/**
 * Calculate nutritional fit score for a recipe against meal budget
 */
export function calculateNutritionalFitScore(recipe: Recipe, constraints: MealConstraints): number {
  const { budget, tolerances } = constraints;
  
  // Individual component scores (0-1, where 1 is perfect fit)
  const calorieScore = calculateComponentScore(
    recipe.calories, 
    budget.kcalTarget, 
    tolerances.calorieTolerance
  );
  
  const proteinScore = calculateComponentScore(
    recipe.protein, 
    budget.proteinTarget_g, 
    tolerances.proteinTolerance
  );
  
  const carbScore = calculateComponentScore(
    recipe.carbs || 0, 
    budget.carbTarget_g, 
    tolerances.carbTolerance
  );
  
  const fatScore = calculateComponentScore(
    recipe.fat || 0, 
    budget.fatTarget_g, 
    tolerances.fatTolerance
  );
  
  // Fiber bonus (positive only)
  const fiberScore = recipe.fiber ? Math.min(1, recipe.fiber / budget.fiberMin_g) : 0.5;
  
  // Sugar penalty (negative impact only)
  const sugarPenalty = recipe.sugar && recipe.sugar > budget.sugarSoftCap_g ? 
    Math.min(0.3, (recipe.sugar - budget.sugarSoftCap_g) / budget.sugarSoftCap_g) : 0;
  
  // Weighted total score
  const totalScore = (
    calorieScore * 0.30 +
    proteinScore * 0.25 +
    carbScore * 0.15 +
    fatScore * 0.15 +
    fiberScore * 0.10 +
    (1 - sugarPenalty) * 0.05
  );
  
  return Math.max(0, Math.min(1, totalScore));
}

/**
 * Calculate individual component score with linear falloff around target
 */
function calculateComponentScore(actual: number, target: number, tolerance: number): number {
  if (target === 0) return 1; // Perfect if no target
  
  const ratio = actual / target;
  const minRatio = 1 - tolerance;
  const maxRatio = 1 + tolerance;
  
  if (ratio >= minRatio && ratio <= maxRatio) {
    return 1; // Perfect score within tolerance
  } else if (ratio < minRatio) {
    // Linear falloff below target
    return Math.max(0, ratio / minRatio);
  } else {
    // Linear falloff above target
    return Math.max(0, (2 - ratio / maxRatio));
  }
}