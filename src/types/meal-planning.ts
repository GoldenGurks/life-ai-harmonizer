
import { RecommendationWeights } from "./recipes";

export interface MealIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface MealItem {
  id: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  tags?: string[];
  preparationTime?: number;
  cookingTime?: number;
  ingredients: MealIngredient[];
  instructions?: string[];
  image?: string;
  nutritionScore?: number;
  authorStyle?: string;
}

export interface UserPreferences {
  mealCount: number;
  calorieTarget: number;
  proteinTarget: number;
  carbTarget: number;
  fatTarget: number;
  dietaryPreference: string;
  fitnessGoal: string;
  allergies: string[];
  intolerances: string[];
  cookingTime: number;
  cookingExperience: string;
  cuisinePreferences: string[];
  budget: string;
  likedMeals: string[];
  dislikedMeals: string[];
  likedFoods: string[];
  dislikedFoods: string[];
  pantry: string[];
  dietaryRestrictions: string[];
  goals: string[];
  preferenceHistory: {
    lastUpdated: string;
  };
  recommendationPreset: string;
  recommendationWeights: RecommendationWeights;
  profileComplete: boolean;
  authorStyle?: string;
  currentWeekPlan?: WeeklyPlan; // Add currentWeekPlan property
}

export interface MealSuggestion {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
  tags: string[];
}

export interface WeeklySettingsType {
  startDate: Date;
  days: number;
  mealTypes: string[];
  includeLeftovers: boolean;
  shoppingListFrequency: 'daily' | 'weekly';
  dishCount: number;
}

export interface DaySchedule {
  day: string;
  date: Date;
  meals: Record<string, MealItem[]>;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  days: DaySchedule[];
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string;
  expirationDate?: string; // Additional field to match code usage
  expiry?: string; // Additional field to match code usage
  amount?: number; // Additional field to match code usage
  addedAt?: string; // Additional field to match code usage
}

export interface MealPlan {
  id: string;
  name: string;
  days: DaySchedule[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Add WeeklyPlan interface
export interface WeeklyPlan {
  selectedRecipes: MealItem[];
  assignedDays: {
    [day: string]: {
      [mealType: string]: MealItem | undefined;
    };
  };
  createdAt: string;
}

// Add ShoppingList interface
export interface ShoppingList {
  items: Array<{
    id: string;
    name: string;
    category: string;
    amount: number;
    unit: string;
    inPantry: boolean;
    checked: boolean;
  }>;
}

// Add NutrientData interface
export interface NutrientData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Add NutrientGoal interface
export interface NutrientGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}
