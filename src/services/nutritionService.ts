import { FoodItem, Recipe, EnrichedRecipe, RecipeIngredient } from '@/types/recipes';

// Cache for the loaded library
let vegLibraryCache: FoodItem[] | null = null;

/**
 * Loads and parses the vegetable library data from NDJSON file
 * @returns Promise with array of FoodItem objects
 */
export async function loadVegLibrary(): Promise<FoodItem[]> {
  // Return cached data if available
  if (vegLibraryCache !== null) {
    return vegLibraryCache;
  }

  try {
    const response = await fetch('/src/data/veg_library_v2.ndjson');
    const text = await response.text();
    
    // Parse each line as JSON
    const items: FoodItem[] = text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        try {
          const parsedItem = JSON.parse(line);
          return validateFoodItem(parsedItem);
        } catch (error) {
          console.error('Error parsing food item:', error);
          return null;
        }
      })
      .filter((item): item is FoodItem => item !== null);
    
    // Cache the results
    vegLibraryCache = items;
    return items;
  } catch (error) {
    console.error('Error loading veg library:', error);
    return [];
  }
}

/**
 * Validates and normalizes a food item, filling in missing values
 */
function validateFoodItem(item: any): FoodItem {
  // Ensure nutrients object exists
  if (!item.nutrients) {
    item.nutrients = {};
  }
  
  // Default values for required nutrient fields
  const nutrients = {
    calories: item.nutrients.calories || 0,
    protein_g: item.nutrients.protein_g || 0,
    fat_g: item.nutrients.fat_g || 0,
    carbs_g: item.nutrients.carbs_g || 0,
    fiber_g: item.nutrients.fiber_g || 0,
    ...item.nutrients // Keep any other nutrients that might exist
  };
  
  return {
    id: item.id || 0,
    name: item.name || 'Unknown Food',
    category: item.category || 'Other',
    servingSize: item.servingSize || 100,
    servingUnit: item.servingUnit || 'g',
    costPer100g: item.costPer100g || 0,
    nutrients,
    evidence: item.evidence,
    citations: item.citations || [],
    source: item.source,
    lastUpdated: item.lastUpdated
  };
}

/**
 * Calculates nutrition and cost for a recipe based on its ingredients
 * @param recipe Recipe with ingredients
 * @param foodLibrary Optional pre-loaded food library
 * @returns Promise with enriched recipe including nutrition data
 */
export async function calculateNutritionAndCost(
  recipe: Recipe,
  foodLibrary?: FoodItem[]
): Promise<EnrichedRecipe> {
  // Load food library if not provided
  const library = foodLibrary || await loadVegLibrary();
  
  // Initialize nutrition totals
  let sumCalories = 0;
  let sumProtein = 0;
  let sumCarbs = 0;
  let sumFat = 0;
  let sumFiber = 0;
  let sumSugar = 0;
  let sumCost = 0;
  
  // Missing ingredient IDs for error reporting
  const missingIngredients: number[] = [];
  
  // Process each ingredient
  for (const ingredient of recipe.ingredients) {
    // Skip string ingredients or handle them differently during transition
    if (typeof ingredient === 'string') {
      continue;
    }
    
    // Find food item in library
    const foodItem = library.find(item => item.id === ingredient.id);
    
    if (!foodItem) {
      missingIngredients.push(ingredient.id);
      continue;
    }
    
    // Calculate nutrient amounts based on ingredient amount
    // Convert to per 100g basis first
    const scaleFactor = ingredient.amount / 100;
    
    sumCalories += scaleFactor * foodItem.nutrients.calories;
    sumProtein += scaleFactor * foodItem.nutrients.protein_g;
    sumCarbs += scaleFactor * foodItem.nutrients.carbs_g;
    sumFat += scaleFactor * foodItem.nutrients.fat_g;
    sumFiber += scaleFactor * foodItem.nutrients.fiber_g;
    
    // Some items might not have sugar data
    if (foodItem.nutrients.sugar_g) {
      sumSugar += scaleFactor * foodItem.nutrients.sugar_g;
    }
    
    // Calculate cost if available
    if (foodItem.costPer100g) {
      sumCost += scaleFactor * foodItem.costPer100g;
    }
  }
  
  // Report any missing ingredients
  if (missingIngredients.length > 0) {
    console.warn(`Recipe ${recipe.id} has missing ingredients:`, missingIngredients);
  }
  
  // Create enriched recipe with calculated nutrition
  return {
    ...recipe,
    nutrition: {
      calories: Math.round(sumCalories),
      protein: Math.round(sumProtein * 10) / 10, // Round to 1 decimal place
      carbs: Math.round(sumCarbs * 10) / 10,
      fat: Math.round(sumFat * 10) / 10,
      fiber: Math.round(sumFiber * 10) / 10,
      sugar: Math.round(sumSugar * 10) / 10,
      cost: Math.round(sumCost * 100) / 100, // Round to 2 decimal places
    }
  };
}

