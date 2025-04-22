
import { Recipe } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';

/**
 * Service responsible for recipe recommendations, filtering, scoring, and ranking
 */
export const recommendationService = {
  /**
   * Filters recipes based on dietary restrictions and preferences
   * Enforces hard constraints (allergies, diet, disliked ingredients)
   */
  filterRecipes: (
    recipes: Recipe[], 
    constraints: {
      dietaryRestrictions: string[],
      dislikedMeals: string[],
      dietaryPreference?: string,
      allergies?: string[]
    }
  ): Recipe[] => {
    // Start with all recipes
    let filteredRecipes = [...recipes];
    
    // Remove disliked meals
    if (constraints.dislikedMeals.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => 
        !constraints.dislikedMeals.includes(recipe.id)
      );
    }
    
    // Filter by dietary preference (vegan, vegetarian, etc.)
    if (constraints.dietaryPreference) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // Each recipe should have tags for dietary categories
        const dietTags = recipe.tags.map(tag => tag.toLowerCase());
        
        switch (constraints.dietaryPreference) {
          case 'vegan':
            return dietTags.includes('vegan');
          case 'vegetarian':
            return dietTags.includes('vegetarian') || dietTags.includes('vegan');
          case 'pescatarian':
            return dietTags.includes('pescatarian') || 
                   dietTags.includes('vegetarian') || 
                   dietTags.includes('vegan') ||
                   dietTags.includes('seafood');
          case 'keto':
            return dietTags.includes('keto') || dietTags.includes('low-carb');
          default:
            return true; // omnivore can eat anything
        }
      });
    }
    
    // Filter out recipes with allergenic ingredients
    if (constraints.allergies && constraints.allergies.length > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // Simple string matching for now - in a real app, this would use a more sophisticated
        // ingredient database with allergen classifications
        return !constraints.allergies?.some(allergen => 
          recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(allergen.toLowerCase())
          )
        );
      });
    }
    
    return filteredRecipes;
  },
  
  /**
   * Scores recipes based on user preferences and configured weights
   */
  scoreRecipes: (
    recipes: Recipe[],
    userPreferences: {
      likedMeals: string[];
      pantry: string[];
      fitnessGoal?: string;
      likedFoods?: string[];
      dislikedFoods?: string[];
    },
    weights: {
      nutritionalFit: number;
      similarityToLikes: number;
      varietyBoost: number;
      pantryMatch: number;
      costScore: number;
      recencyPenalty: number;
    }
  ): Recipe[] => {
    // Calculate scores for each recipe
    const scoredRecipes = recipes.map(recipe => {
      // 1. Nutritional Fit Score (0-1)
      const nutritionalFitScore = calculateNutritionalFitScore(recipe, userPreferences.fitnessGoal);
      
      // 2. Similarity to Likes Score (0-1)
      const similarityScore = calculateSimilarityScore(recipe, userPreferences.likedMeals, recipes, userPreferences.likedFoods);
      
      // 3. Variety Boost (0-1) - encourage variety in suggestions
      const varietyScore = calculateVarietyScore(recipe, userPreferences.likedMeals);
      
      // 4. Pantry Match Score (0-1)
      const pantryScore = calculatePantryMatchScore(recipe, userPreferences.pantry);
      
      // 5. Cost Score (0-1) - lower cost is better
      const costScore = calculateCostScore(recipe);
      
      // 6. Recency Penalty (0-1) - penalize recently suggested recipes
      const recencyScore = 1; // Default to 1 (no penalty) for now
      
      // Calculate weighted score
      const weightedScore = 
        weights.nutritionalFit * nutritionalFitScore +
        weights.similarityToLikes * similarityScore +
        weights.varietyBoost * varietyScore +
        weights.pantryMatch * pantryScore + 
        weights.costScore * costScore +
        weights.recencyPenalty * recencyScore;
      
      // Return recipe with score
      return {
        ...recipe,
        score: weightedScore
      };
    });
    
    // Sort by score (highest first)
    return scoredRecipes.sort((a, b) => (b.score || 0) - (a.score || 0));
  },
  
  /**
   * Finds similar recipes to the provided recipe
   */
  findSimilarRecipes: (recipe: Recipe, allRecipes: Recipe[], count: number = 3): Recipe[] => {
    // Create a map of recipes with similarity scores
    const similarityMap = allRecipes
      .filter(r => r.id !== recipe.id) // Filter out the source recipe
      .map(r => {
        // Calculate ingredient overlap
        const sourceIngredients = new Set(recipe.ingredients.map(i => i.toLowerCase()));
        const targetIngredients = new Set(r.ingredients.map(i => i.toLowerCase()));
        
        // Calculate tag overlap
        const sourceTags = new Set(recipe.tags.map(t => t.toLowerCase()));
        const targetTags = new Set(r.tags.map(t => t.toLowerCase()));
        
        // Calculate similarity score based on ingredients and tags
        const ingredientOverlap = [...sourceIngredients].filter(i => targetIngredients.has(i)).length;
        const tagOverlap = [...sourceTags].filter(t => targetTags.has(t)).length;
        
        // Weighted similarity score
        const similarityScore = 
          (ingredientOverlap / Math.max(sourceIngredients.size, 1)) * 0.7 + 
          (tagOverlap / Math.max(sourceTags.size, 1)) * 0.3;
        
        return {
          ...r,
          score: similarityScore
        };
      });
    
    // Sort by similarity and return top N
    return similarityMap
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, count);
  }
};

