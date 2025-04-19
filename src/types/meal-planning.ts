
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
  type: "breakfast" | "lunch" | "dinner" | "snack";
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
}

export interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
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
  cookingTime?: number;
  likedFoods?: string[];
  dislikedFoods?: string[];
  fitnessGoal?: "weight-loss" | "muscle-gain" | "maintenance" | "performance";
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  mealSize?: "small" | "medium" | "large";
  mealCount?: number;
  preferLeftovers?: boolean;
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
