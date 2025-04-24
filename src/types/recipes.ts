
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
  nutrientScore: number; // REQUIRED now
}

export interface RecipeFilters {
  dietary: string[];
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

export interface RecommendationWeights {
  nutritionalFit: number;
  similarityToLikes: number;
  varietyBoost: number;
  pantryMatch: number;
  costScore: number;
  recencyPenalty: number;
}

export interface ScoringPreferences {
  likedMeals: string[];
  pantry: string[];
  fitnessGoal?: string;
  likedFoods?: string[];
  dislikedFoods?: string[];
  recentlyViewed?: string[];
  calorieTarget?: number;
  proteinTarget?: number;
  carbTarget?: number;
  fatTarget?: number;
  recommendationPreset: 'Healthy' | 'WeightLoss' | 'MuscleGain';
  recommendationWeights?: RecommendationWeights;
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

// New interface for the food library items from veg_library.ndjson
export interface FoodItem {
  id: number;
  name: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  nutrients: {
    calories: number;
    protein_g: number;
    fat_g: number;
    carbs_g: number;
    fiber_g: number;
    vitaminB1_mg?: number;
    vitaminB3_mg?: number;
    vitaminB6_mg?: number;
    vitaminB9_folate_ug?: number;
    vitaminA_ug?: number;
    vitaminC_mg?: number;
    vitaminE_mg?: number;
    vitaminK_ug?: number;
    calcium_mg?: number;
    iron_mg?: number;
    magnesium_mg?: number;
    potassium_mg?: number;
    [key: string]: number | undefined; // For any other nutrients
  };
  evidence?: string;
  citations?: Array<{
    PMID?: number;
    DOI?: string;
    title: string;
    author: string;
    year: number;
  }>;
  source?: string;
  lastUpdated?: string;
}

// Utility type for converting FoodItem to Recipe
export interface FoodItemToRecipeMapping {
  foodItemId: number;
  recipeId: string;
  conversionFactor: number; // For scaling nutrients
}
