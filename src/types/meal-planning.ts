
export interface MealItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
}

export interface Dish {
  id: string;
  name: string;
  ingredients: string[];
  image: string;
}

export interface UserPreferences {
  dietaryPreference?: string;
  fitnessGoal?: string;
  allergies?: string[];
  cookingExperience?: string;
  cookingTime?: number;
  likedFoods?: string[];
  dislikedFoods?: string[];
  dailyCalorieTarget?: number;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutrientData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutrientGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}
