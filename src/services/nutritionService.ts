import { FoodItem, Recipe, EnrichedRecipe, RecipeIngredient } from "@/types/recipes";
import { calculateIngredientNutrition, calculateIngredientNutritionDetailed, loadVegLibraryWeights, isRecipeIngredient } from "@/utils/ingredientUtils";

// Cache for the library data to avoid multiple network requests
let vegLibraryCache: FoodItem[] = [];

/**
 * Load the vegetable library data from the server (legacy support)
 */
export async function loadVegLibrary(): Promise<FoodItem[]> {
  if (vegLibraryCache.length > 0) {
    return vegLibraryCache;
  }
  
  try {
    const response = await fetch('/src/data/veg_library.ndjson');
    const text = await response.text();
    
    // Parse NDJSON format (each line is a JSON object)
    const lines = text.trim().split('\n');
    const data = lines.map(line => JSON.parse(line));
    
    vegLibraryCache = data;
    return data;
  } catch (error) {
    console.error('Failed to load veg library:', error);
    return [];
  }
}

/**
 * Find a food item by ID in the library (legacy support)
 */
export async function getFoodItemById(id: number): Promise<FoodItem | null> {
  const library = await loadVegLibrary();
  return library.find(item => item.id === id) || null;
}

/**
 * Convert a FoodItem to a Recipe format (legacy support)
 */
export function convertFoodItemToRecipe(item: FoodItem): EnrichedRecipe {
  // Convert the serving unit to one of the allowed types
  let unitType: "g" | "ml" | "piece" = "g"; // Default to "g"
  
  if (item.servingUnit === "ml") {
    unitType = "ml";
  } else if (item.servingUnit === "piece") {
    unitType = "piece";
  }
  
  return {
    id: `food-${item.id}`,
    title: item.name,
    image: 'placeholder.svg',
    time: '5 mins',
    category: item.category,
    tags: [item.category],
    saved: false,
    difficulty: 'Easy',
    servings: 1,
    ingredients: [{ id: item.id, amount: 100, unit: unitType, name: item.name }],
    nutrition: {
      calories: item.nutrients.calories,
      protein: item.nutrients.protein_g,
      carbs: item.nutrients.carbs_g,
      fat: item.nutrients.fat_g,
      fiber: item.nutrients.fiber_g || 0,
      sugar: item.nutrients.sugar_g || 0, // Added sugar with fallback to 0
      cost: item.costPer100g || 0
    }
  };
}

/**
 * Calculate comprehensive nutrition and cost for a recipe including micronutrients
 * Pull ingredient data from veg_library_with_weights.ndjson
 * Calculate per-ingredient macros using averageWeightPerPiece when unit==="piece"
 * Sum totals for basePortions = 4, then scale to current servings
 */
