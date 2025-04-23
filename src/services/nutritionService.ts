
import { FoodItem, Recipe } from '@/types/recipes';
import { ensureNutrientScore } from '@/lib/recipeEnrichment';

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
    const response = await fetch('/src/data/veg_library.ndjson');
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
    nutrients,
    evidence: item.evidence,
    citations: item.citations || [],
    source: item.source,
    lastUpdated: item.lastUpdated
  };
}

/**
 * Converts a FoodItem to a Recipe format
 */
export function convertFoodItemToRecipe(foodItem: FoodItem): Recipe {
  return {
    id: `food-${foodItem.id}`,
    title: foodItem.name,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', // Default image
    time: '10 mins', // Default time
    category: foodItem.category,
    tags: [foodItem.category],
    saved: false,
    calories: foodItem.nutrients.calories,
    protein: foodItem.nutrients.protein_g,
    carbs: foodItem.nutrients.carbs_g,
    fat: foodItem.nutrients.fat_g,
    fiber: foodItem.nutrients.fiber_g,
    ingredients: [`${foodItem.servingSize} ${foodItem.servingUnit} ${foodItem.name}`],
    difficulty: 'Easy' as const,
    nutrientScore: calculateNutrientScore(foodItem)
  };
}

/**
 * Calculate a nutrient score based on the food's nutritional content
 */
function calculateNutrientScore(foodItem: FoodItem): number {
  const nutrients = foodItem.nutrients;
  
  // Basic nutrition score calculation (similar to computeFromMacros in recipeEnrichment)
  const fiberScore = nutrients.fiber_g / 30;
  const calorieScore = 1 - Math.min(1, nutrients.calories / 1000);
  const proteinScore = Math.min(1, nutrients.protein_g / 50);
  
  // Add vitamin/mineral consideration if available
  let vitaminScore = 0;
  let mineralCount = 0;
  
  if (nutrients.vitaminA_ug !== undefined) {
    vitaminScore += Math.min(1, nutrients.vitaminA_ug / 900);
    mineralCount++;
  }
  if (nutrients.vitaminC_mg !== undefined) {
    vitaminScore += Math.min(1, nutrients.vitaminC_mg / 90);
    mineralCount++;
  }
  if (nutrients.calcium_mg !== undefined) {
    vitaminScore += Math.min(1, nutrients.calcium_mg / 1000);
    mineralCount++;
  }
  if (nutrients.iron_mg !== undefined) {
    vitaminScore += Math.min(1, nutrients.iron_mg / 18);
    mineralCount++;
  }
  
  const micronutrientScore = mineralCount > 0 ? vitaminScore / mineralCount : 0;
  
  // Combine scores (weighted average)
  return Math.max(0, (fiberScore * 0.3 + calorieScore * 0.2 + proteinScore * 0.3 + micronutrientScore * 0.2));
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
