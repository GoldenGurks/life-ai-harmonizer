
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
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  tags: string[];
  servings?: number;
  preparationTime?: number;
  cookingTime?: number;
  ingredients?: {
    name: string;
    amount: string;
    unit: string;
  }[];
  instructions?: string[];
  image?: string;
  nutritionScore?: number;
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
  tags?: string[];
}

export interface Dish {
  id: string;
  name: string;
  ingredients: string[];
  image: string;
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  alternativeDishes?: string[];
  preparationTime?: number;
  cuisineType?: string;
}

export interface UserPreferences {
  dietaryPreference?: string;
  fitnessGoal?: string;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  allergies?: string[];
  intolerances?: string[];
  cookingExperience?: string;
  cookingTime?: number;
  likedFoods?: string[];
  dislikedFoods?: string[];
  excludedIngredients?: string[];
  dailyCalorieTarget?: number;
  macroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  mealSizePreference?: 'small' | 'medium' | 'large';
  mealFrequency?: number;
  cuisinePreferences?: string[];
  budgetLevel?: 'budget' | 'moderate' | 'premium';
  healthMetrics?: {
    height?: number;
    weight?: number;
    age?: number;
    bloodPressure?: { systolic: number; diastolic: number };
    bloodSugar?: number;
    cholesterol?: { total: number; hdl: number; ldl: number };
  };
}

export interface NutrientData {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface NutrientGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  unit: string;
  expirationDate?: string;
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface ShoppingList {
  id: string;
  name: string;
  items: {
    id: string;
    name: string;
    category: string;
    amount: number;
    unit: string;
    inPantry: boolean;
    checked: boolean;
  }[];
  createdAt: string;
  lastUpdated: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisineType?: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  sourceUrl?: string;
  isFavorite: boolean;
  rating?: number;
  userNotes?: string;
  alternativeRecipes?: string[];
}

export interface RecipeCollection {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  recipeIds: string[];
  createdAt: string;
  lastUpdated: string;
}
