
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
