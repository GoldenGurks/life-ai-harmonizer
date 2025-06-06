import { FoodItem, Recipe, EnrichedRecipe, RecipeIngredient } from "@/types/recipes";
import { calculateIngredientNutrition, loadVegLibraryWeights, isRecipeIngredient } from "@/utils/ingredientUtils";

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
 * Calculate nutrition and cost for a recipe
 * Pull ingredient data from veg_library_with_weights.ndjson
 * Calculate per-ingredient macros using averageWeightPerPiece when unit==="piece"
 * Sum and divide by recipe.servings (4) to get per-serving nutrition + cost
 */
export async function calculateNutritionAndCost(recipe: Recipe): Promise<EnrichedRecipe> {
  // Initialize nutrition totals for the entire recipe
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalCost = 0;
  let missingIngredients = false;
  
  // Step A & B: For each ingredient, lookup nutrition data and calculate totals
  for (const ingredient of recipe.ingredients) {
    // Skip string ingredients that can't be processed
    if (!isRecipeIngredient(ingredient)) {
      console.warn(`Skipping string ingredient: ${ingredient}`);
      missingIngredients = true;
      continue;
    }
    
    // Calculate nutrition for this ingredient using the new helper
    const nutrition = await calculateIngredientNutrition(ingredient);
    
    if (nutrition) {
      // Step C: Sum across all ingredients
      totalCalories += nutrition.totalCalories;
      totalProtein += nutrition.totalProtein;
      totalCarbs += nutrition.totalCarbs;
      totalFat += nutrition.totalFat;
      totalFiber += nutrition.totalFiber;
      totalSugar += nutrition.totalSugar;
      totalCost += nutrition.totalCost;
    } else {
      missingIngredients = true;
    }
  }
  
  // Step D: Divide by recipe.servings (default 4) to get per-serving values
  const servings = recipe.servings || 4;
  const caloriesPerServing = totalCalories / servings;
  const proteinPerServing = totalProtein / servings;
  const carbsPerServing = totalCarbs / servings;
  const fatPerServing = totalFat / servings;
  const fiberPerServing = totalFiber / servings;
  const sugarPerServing = totalSugar / servings;
  const costPerServing = totalCost / servings;
  
  // Log warning if ingredients are missing
  if (missingIngredients) {
    console.warn(`Recipe ${recipe.id} has missing or invalid ingredients. Nutrition values may be incomplete.`);
  }
  
  // Round values for better display
  const roundedCalories = Math.round(caloriesPerServing);
  const roundedProtein = Math.round(proteinPerServing * 10) / 10;
  const roundedCarbs = Math.round(carbsPerServing * 10) / 10;
  const roundedFat = Math.round(fatPerServing * 10) / 10;
  const roundedFiber = Math.round(fiberPerServing * 10) / 10;
  const roundedSugar = Math.round(sugarPerServing * 10) / 10;
  const roundedCost = Math.round(costPerServing * 100) / 100;
  
  // Step E: Attach the final object under recipe.nutrition
  return {
    ...recipe,
    nutrition: {
      calories: roundedCalories,
      protein: roundedProtein,
      carbs: roundedCarbs,
      fat: roundedFat,
      fiber: roundedFiber,
      sugar: roundedSugar,
      cost: roundedCost
    }
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
 * Calculate cost per serving for a recipe
 */
export function calculateCostPerServing(recipe: EnrichedRecipe): number {
  return recipe.nutrition.cost;
}
