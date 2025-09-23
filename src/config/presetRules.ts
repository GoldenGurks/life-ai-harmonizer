/**
 * Preset Rules for Meal Recommendation Engine
 * 
 * Defines daily calorie targets, macro percentages, meal splits,
 * and nutritional constraints for different fitness goals.
 */

export interface MacroPercentages {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealBudget {
  kcalTarget: number;
  proteinTarget_g: number;
  carbTarget_g: number;
  fatTarget_g: number;
  fiberMin_g: number;
  sugarSoftCap_g: number;
  sugarHardCap_g: number;
}

export interface NutritionalConstraints {
  fiberMin_g: number;
  sugarSoftCap_g: number;
  sugarHardCap_g: number;
  calorieTolerancePct: number; // ±15% default
  proteinTolerancePct: number;
  breakfastCalorieTolerance: number; // More flexible for breakfast
  breakfastProteinTolerance: number;
}

// Default daily calorie targets by fitness goal
export const DEFAULT_DAILY_KCAL = {
  Healthy: 2200,
  WeightLoss: 1800,
  MuscleGain: 2800,
  maintenance: 2200, // alias for Healthy
  weight_loss: 1800, // alias for WeightLoss  
  muscle_gain: 2800, // alias for MuscleGain
  performance: 2600
} as const;

// Macro percentage distributions by fitness goal
export const MACRO_PCTS: Record<string, MacroPercentages> = {
  Healthy: { protein: 0.25, carbs: 0.45, fat: 0.30 },
  WeightLoss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
  MuscleGain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  maintenance: { protein: 0.25, carbs: 0.45, fat: 0.30 },
  weight_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
  muscle_gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
  performance: { protein: 0.20, carbs: 0.55, fat: 0.25 }
};

// Meal distribution across the day
export const MEAL_SPLITS = {
  withBreakfast: {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.40
  },
  noBreakfast: {
    lunch: 0.45,
    dinner: 0.55
  },
  withSnacks: {
    breakfast: 0.20,
    lunch: 0.30,
    dinner: 0.35,
    snack: 0.15
  }
} as const;

// Nutritional constraints and tolerances
export const NUTRITIONAL_CONSTRAINTS: Record<string, NutritionalConstraints> = {
  Healthy: {
    fiberMin_g: 8,
    sugarSoftCap_g: 25,
    sugarHardCap_g: 35,
    calorieTolerancePct: 0.15,
    proteinTolerancePct: 0.20,
    breakfastCalorieTolerance: 0.25,
    breakfastProteinTolerance: 0.30
  },
  WeightLoss: {
    fiberMin_g: 12,
    sugarSoftCap_g: 20,
    sugarHardCap_g: 25,
    calorieTolerancePct: 0.10,
    proteinTolerancePct: 0.15,
    breakfastCalorieTolerance: 0.20,
    breakfastProteinTolerance: 0.25
  },
  MuscleGain: {
    fiberMin_g: 6,
    sugarSoftCap_g: 35,
    sugarHardCap_g: 50,
    calorieTolerancePct: 0.20,
    proteinTolerancePct: 0.15,
    breakfastCalorieTolerance: 0.30,
    breakfastProteinTolerance: 0.20
  }
};

// Sugar caps by meal type (soft recommendations)
export const SUGAR_CAPS_BY_MEAL = {
  breakfast: { soft: 15, hard: 25 }, // More flexible for breakfast
  lunch: { soft: 20, hard: 30 },
  dinner: { soft: 20, hard: 30 },
  snack: { soft: 10, hard: 15 },
  dessert: { soft: 30, hard: 45 }
} as const;

/**
 * Calculate meal budget based on user preferences and meal type
 * 
 * @param userPrefs - User preferences including goals and targets
 * @param mealType - Type of meal (breakfast, lunch, dinner, etc.)
 * @param includeBreakfast - Whether breakfast is included in the plan
 * @returns Nutritional budget for the specific meal
 */
export function getMealBudget(
  userPrefs: { 
    calorieTarget?: number; 
    proteinTarget?: number;
    carbTarget?: number;
    fatTarget?: number;
    fitnessGoal?: string;
    recommendationPreset?: string;
  }, 
  mealType: string, 
  includeBreakfast: boolean = true
): MealBudget {
  // Determine fitness goal
  const goal = userPrefs.recommendationPreset || userPrefs.fitnessGoal || 'Healthy';
  
  // Get daily calorie target
  const dailyKcal = userPrefs.calorieTarget || DEFAULT_DAILY_KCAL[goal as keyof typeof DEFAULT_DAILY_KCAL] || DEFAULT_DAILY_KCAL.Healthy;
  
  // Get macro percentages for the goal
  const macroPcts = MACRO_PCTS[goal] || MACRO_PCTS.Healthy;
  
  // Calculate daily macro targets in grams
  const dailyProtein_g = userPrefs.proteinTarget || (dailyKcal * macroPcts.protein) / 4;
  const dailyCarbs_g = userPrefs.carbTarget || (dailyKcal * macroPcts.carbs) / 4;
  const dailyFat_g = userPrefs.fatTarget || (dailyKcal * macroPcts.fat) / 9;
  
  // Get meal split
  const mealSplit = includeBreakfast ? MEAL_SPLITS.withBreakfast : MEAL_SPLITS.noBreakfast;
  const mealPct = mealSplit[mealType as keyof typeof mealSplit] || 0.33; // Default to 1/3 if meal type not found
  
  // Calculate meal targets
  const kcalTarget = Math.round(dailyKcal * mealPct);
  const proteinTarget_g = Math.round(dailyProtein_g * mealPct);
  const carbTarget_g = Math.round(dailyCarbs_g * mealPct);
  const fatTarget_g = Math.round(dailyFat_g * mealPct);
  
  // Get nutritional constraints
  const constraints = NUTRITIONAL_CONSTRAINTS[goal] || NUTRITIONAL_CONSTRAINTS.Healthy;
  const sugarCaps = SUGAR_CAPS_BY_MEAL[mealType as keyof typeof SUGAR_CAPS_BY_MEAL] || SUGAR_CAPS_BY_MEAL.lunch;
  
  return {
    kcalTarget,
    proteinTarget_g,
    carbTarget_g,
    fatTarget_g,
    fiberMin_g: Math.round(constraints.fiberMin_g * mealPct),
    sugarSoftCap_g: sugarCaps.soft,
    sugarHardCap_g: sugarCaps.hard
  };
}

/**
 * Get nutritional constraints for a specific goal
 */
export function getNutritionalConstraints(goal: string): NutritionalConstraints {
  return NUTRITIONAL_CONSTRAINTS[goal] || NUTRITIONAL_CONSTRAINTS.Healthy;
}