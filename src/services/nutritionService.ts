
import { FoodItem, Recipe, EnrichedRecipe, RecipeIngredient } from "@/types/recipes";
import { getIngredientId, getIngredientAmount, isRecipeIngredient } from "@/utils/ingredientUtils";

// Cache for the library data to avoid multiple network requests
let vegLibraryCache: FoodItem[] = [];

/**
 * Load the vegetable library data from the server
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
 * Find a food item by ID in the library
 */
export async function getFoodItemById(id: number): Promise<FoodItem | null> {
  const library = await loadVegLibrary();
  return library.find(item => item.id === id) || null;
}

/**
 * Convert a FoodItem to a Recipe format
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
 */
export async function calculateNutritionAndCost(recipe: Recipe, foodLibrary?: FoodItem[]): Promise<EnrichedRecipe> {
  const library = foodLibrary || await loadVegLibrary();
  
  // Initialize nutrition values
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  let totalCost = 0;
  let missingIngredients = false;
  
  // Calculate nutrition for each ingredient
  for (const ingredient of recipe.ingredients) {
    // Skip if not a RecipeIngredient object and we can't get an ID
    const ingredientId = getIngredientId(ingredient);
    if (ingredientId === null) {
      missingIngredients = true;
      continue;
    }
    
    // Get the amount in the appropriate unit
    const amount = getIngredientAmount(ingredient);
    
    // Find the food item in the library
    const foodItem = library.find(item => item.id === ingredientId);
    
    if (foodItem) {
      // Calculate nutritional values based on amount
      const ratio = amount / 100; // Amount relative to 100g/ml standard
      
      totalCalories += foodItem.nutrients.calories * ratio;
      totalProtein += foodItem.nutrients.protein_g * ratio;
      totalCarbs += foodItem.nutrients.carbs_g * ratio;
      totalFat += foodItem.nutrients.fat_g * ratio;
      totalFiber += (foodItem.nutrients.fiber_g || 0) * ratio;
      totalSugar += (foodItem.nutrients.sugar_g || 0) * ratio;
      
      // Add cost if available
      if (foodItem.costPer100g) {
        totalCost += foodItem.costPer100g * ratio;
      }
    } else {
      missingIngredients = true;
    }
  }
  
  // Adjust for servings
  const servings = recipe.servings || 1;
  const caloriesPerServing = totalCalories / servings;
  const proteinPerServing = totalProtein / servings;
  const carbsPerServing = totalCarbs / servings;
  const fatPerServing = totalFat / servings;
  const fiberPerServing = totalFiber / servings;
  const sugarPerServing = totalSugar / servings;
  const costPerServing = totalCost / servings;
  
  // Log warning if ingredients are missing
  if (missingIngredients) {
    console.warn(`Recipe ${recipe.id} has missing ingredients. Nutrition values may be incomplete.`);
  }
  
  // Round values for better display
  const roundedCalories = Math.round(caloriesPerServing);
  const roundedProtein = Math.round(proteinPerServing * 10) / 10;
  const roundedCarbs = Math.round(carbsPerServing * 10) / 10;
  const roundedFat = Math.round(fatPerServing * 10) / 10;
  const roundedFiber = Math.round(fiberPerServing * 10) / 10;
  const roundedSugar = Math.round(sugarPerServing * 10) / 10;
  const roundedCost = Math.round(costPerServing * 100) / 100;
  
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
 * Ensure all recipes have nutrition data
 */
export async function ensureNutritionAndCost(recipes: Recipe[]): Promise<EnrichedRecipe[]> {
  const library = await loadVegLibrary();
  const enrichedRecipes: EnrichedRecipe[] = [];
  
  for (const recipe of recipes) {
    // Case 1: Recipe already has nutrition object
    if (recipe.nutrition) {
      enrichedRecipes.push({
        ...recipe,
        nutrition: {
          calories: recipe.nutrition.calories,
          protein: recipe.nutrition.protein,
          carbs: recipe.nutrition.carbs,
          fat: recipe.nutrition.fat,
          fiber: recipe.nutrition.fiber || 0,
          sugar: recipe.nutrition.sugar || 0,
          cost: recipe.nutrition.cost || 0
        }
      });
    }
    // Case 2: Legacy fields exist (calories, protein, etc. at root level)
    else if (typeof recipe.calories === 'number') {
      enrichedRecipes.push({
        ...recipe,
        nutrition: {
          calories: recipe.calories,
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          fat: recipe.fat || 0,
          fiber: recipe.fiber || 0,
          sugar: recipe.sugar || 0,
          cost: recipe.cost || 1.99 // Default cost if not specified
        }
      });
    }
    // Case 3: Calculate nutrition from ingredients
    else if (recipe.ingredients && recipe.ingredients.length > 0) {
      const enriched = await calculateNutritionAndCost(recipe, library);
      enrichedRecipes.push(enriched);
    }
    // Case 4: No data available, add placeholder
    else {
      enrichedRecipes.push({
        ...recipe,
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          cost: 0
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
