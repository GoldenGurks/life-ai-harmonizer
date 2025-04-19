
export interface MealItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  tags: string[];
  preparationTime: number;
  cookingTime: number;
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  image: string;
  nutritionScore: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  useLeftovers?: boolean;
  isQuick?: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface WeeklyPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: MealPlan[];
}

export interface SavedPlan {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly";
  mealPlan?: MealPlan;
  weeklyPlan?: WeeklyPlan;
}

export interface UserPreferences {
  dietaryPreference?: "vegan" | "vegetarian" | "pescatarian" | "keto" | "omnivore";
  allergies?: string[];
  intolerances?: string[];
  cookingExperience?: "beginner" | "intermediate" | "advanced";
  cookingTime?: number;
  likedFoods?: string[];
  dislikedFoods?: string[];
  fitnessGoal?: "weight-loss" | "muscle-gain" | "maintenance" | "performance" | "general";
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  mealSize?: "small" | "medium" | "large";
  mealCount?: number;
  preferLeftovers?: boolean;
  cuisinePreferences?: string[];
  mealSizePreference?: string;
  mealFrequency?: number;
}

export interface IngredientItem {
  name: string;
  amount: string;
  unit: string;
}

export interface MealPlanTemplate {
  id: string;
  name: string;
  description: string;
  suitableFor: string[];
}

export interface LeftoverIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  expiresOn: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  unit: string;
  expirationDate: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
  lastUpdated: string;
  items: {
    id: string;
    name: string;
    category: string;
    amount: number;
    unit: string;
    inPantry: boolean;
    checked: boolean;
  }[];
}

export interface NutrientGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface NutrientData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type Recipe = import('../types/recipes').Recipe;