/**
 * Ensures all recipes have nutrition data by calculating it if missing
 * @param recipes Array of recipes
 * @returns Promise with array of enriched recipes
 */
export async function ensureNutritionAndCost(recipes: Recipe[]): Promise<EnrichedRecipe[]> {
  // Load food library once for all recipes
  const foodLibrary = await loadVegLibrary();
  
  // Process each recipe
  const enrichedRecipes = await Promise.all(
    recipes.map(async (recipe) => {
      // Skip calculation if nutrition data already exists and is complete
      if (recipe.nutrition?.calories && recipe.nutrition?.protein && 
          recipe.nutrition?.carbs && recipe.nutrition?.fat && 
          recipe.nutrition?.fiber && recipe.nutrition?.cost) {
        return recipe as EnrichedRecipe;
      }
      
      // For backward compatibility - if recipe has legacy fields, use them
      if (recipe.calories && recipe.protein && recipe.carbs && recipe.fat) {
        const cost = recipe.cost || calculateEstimatedCost(recipe);
        
        return {
          ...recipe,
          nutrition: {
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat,
            fiber: recipe.fiber || 0,
            sugar: recipe.sugar,
            cost
          }
        };
      }
      
      // If recipe has ingredients with IDs, calculate nutrition
      if (recipe.ingredients && recipe.ingredients.some((ing): ing is RecipeIngredient => 
        typeof ing === 'object' && 'id' in ing && 'amount' in ing)) {
        return calculateNutritionAndCost(recipe, foodLibrary);
      }
      
      // For legacy recipes with string ingredients, estimate nutrition
      console.warn(`Recipe ${recipe.id || 'unknown'} has no ingredient IDs, using estimated nutrition.`);
      return estimateRecipeNutrition(recipe);
    })
  );

  return enrichedRecipes;
}

/**
 * Estimates recipe cost based on ingredient count and category
 */
function calculateEstimatedCost(recipe: Recipe): number {
  // Simple estimation based on number of ingredients and recipe category
  const basePrice = 2.0;
  const ingredientCost = (recipe.ingredients?.length || 0) * 0.5;
  
  // Premium for certain categories
  let categoryMultiplier = 1.0;
  const category = recipe.category?.toLowerCase() || '';
  
  if (category.includes('premium') || category.includes('gourmet')) {
    categoryMultiplier = 1.5;
  } else if (category.includes('dessert') || category.includes('seafood')) {
    categoryMultiplier = 1.2;
  }
  
  return Math.round((basePrice + ingredientCost) * categoryMultiplier * 100) / 100;
}

/**
 * Estimates recipe nutrition for legacy recipes without ingredient IDs
 */
function estimateRecipeNutrition(recipe: Recipe): EnrichedRecipe {
  // Use existing nutrition data if available, otherwise estimate
  return {
    ...recipe,
    nutrition: {
      calories: recipe.calories || 500,
      protein: recipe.protein || 15,
      carbs: recipe.carbs || 50,
      fat: recipe.fat || 20,
      fiber: recipe.fiber || 5,
      sugar: recipe.sugar || 10,
      cost: recipe.cost || calculateEstimatedCost(recipe)
    }
  };
}

/**
 * Gets a food item by ID 
 */
export async function getFoodItemById(id: number): Promise<FoodItem | undefined> {
  const library = await loadVegLibrary();
  return library.find(item => item.id === id);
}

/**
 * Gets food items by category
 */
export async function getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
  const library = await loadVegLibrary();
  return library.filter(item => item.category === category);
}

/**
 * Converts a FoodItem to a Recipe format
 */
export function convertFoodItemToRecipe(foodItem: FoodItem): EnrichedRecipe {
  return {
    id: `food-${foodItem.id}`,
    title: foodItem.name,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', // Default image
    time: '10 mins', // Default time
    category: foodItem.category,
    tags: [foodItem.category],
    saved: false,
    ingredients: [
      {
        id: foodItem.id,
        amount: 100,
        unit: 'g' as const,
        name: foodItem.name
      }
    ],
    difficulty: 'Easy' as const,
    nutrition: {
      calories: foodItem.nutrients.calories,
      protein: foodItem.nutrients.protein_g,
      carbs: foodItem.nutrients.carbs_g,
      fat: foodItem.nutrients.fat_g,
      fiber: foodItem.nutrients.fiber_g,
      cost: foodItem.costPer100g || 0
    }
  };
}
