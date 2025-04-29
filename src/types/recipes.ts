
export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  category: string;
  tags: string[];
  saved: boolean;
  ingredients: (RecipeIngredient | string)[]; // Allow both string and RecipeIngredient types for backward compatibility
  instructions?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  alternativeIds?: string[];
  score?: number;
  useLeftovers?: boolean;
  isQuick?: boolean;
  // New fields for recommendation engine
  vector?: number[];  // For embedding-based similarity
  cuisine?: string;   // For cuisine-based filtering
  cookTimeMinutes?: number; // Numerical cooking time for filtering
  authorStyle?: string; // For LLM-based recipe generation
  // Added nutrition and cost will be calculated at runtime
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar?: number;
    cost: number;
  };
  // Legacy fields that will be removed after migration
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  cost?: number;
  nutrientScore?: number;
}

export interface RecipeIngredient {
  id: number;
  amount: number;
  unit: 'g' | 'ml' | 'piece';
  name?: string; // For display purposes
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
  // New weights for hybrid system
  metadataOverlap: number;
  vectorSimilarity: number;
  collaborativeFiltering: number;
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

// New interface for the food library items from veg_library_v2.ndjson
export interface FoodItem {
  id: number;
  name: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  costPer100g?: number;
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

// Extended Recipe type with calculated nutrition
export interface EnrichedRecipe extends Recipe {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar?: number;
    cost: number;
  };
}

// Utility type for converting FoodItem to Recipe
export interface FoodItemToRecipeMapping {
  foodItemId: number;
  recipeId: string;
  conversionFactor: number; // For scaling nutrients
}