export async function calculateNutritionAndCost(recipe: Recipe): Promise<EnrichedRecipe> {
  // Initialize nutrition totals for the entire recipe (base 4 portions)
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalCost = 0;
  // Extended nutrition totals
  let totalSodium = 0;
  let totalPotassium = 0;
  let totalCalcium = 0;
  let totalIron = 0;
  let totalMagnesium = 0;
  let totalVitaminC = 0;
  let totalVitaminA = 0;
  let totalVitaminK = 0;
  let totalVitaminE = 0;
  let totalFolate = 0;
  let missingIngredients = false;
  
  // Step A & B: For each ingredient, lookup nutrition data and calculate totals
  for (const ingredient of recipe.ingredients) {
    // Skip string ingredients that can't be processed
    if (!isRecipeIngredient(ingredient)) {
      console.warn(`Skipping string ingredient: ${ingredient}`);
      missingIngredients = true;
      continue;
    }
    
    // Calculate nutrition for this ingredient using the enhanced helper
    const nutrition = await calculateIngredientNutritionDetailed(ingredient);
    
    if (nutrition) {
      // Step C: Sum across all ingredients
      totalCalories += nutrition.totalCalories;
      totalProtein += nutrition.totalProtein;
      totalCarbs += nutrition.totalCarbs;
      totalFat += nutrition.totalFat;
      totalFiber += nutrition.totalFiber;
      totalSugar += nutrition.totalSugar;
      totalCost += nutrition.totalCost;
      // Sum extended nutrients
      totalSodium += nutrition.totalSodium || 0;
      totalPotassium += nutrition.totalPotassium || 0;
      totalCalcium += nutrition.totalCalcium || 0;
      totalIron += nutrition.totalIron || 0;
      totalMagnesium += nutrition.totalMagnesium || 0;
      totalVitaminC += nutrition.totalVitaminC || 0;
      totalVitaminA += nutrition.totalVitaminA || 0;
      totalVitaminK += nutrition.totalVitaminK || 0;
      totalVitaminE += nutrition.totalVitaminE || 0;
      totalFolate += nutrition.totalFolate || 0;
    } else {
      missingIngredients = true;
    }
  }
  
  // Step D: Store base nutrition for 4 portions and calculate per-serving values
  const basePortions = 4;
  const currentServings = recipe.servings || 4;
  
  // Calculate derived values for base portions
  const netCarbsBase = Math.max(0, totalCarbs - totalFiber);
  const sodiumToPotassiumRatio = totalPotassium > 0 ? totalSodium / totalPotassium : undefined;
  
  // Calculate scores (simple v1 implementations)
  const satietyScore = totalCalories > 0 ? (totalProtein + totalFiber) / Math.max(totalCalories, 1) : 0;
  const muscleScore = totalCalories > 0 ? (totalProtein / Math.max(totalCalories, 1)) + (totalProtein >= 30 * basePortions ? 0.1 : 0) : 0;
  const cardioScore = (totalPotassium / 1000) - (totalSodium / 1000);
  
  // Store base nutrition (for 4 portions)
  const nutritionBase = {
    calories: totalCalories,
    protein: totalProtein,
    carbs: totalCarbs,
    fat: totalFat,
    fiber: totalFiber,
    sugar: totalSugar,
    cost: totalCost,
    // Extended details
    sodium_mg: totalSodium,
    potassium_mg: totalPotassium,
    calcium_mg: totalCalcium,
    iron_mg: totalIron,
    magnesium_mg: totalMagnesium,
    vitaminC_mg: totalVitaminC,
    vitaminA_ug: totalVitaminA,
    vitaminK_ug: totalVitaminK,
    vitaminE_mg: totalVitaminE,
    folate_ug: totalFolate,
    netCarbs_g: netCarbsBase,
    sodiumToPotassiumRatio,
    satietyScore,
    muscleScore,
    cardioScore,
    source: 'veg_library_with_weights' as const,
    lastCalculatedAt: new Date().toISOString(),
    basePortions,
    gramsPerPortion: totalCalories > 0 ? (totalCalories * 4) / totalCalories : 0 // rough estimate
  };
  
  // Scale to current servings
  const scaledNutrition = scaleNutrition(nutritionBase, currentServings, basePortions);
  
  // Log warning if ingredients are missing
  if (missingIngredients) {
    console.warn(`Recipe ${recipe.id} has missing or invalid ingredients. Nutrition values may be incomplete.`);
  }
  
  // Step E: Return enriched recipe with both base and scaled nutrition
  return {
    ...recipe,
    nutrition: {
      calories: Math.round(scaledNutrition.calories),
      protein: Math.round(scaledNutrition.protein * 10) / 10,
      carbs: Math.round(scaledNutrition.carbs * 10) / 10,
      fat: Math.round(scaledNutrition.fat * 10) / 10,
      fiber: Math.round(scaledNutrition.fiber * 10) / 10,
      sugar: Math.round(scaledNutrition.sugar * 10) / 10,
      cost: Math.round(scaledNutrition.cost * 100) / 100
    },
    nutritionDetails: {
      sodium_mg: scaledNutrition.sodium_mg ? Math.round(scaledNutrition.sodium_mg * 10) / 10 : undefined,
      potassium_mg: scaledNutrition.potassium_mg ? Math.round(scaledNutrition.potassium_mg * 10) / 10 : undefined,
      calcium_mg: scaledNutrition.calcium_mg ? Math.round(scaledNutrition.calcium_mg * 10) / 10 : undefined,
      iron_mg: scaledNutrition.iron_mg ? Math.round(scaledNutrition.iron_mg * 10) / 10 : undefined,
      magnesium_mg: scaledNutrition.magnesium_mg ? Math.round(scaledNutrition.magnesium_mg * 10) / 10 : undefined,
      vitaminC_mg: scaledNutrition.vitaminC_mg ? Math.round(scaledNutrition.vitaminC_mg * 10) / 10 : undefined,
      vitaminA_ug: scaledNutrition.vitaminA_ug ? Math.round(scaledNutrition.vitaminA_ug * 10) / 10 : undefined,
      vitaminK_ug: scaledNutrition.vitaminK_ug ? Math.round(scaledNutrition.vitaminK_ug * 10) / 10 : undefined,
      vitaminE_mg: scaledNutrition.vitaminE_mg ? Math.round(scaledNutrition.vitaminE_mg * 10) / 10 : undefined,
      folate_ug: scaledNutrition.folate_ug ? Math.round(scaledNutrition.folate_ug * 10) / 10 : undefined,
      netCarbs_g: scaledNutrition.netCarbs_g ? Math.round(scaledNutrition.netCarbs_g * 10) / 10 : undefined,
      sodiumToPotassiumRatio: scaledNutrition.sodiumToPotassiumRatio ? Math.round(scaledNutrition.sodiumToPotassiumRatio * 100) / 100 : undefined,
      satietyScore: scaledNutrition.satietyScore ? Math.round(scaledNutrition.satietyScore * 100) / 100 : undefined,
      muscleScore: scaledNutrition.muscleScore ? Math.round(scaledNutrition.muscleScore * 100) / 100 : undefined,
      cardioScore: scaledNutrition.cardioScore ? Math.round(scaledNutrition.cardioScore * 100) / 100 : undefined,
      source: scaledNutrition.source,
      lastCalculatedAt: scaledNutrition.lastCalculatedAt,
      basePortions: scaledNutrition.basePortions,
      gramsPerPortion: scaledNutrition.gramsPerPortion
    },
    nutritionBase
  };
}

