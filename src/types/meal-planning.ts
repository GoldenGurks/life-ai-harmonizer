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
  // Add these properties to match usage in MealPlanning.tsx
  day?: string;
  meals?: MealItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
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
  intolerances?: string[];
  cookingExperience?: 'beginner' | 'intermediate' | 'advanced';
  mealSizePreference?: string;
  mealFrequency?: number;
  preferenceHistory?: {
    quickSetupProfile?: string;
    lastUpdated: string;
  };
  
  likedMeals: string[];
  dislikedMeals: string[];
  pantry: string[];
  dietaryRestrictions?: string[];
  goals?: string[];
  profileComplete?: boolean;
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

// Update MealItem type to include sugar property and dessert type
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
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  tags: string[];
  preparationTime: number;
  cookingTime: number;
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  image: string;
  nutritionScore: number;
}

// Add types for nutrition data display
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

// Update PantryItem to match implementation
export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity?: number;
  amount?: number;
  unit: string;
  expiry?: string;
  expirationDate?: string;
  addedAt: string;
}

// Add types for shopping and pantry
export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  unit: string;
  inPantry: boolean;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt?: string;
  lastUpdated?: string;
}
