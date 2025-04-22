
export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  category: string;
  tags: string[];
  saved: boolean;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar?: number;
  ingredients: string[];
  instructions?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  alternativeIds?: string[];
  score?: number;
  useLeftovers?: boolean;
  isQuick?: boolean;
  // New fields for recommendation engine
  vector?: number[];  // For embedding-based similarity
  cost?: number;      // For cost-related scoring
  cookTimeMinutes?: number; // Numerical cooking time for filtering
  cuisineType?: string; // For cuisine-based matching
}

export interface RecipeFilters {
  dietary: string;
  mealType: string;
  time: string;
  calorieRange: [number, number];
}

export interface RecipeCategory {
  name: string;
  count: number;
}

export interface RecipeTag {
  name: string;
  count: number;
}

// New type for recipe recommendation weight configuration
export interface RecommendationWeights {
  nutritionalFit: number;
  similarityToLikes: number;
  varietyBoost: number;
  pantryMatch: number;
  costScore: number;
  recencyPenalty: number;
}

// New type for recommendation service filters
export interface RecommendationFilters {
  dietaryRestrictions: string[];
  dislikedMeals: string[];
  dietaryPreference?: string;
  allergies?: string[];
  maxCookTime?: number;
  cuisinePreferences?: string[];
}

// New type for score calculation preferences
export interface ScoringPreferences {
  likedMeals: string[];
  pantry: string[];
  fitnessGoal?: string;
  likedFoods?: string[];
  dislikedFoods?: string[];
  recentlyViewed?: string[]; // For recency penalty
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
}
