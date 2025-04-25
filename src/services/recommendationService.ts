import { Recipe, RecommendationWeights, RecommendationFilters, ScoringPreferences } from '@/types/recipes';
import { UserPreferences } from '@/types/meal-planning';
import { ensureNutrientScore, validateRecipes } from '@/lib/recipeEnrichment';
import { PRESETS } from '@/config/recommendationPresets';

/**
 * Service responsible for recipe recommendations, filtering, scoring, and ranking
 * Implements the recommendation architecture with filtering, scoring, and ranking
 */
export const recommendationService = {
  /**
   * Filters recipes based on dietary restrictions and preferences
   * Enforces hard constraints (allergies, diet, disliked ingredients)
   * 
   * @param recipes - List of recipes to filter
   * @param constraints - User dietary constraints and preferences
   * @returns Filtered list of recipes that match the user's constraints
   */
  filterRecipes: (
    recipes: Recipe[], 
    constraints: RecommendationFilters
  ): Recipe[] => {
    // Enrich and validate before filtering!
    const enrichedRecipes = ensureNutrientScore(recipes);
    validateRecipes(enrichedRecipes);

    console.log('Filtering recipes with constraints:', constraints);
    let filteredRecipes = [...enrichedRecipes];
    
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
        
        switch (constraints.dietaryPreference.toLowerCase()) {
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
    
    // Filter by maximum cooking time (if specified)
    if (constraints.maxCookTime && constraints.maxCookTime > 0) {
      filteredRecipes = filteredRecipes.filter(recipe => {
        // Convert time string to minutes (assumes format like "25 mins" or "1 hr 30 mins")
        const timeString = recipe.time.toLowerCase();
        
        // Handle recipes with cookTimeMinutes already defined
        if (recipe.cookTimeMinutes) {
          return recipe.cookTimeMinutes <= constraints.maxCookTime!;
        }
        
        // Extract minutes from time string
        let totalMinutes = 0;
        
        if (timeString.includes('hr')) {
          const hours = parseInt(timeString.split('hr')[0].trim());
          totalMinutes += hours * 60;
          
          // Check for minutes after hours
          const afterHrs = timeString.split('hr')[1];
          if (afterHrs && afterHrs.includes('min')) {
            const mins = parseInt(afterHrs.split('min')[0].trim());
            totalMinutes += mins;
          }
        } else if (timeString.includes('min')) {
          totalMinutes = parseInt(timeString.split('min')[0].trim());
        }
        
        return totalMinutes <= constraints.maxCookTime!;
      });
    }
    
    // Filter by cuisine preferences (if specified)
    if (constraints.cuisinePreferences && constraints.cuisinePreferences.length > 0) {
      // If user has cuisine preferences, boost those recipes but don't exclude others completely
      // This is a "soft" filter that will be handled in scoring
    }
    
    console.log(`Filtered ${recipes.length} recipes down to ${filteredRecipes.length}`);
    return filteredRecipes;
  },
  
  /**
   * Scores recipes based on user preferences and configured weights
   * Implements the weighted scoring algorithm from the architecture
   * 
   * @param recipes - List of filtered recipes to score
   * @param userPreferences - User preferences for scoring
   * @param weights - Configuration of score component weights
   * @returns Scored and ranked recipes
   */
  scoreRecipes: (
    recipes: Recipe[],
    userPreferences: ScoringPreferences,
    weights: RecommendationWeights
  ): Recipe[] => {
    // Enrich and validate before scoring!
    const enrichedRecipes = ensureNutrientScore(recipes);
    validateRecipes(enrichedRecipes);

    console.log('Scoring recipes with preferences:', userPreferences);
    // Calculate scores for each recipe
    const scoredRecipes = enrichedRecipes.map(recipe => {
      // 1. Nutritional Fit Score (0-1)
      const nutritionalFitScore = calculateNutritionalFitScore(recipe, userPreferences);
      
      // 2. Similarity to Likes Score (0-1)
      const similarityScore = calculateSimilarityScore(recipe, userPreferences.likedMeals, enrichedRecipes, userPreferences.likedFoods);
      
      // 3. Variety Boost (0-1) - encourage variety in suggestions
      const varietyScore = calculateVarietyScore(recipe, userPreferences.likedMeals, userPreferences.recentlyViewed);
      
      // 4. Pantry Match Score (0-1)
      const pantryScore = calculatePantryMatchScore(recipe, userPreferences.pantry);
      
      // 5. Cost Score (0-1) - lower cost is better
      const costScore = calculateCostScore(recipe);
      
      // 6. Recency Penalty (0-1) - penalize recently suggested recipes
      const recencyScore = calculateRecencyScore(recipe, userPreferences.recentlyViewed || []);
      
      // Calculate weighted score
      const weightedScore = 
        weights.nutritionalFit * nutritionalFitScore +
        weights.similarityToLikes * similarityScore +
        weights.varietyBoost * varietyScore +
        weights.pantryMatch * pantryScore + 
        weights.costScore * costScore +
        weights.recencyPenalty * recencyScore;
      
      // For debugging
      const scoreDetails = {
        nutritionalFit: nutritionalFitScore,
        similarityToLikes: similarityScore,
        varietyBoost: varietyScore,
        pantryMatch: pantryScore,
        costScore: costScore,
        recencyPenalty: recencyScore,
        totalScore: weightedScore
      };
      console.log(`Recipe ${recipe.title} scored: ${weightedScore.toFixed(2)}`, scoreDetails);
      
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
   * Uses content-based similarity (ingredients, tags)
   * 
   * @param recipe - Source recipe to find alternatives for
   * @param allRecipes - Pool of recipes to search for alternatives
   * @param count - Number of alternatives to return
   * @returns List of similar recipes
   */
  findSimilarRecipes: (
    recipe: Recipe, 
    allRecipes: Recipe[],
    count: number = 3
  ): Recipe[] => {
    // Create a map of recipes with similarity scores
    const similarityMap = allRecipes
      .filter(r => r.id !== recipe.id) // Filter out the source recipe
      .map(r => {
        // Calculate ingredient overlap
        const sourceIngredients = new Set(recipe.ingredients.map(i => i.toLowerCase()));
        const targetIngredients = new Set(r.ingredients.map(i => i.toLowerCase()));
        
        // Calculate tag overlap
        const sourceTags = new Set(recipe.tags?.map(t => t.toLowerCase()) || []);
        const targetTags = new Set(r.tags?.map(t => t.toLowerCase()) || []);
        
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
  },
  
  /**
   * Gets diversified recommendations for meal planning
   * Ensures variety across the meal plan
   * 
   * @param userPreferences - User preferences
   * @param recipes - Available recipes
   * @param count - Number of recipes to recommend
   * @param mealType - Type of meal to recommend (breakfast, lunch, dinner)
   * @returns List of recommended recipes
   */
  getDiversifiedRecommendations: (
    userPreferences: ScoringPreferences,
    recipes: Recipe[],
    count: number,
    mealType?: string,
    existingSelections: string[] = []
  ): Recipe[] => {
    // Filter recipes by meal type if specified
    let candidates = recipes;
    if (mealType && mealType !== 'any') {
      candidates = recipes.filter(r => 
        r.category.toLowerCase() === mealType.toLowerCase() ||
        r.tags.some(t => t.toLowerCase() === mealType.toLowerCase())
      );
    }
    
    // Get weights from preferences or from preset
    const presetName = userPreferences.recommendationPreset || 'Healthy';
    const presetWeights = PRESETS[presetName] || PRESETS['Healthy'];
    
    const weights: RecommendationWeights = userPreferences.recommendationWeights || presetWeights;
    
    // Add existing selections to recently viewed to avoid duplicates
    const preferencesWithExisting: ScoringPreferences = {
      ...userPreferences,
      // Safely merge recentlyViewed (if exists) with existingSelections
      recentlyViewed: [
        ...(userPreferences.recentlyViewed || []), 
        ...(existingSelections || [])
      ]
    };
    
    const scoredRecipes = this.scoreRecipes(candidates, preferencesWithExisting, weights);
    
    // Get top N recommendations
    return scoredRecipes.slice(0, count);
  }
};

/**
 * Calculates how well a recipe matches the nutritional goals of the user
 * Based on fitness goal and nutritional targets
 * 
 * @param recipe - Recipe to score
 * @param userPreferences - User nutritional preferences
 * @returns Score from 0-1
 */
function calculateNutritionalFitScore(recipe: Recipe, userPreferences: ScoringPreferences): number {
  const { fitnessGoal, calorieTarget, proteinTarget, carbTarget, fatTarget } = userPreferences;
  
  // If user has specific nutritional targets, use those for precise scoring
  if (calorieTarget || proteinTarget || carbTarget || fatTarget) {
    let score = 0;
    let factors = 0;
    
    // Score calories match (if target exists)
    if (calorieTarget) {
      // Allow within 20% of target
      const calorieDeviation = Math.abs(recipe.calories - calorieTarget) / calorieTarget;
      const calorieScore = Math.max(0, 1 - calorieDeviation * 2); // Scale deviation to 0-1
      score += calorieScore;
      factors++;
    }
    
    // Score protein match
    if (proteinTarget) {
      const proteinDeviation = Math.abs(recipe.protein - proteinTarget) / proteinTarget;
      const proteinScore = Math.max(0, 1 - proteinDeviation * 2);
      score += proteinScore;
      factors++;
    }
    
    // Score carb match
    if (carbTarget) {
      const carbDeviation = Math.abs(recipe.carbs - carbTarget) / carbTarget;
      const carbScore = Math.max(0, 1 - carbDeviation * 2);
      score += carbScore;
      factors++;
    }
    
    // Score fat match
    if (fatTarget) {
      const fatDeviation = Math.abs(recipe.fat - fatTarget) / fatTarget;
      const fatScore = Math.max(0, 1 - fatDeviation * 2);
      score += fatScore;
      factors++;
    }
    
    // Return average score if we have targets, otherwise fall back to goal-based scoring
    if (factors > 0) {
      return score / factors;
    }
  }
  
  // Fall back to fitness goal-based scoring
  if (!fitnessGoal) return 0.5; // Neutral score if no goal
  
  // Calculate score based on fitness goal
  switch (fitnessGoal.toLowerCase()) {
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
 * 
 * @param recipe - Recipe to score
 * @param likedMeals - IDs of meals the user has liked
 * @param allRecipes - All available recipes
 * @param likedFoods - Ingredients/foods the user likes
 * @returns Score from 0-1
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
      const currentTags = new Set(recipe.tags?.map(t => t.toLowerCase()) || []);
      
      likedRecipes.forEach(likedRecipe => {
        const likedTags = new Set(likedRecipe.tags?.map(t => t.toLowerCase()) || []);
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
 * Ensures diversity in recommendations
 * 
 * @param recipe - Recipe to score
 * @param likedMeals - Recently liked meals
 * @param recentlyViewed - Recently viewed recipes
 * @returns Score from 0-1
 */
function calculateVarietyScore(recipe: Recipe, likedMeals: string[], recentlyViewed?: string[]): number {
  // Basic variety scoring - combine dish type and ingredient variety
  // Higher score means more variety (different from recent selections)
  
  // If no history, return neutral variety score
  if ((!likedMeals || likedMeals.length === 0) && (!recentlyViewed || recentlyViewed.length === 0)) {
    return 0.8; // Slightly favor variety when no history
  }
  
  // Default variety score
  let varietyScore = 0.5;
  
  // More advanced implementation would compare recipe vectors 
  // or ingredients to recent meals to ensure diversity
  
  // For now, implement a simple heuristic based on recipe category
  const recentCategories = new Set<string>();
  
  // Add categories from liked meals
  if (likedMeals?.length > 0) {
    // This would work better with actual recipe objects, but for now
    // just use the category from the recipe ID if we can extract it
    likedMeals.forEach(id => {
      if (id.includes('_')) {
        const category = id.split('_')[0];
        recentCategories.add(category.toLowerCase());
      }
    });
  }
  
  // Check if current recipe category is different from recent categories
  const differentCategory = !recentCategories.has(recipe.category.toLowerCase());
  
  // Bonus for recipes that are different from recent categories
  if (differentCategory) {
    varietyScore += 0.3;
  }
  
  return Math.min(varietyScore, 1); // Ensure score is between 0 and 1
}

/**
 * Calculates how well the recipe uses ingredients from the user's pantry
 * Higher score means more ingredients from pantry (less shopping needed)
 * 
 * @param recipe - Recipe to score
 * @param pantry - User's pantry ingredients
 * @returns Score from 0-1
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
 * Lower cost = higher score
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
function calculateCostScore(recipe: Recipe): number {
  // If we have explicit cost data, use it
  if (recipe.cost) {
    // Normalize cost on a 0-1 scale where 0 is expensive and 1 is cheap
    // Assume cost range is from $2-$20 per serving
    const maxCost = 20;
    const minCost = 2;
    return 1 - Math.min(1, Math.max(0, (recipe.cost - minCost) / (maxCost - minCost)));
  }
  
  // If no explicit cost, estimate based on ingredients count and protein source
  // More ingredients generally means more expensive
  const ingredientCountPenalty = Math.min(0.5, recipe.ingredients.length / 20);
  
  // Check for expensive protein sources
  const hasExpensiveProtein = recipe.ingredients.some(ing => {
    const lowerIng = ing.toLowerCase();
    return lowerIng.includes('steak') || 
           lowerIng.includes('salmon') || 
           lowerIng.includes('shrimp') ||
           lowerIng.includes('lamb');
  });
  
  const proteinPenalty = hasExpensiveProtein ? 0.3 : 0;
  
  // Calculate final cost score (higher = more cost-effective)
  return Math.max(0, 1 - ingredientCountPenalty - proteinPenalty);
}

/**
 * Calculates recency penalty to avoid showing the same recipes too often
 * Recently viewed recipes get a lower score
 * 
 * @param recipe - Recipe to score
 * @param recentlyViewed - Recently viewed recipe IDs
 * @returns Score from 0-1
 */
function calculateRecencyScore(recipe: Recipe, recentlyViewed: string[]): number {
  // If recipe was recently viewed, penalize it
  if (recentlyViewed.includes(recipe.id)) {
    // Find how recently it was viewed (position in the array)
    const recencyIndex = recentlyViewed.indexOf(recipe.id);
    // More recent views get a higher penalty (lower score)
    // Normalize to 0-0.8 scale (never complete exclusion)
    return 0.2 + 0.8 * (recencyIndex / Math.max(1, recentlyViewed.length - 1));
  }
  
  // Recipe wasn't recently viewed, no penalty
  return 1.0;
}

// Specific fitness goal score calculators

/**
 * Calculates score for weight loss goal
 * Prefer lower calories, moderate protein, higher fiber
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
function calculateWeightLossScore(recipe: Recipe): number {
  // For weight loss: prefer lower calories, moderate protein, lower fat
  const calorieScore = 1 - (recipe.calories / 1000); // Lower calories = higher score
  const proteinScore = recipe.protein / recipe.calories; // Higher protein:calorie ratio = better
  const fiberScore = (recipe.fiber || 0) / 30; // Higher fiber = better
  
  return (calorieScore * 0.5) + (proteinScore * 0.3) + (fiberScore * 0.2);
}

/**
 * Calculates score for muscle gain goal
 * Prefer high protein, adequate calories
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
function calculateMuscleGainScore(recipe: Recipe): number {
  // For muscle gain: prefer high protein, adequate calories
  const proteinScore = recipe.protein / 50; // Higher protein = better
  const calorieScore = Math.min(1, recipe.calories / 800); // Higher calories within reason = better
  
  return (proteinScore * 0.7) + (calorieScore * 0.3);
}

/**
 * Calculates score for maintenance goal
 * Prefer balanced macros
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
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

/**
 * Calculates score for athletic performance goal
 * Prefer higher carbs, moderate protein
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
function calculatePerformanceScore(recipe: Recipe): number {
  // For athletic performance: prefer higher carbs, moderate protein
  const carbScore = Math.min(1, recipe.carbs / 100); // Higher carbs = better
  const proteinScore = Math.min(1, recipe.protein / 40); // Good protein = better
  
  return (carbScore * 0.6) + (proteinScore * 0.4);
}