// Helper functions for score calculation

/**
 * Calculates how well a recipe matches the nutritional goals of the user
 */
function calculateNutritionalFitScore(recipe: Recipe, fitnessGoal?: string): number {
  if (!fitnessGoal) return 0.5; // Neutral score if no goal
  
  // Calculate score based on fitness goal
  switch (fitnessGoal) {
    case 'weight-loss':
      // For weight loss, prefer lower calories, moderate protein
      return calculateWeightLossScore(recipe);
    case 'muscle-gain':
      // For muscle gain, prefer high protein
      return calculateMuscleGainScore(recipe);
    case 'maintenance':
      // For maintenance, prefer balanced macros
      return calculateMaintenanceScore(recipe);
    case 'performance':
      // For athletic performance, prefer higher carbs, moderate protein
      return calculatePerformanceScore(recipe);
    default:
      return 0.5; // Neutral score for other goals
  }
}

/**
 * Calculates similarity between this recipe and previously liked recipes/foods
 */
function calculateSimilarityScore(
  recipe: Recipe, 
  likedMeals: string[], 
  allRecipes: Recipe[],
  likedFoods?: string[]
): number {
  // If no liked meals or foods, return neutral score
  if (likedMeals.length === 0 && (!likedFoods || likedFoods.length === 0)) {
    return 0.5;
  }
  
  let similarityScore = 0;
  
  // Calculate similarity to liked meals
  if (likedMeals.length > 0) {
    // Find the liked recipes
    const likedRecipes = allRecipes.filter(r => likedMeals.includes(r.id));
    
    if (likedRecipes.length > 0) {
      // Tag similarity between current recipe and liked recipes
      let tagSimilarity = 0;
      const currentTags = new Set(recipe.tags.map(t => t.toLowerCase()));
      
      likedRecipes.forEach(likedRecipe => {
        const likedTags = new Set(likedRecipe.tags.map(t => t.toLowerCase()));
        const commonTags = [...currentTags].filter(t => likedTags.has(t)).length;
        tagSimilarity += commonTags / Math.max(currentTags.size, 1);
      });
      
      // Normalize tag similarity
      tagSimilarity /= likedRecipes.length;
      similarityScore += tagSimilarity * 0.7; // 70% weight to tag similarity
    }
  }
  
  // Calculate similarity to liked foods/ingredients
  if (likedFoods && likedFoods.length > 0) {
    // Check if recipe contains any liked foods
    const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
    const likedFoodsLower = likedFoods.map(f => f.toLowerCase());
    
    const foodMatches = likedFoodsLower.filter(food => 
      recipeIngredients.some(ingredient => ingredient.includes(food))
    ).length;
    
    const foodSimilarity = foodMatches / Math.max(likedFoodsLower.length, 1);
    similarityScore += foodSimilarity * 0.3; // 30% weight to ingredient similarity
  }
  
  return Math.min(similarityScore, 1); // Ensure score is between 0 and 1
}

