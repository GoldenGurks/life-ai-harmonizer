
import { Recipe, ScoringPreferences } from '@/types/recipes';

/**
 * Calculates how well a recipe matches the nutritional goals of the user
 * Based on fitness goal and nutritional targets
 * 
 * @param recipe - Recipe to score
 * @param userPreferences - User nutritional preferences
 * @returns Score from 0-1
 */
export function calculateNutritionalFitScore(recipe: Recipe, userPreferences: ScoringPreferences): number {
  const { fitnessGoal, calorieTarget, proteinTarget, carbTarget, fatTarget } = userPreferences;
  
  // If user has specific nutritional targets, use those for precise scoring
  if (calorieTarget || proteinTarget || carbTarget || fatTarget) {
    let score = 0;
    let factors = 0;
    
    // Get nutrition values from recipe (new or legacy structure)
    const calories = recipe.nutrition?.calories || recipe.calories || 0;
    const protein = recipe.nutrition?.protein || recipe.protein || 0;
    const carbs = recipe.nutrition?.carbs || recipe.carbs || 0;
    const fat = recipe.nutrition?.fat || recipe.fat || 0;
    
    // Score calories match (if target exists)
    if (calorieTarget) {
      // Allow within 20% of target
      const calorieDeviation = Math.abs(calories - calorieTarget) / calorieTarget;
      const calorieScore = Math.max(0, 1 - calorieDeviation * 2); // Scale deviation to 0-1
      score += calorieScore;
      factors++;
    }
    
    // Score protein match
    if (proteinTarget) {
      const proteinDeviation = Math.abs(protein - proteinTarget) / proteinTarget;
      const proteinScore = Math.max(0, 1 - proteinDeviation * 2);
      score += proteinScore;
      factors++;
    }
    
    // Score carb match
    if (carbTarget) {
      const carbDeviation = Math.abs(carbs - carbTarget) / carbTarget;
      const carbScore = Math.max(0, 1 - carbDeviation * 2);
      score += carbScore;
      factors++;
    }
    
    // Score fat match
    if (fatTarget) {
      const fatDeviation = Math.abs(fat - fatTarget) / fatTarget;
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
 * Calculates score for weight loss goal
 * Prefer lower calories, moderate protein, higher fiber
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
export function calculateWeightLossScore(recipe: Recipe): number {
  // For weight loss: prefer lower calories, moderate protein, lower fat
  const calories = recipe.nutrition?.calories || recipe.calories || 0;
  const protein = recipe.nutrition?.protein || recipe.protein || 0;
  const fiber = recipe.nutrition?.fiber || recipe.fiber || 0;
  
  const calorieScore = calories > 0 ? 1 - (calories / 1000) : 0; // Lower calories = higher score
  const proteinScore = calories > 0 ? protein / calories : 0; // Higher protein:calorie ratio = better
  const fiberScore = fiber / 30; // Higher fiber = better
  
  return (calorieScore * 0.5) + (proteinScore * 0.3) + (fiberScore * 0.2);
}

/**
 * Calculates score for muscle gain goal
 * Prefer high protein, adequate calories
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
export function calculateMuscleGainScore(recipe: Recipe): number {
  // For muscle gain: prefer high protein, adequate calories
  const calories = recipe.nutrition?.calories || recipe.calories || 0;
  const protein = recipe.nutrition?.protein || recipe.protein || 0;
  
  const proteinScore = protein / 50; // Higher protein = better
  const calorieScore = Math.min(1, calories / 800); // Higher calories within reason = better
  
  return (proteinScore * 0.7) + (calorieScore * 0.3);
}

/**
 * Calculates score for maintenance goal
 * Prefer balanced macros
 * 
 * @param recipe - Recipe to score
 * @returns Score from 0-1
 */
export function calculateMaintenanceScore(recipe: Recipe): number {
  // For maintenance: prefer balanced macros
  // Ideal: ~30% protein, ~40% carbs, ~30% fat
  const calories = recipe.nutrition?.calories || recipe.calories || 0;
  const protein = recipe.nutrition?.protein || recipe.protein || 0;
  const carbs = recipe.nutrition?.carbs || recipe.carbs || 0;
  const fat = recipe.nutrition?.fat || recipe.fat || 0;
  
  if (calories === 0) return 0; // Avoid division by zero
  
  const proteinCals = protein * 4;
  const carbCals = carbs * 4;
  const fatCals = fat * 9;
  
  const proteinPct = proteinCals / calories;
  const carbPct = carbCals / calories;
  const fatPct = fatCals / calories;
  
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
export function calculatePerformanceScore(recipe: Recipe): number {
  // For athletic performance: prefer higher carbs, moderate protein
  const carbs = recipe.nutrition?.carbs || recipe.carbs || 0;
  const protein = recipe.nutrition?.protein || recipe.protein || 0;
  
  const carbScore = Math.min(1, carbs / 100); // Higher carbs = better
  const proteinScore = Math.min(1, protein / 40); // Good protein = better
  
  return (carbScore * 0.6) + (proteinScore * 0.4);
}
