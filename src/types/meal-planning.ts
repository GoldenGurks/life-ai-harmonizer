
import { RecommendationWeights } from "./recipes";

export interface MealSlot {
  day: string;
  mealType: string;
  recipeId?: string;
  locked: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  slots: MealSlot[];
  totalCalories?: number;
  totalProtein?: number;
  macroBalance?: number;
}

export interface MealPlanTemplate {
  id: string;
  name: string;
  description: string;
  slots: Omit<MealSlot, 'recipeId' | 'day'>[];
  macroTargets?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  popularity: number;
}

export interface UserPreferences {
  mealCount: number;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  fitnessGoal: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'performance' | 'general';
  dietaryPreference: string;
  allergies: string[];
  cookingTime: number;
  cuisinePreferences: string[];
  budget: 'low' | 'medium' | 'high';
  likedFoods: string[];
  dislikedFoods: string[];
  recommendationPreset: 'Healthy' | 'WeightLoss' | 'MuscleGain';
  recommendationWeights?: RecommendationWeights;
}

export interface MealPlanDay {
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string[];
}

export interface MealPlanProgress {
  daysCompleted: number;
  totalDays: number;
  mealsCompleted: number;
  totalMeals: number;
  calorieAverage: number;
  proteinAverage: number;
}