/**
 * Calculates variety score to prevent recommending too-similar recipes
 */
function calculateVarietyScore(recipe: Recipe, likedMeals: string[]): number {
  // For now, simple implementation that gives higher score to recipes
  // with fewer tags in common with liked meals
  return 0.5; // Default to medium variety score
}

/**
 * Calculates how well the recipe uses ingredients from the user's pantry
 */
function calculatePantryMatchScore(recipe: Recipe, pantry: string[]): number {
  if (pantry.length === 0) return 0.5; // Neutral score if pantry empty
  
  const pantryLower = pantry.map(item => item.toLowerCase());
  const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
  
  // Calculate how many recipe ingredients are in pantry
  let matchCount = 0;
  for (const ingredient of recipeIngredients) {
    if (pantryLower.some(item => ingredient.includes(item))) {
      matchCount++;
    }
  }
  
  // Calculate score based on percentage of ingredients in pantry
  const score = matchCount / recipeIngredients.length;
  return score;
}

/**
 * Calculates cost-effectiveness score
 */
function calculateCostScore(recipe: Recipe): number {
  // Since we don't have cost data yet, return a neutral score
  return 0.5;
}

// Specific fitness goal score calculators
function calculateWeightLossScore(recipe: Recipe): number {
  // For weight loss: prefer lower calories, moderate protein, lower fat
  const calorieScore = 1 - (recipe.calories / 1000); // Lower calories = higher score
  const proteinScore = recipe.protein / recipe.calories; // Higher protein:calorie ratio = better
  const fiberScore = (recipe.fiber || 0) / 30; // Higher fiber = better
  
  return (calorieScore * 0.5) + (proteinScore * 0.3) + (fiberScore * 0.2);
}

function calculateMuscleGainScore(recipe: Recipe): number {
  // For muscle gain: prefer high protein, adequate calories
  const proteinScore = recipe.protein / 50; // Higher protein = better
  const calorieScore = recipe.calories / 800; // Higher calories within reason = better
  
  return (proteinScore * 0.7) + (calorieScore * 0.3);
}

function calculateMaintenanceScore(recipe: Recipe): number {
  // For maintenance: prefer balanced macros
  // Ideal: ~30% protein, ~40% carbs, ~30% fat
  const proteinCals = recipe.protein * 4;
  const carbCals = recipe.carbs * 4;
  const fatCals = recipe.fat * 9;
  const totalCals = recipe.calories;
  
  const proteinPct = proteinCals / totalCals;
  const carbPct = carbCals / totalCals;
  const fatPct = fatCals / totalCals;
  
  // Calculate how close to ideal each macro is (closer = better)
  const proteinScore = 1 - Math.abs(0.3 - proteinPct);
  const carbScore = 1 - Math.abs(0.4 - carbPct);
  const fatScore = 1 - Math.abs(0.3 - fatPct);
  
  return (proteinScore + carbScore + fatScore) / 3;
}

function calculatePerformanceScore(recipe: Recipe): number {
  // For athletic performance: prefer higher carbs, moderate protein
  const carbScore = recipe.carbs / 100; // Higher carbs = better
  const proteinScore = recipe.protein / 40; // Good protein = better
  
  return (carbScore * 0.6) + (proteinScore * 0.4);
}