/**
 * Ensure all recipes have nutrition data calculated dynamically
 */
export async function ensureNutritionAndCost(recipes: Recipe[]): Promise<EnrichedRecipe[]> {
  const enrichedRecipes: EnrichedRecipe[] = [];
  
  for (const recipe of recipes) {
    // Always recalculate nutrition from ingredients if they exist
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      try {
        const enriched = await calculateNutritionAndCost(recipe);
        enrichedRecipes.push(enriched);
      } catch (error) {
        console.error(`Error calculating nutrition for recipe ${recipe.id}:`, error);
        // Fallback to existing nutrition data or defaults
        enrichedRecipes.push({
          ...recipe,
          nutrition: recipe.nutrition || {
            calories: recipe.calories || 0,
            protein: recipe.protein || 0,
            carbs: recipe.carbs || 0,
            fat: recipe.fat || 0,
            fiber: recipe.fiber || 0,
            sugar: recipe.sugar || 0,
            cost: recipe.cost || 0
          }
        });
      }
    } else {
      // No ingredients available, use existing data or defaults
      enrichedRecipes.push({
        ...recipe,
        nutrition: recipe.nutrition || {
          calories: recipe.calories || 0,
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          fat: recipe.fat || 0,
          fiber: recipe.fiber || 0,
          sugar: recipe.sugar || 0,
          cost: recipe.cost || 0
        }
      });
    }
  }
  
  return enrichedRecipes;
}

/**
 * Helper function to scale nutrition values from base portions to target servings
 * Used for client-side scaling when user changes serving size
 * 
 * @param baseNutrition - Nutrition data for base portions (usually 4)
 * @param targetServings - Target number of servings
 * @param basePortions - Base number of portions (default 4)
 * @returns Scaled nutrition values
 */
export function scaleNutrition(
  baseNutrition: any, 
  targetServings: number, 
  basePortions: number = 4
): any {
  const scaleFactor = targetServings / basePortions;
  
  const scaled: any = {};
  
  // Scale all numeric values
  for (const [key, value] of Object.entries(baseNutrition)) {
    if (typeof value === 'number') {
      scaled[key] = value * scaleFactor;
    } else {
      scaled[key] = value; // Keep non-numeric values as-is
    }
  }
  
  return scaled;
}

/**
 * Calculate cost per serving for a recipe
 */
export function calculateCostPerServing(recipe: EnrichedRecipe): number {
  return recipe.nutrition.cost;
}
