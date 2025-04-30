import { RecipeIngredient } from '@/types/recipes';

// Mapping between ingredient names and their IDs in the veg_library
const ingredientMap: Record<string, number> = {
  // Proteins
  'Chicken breast': 101,
  'Salmon fillet': 102,
  'Tofu': 103,
  'Eggs': 104,
  'Chickpeas': 105,
  'Black beans': 106,
  'Ground turkey': 107,
  'Ribeye steak': 108,
  'Shrimp': 109,
  'Tuna': 110,
  
  // Vegetables
  'Mixed greens': 201,
  'Kale': 202,
  'Spinach': 203,
  'Broccoli': 204,
  'Cucumber': 205,
  'Cherry tomatoes': 206,
  'Red onion': 207,
  'Avocado': 208,
  'Bell peppers': 209,
  'Asparagus': 210,
  'Carrots': 211,
  'Sweet potato': 212,
  'Garlic': 213,
  'Celery': 214,
  'Mushrooms': 215,
  'Zucchini': 216,
  'Tomatoes': 217,
  'Corn': 218,
  'Peas': 219,
  
  // Grains
  'Quinoa': 301,
  'Brown rice': 302,
  'Oats': 303,
  'Whole grain bread': 304,
  'Pita bread': 305,
  'Whole wheat pasta': 306,
  'Granola': 307,
  'Whole wheat wrap': 308,
  'Arborio rice': 309,
  'Jasmine rice': 310,
  
  // Dairy
  'Feta cheese': 401,
  'Greek yogurt': 402,
  'Almond milk': 403,
  'Milk': 404,
  'Parmesan cheese': 405,
  'Fresh mozzarella': 406,
  'Cottage cheese': 407,
  'Whey protein': 408,
  
  // Fruits
  'Banana': 501,
  'Mixed berries': 502,
  'Lemon': 503,
  'Lime': 504,
  'Mango': 505,
  'Berries': 506,
  
  // Oils & Fats
  'Olive oil': 601,
  'Coconut milk': 602,
  'Tahini': 603,
  'Peanut butter': 604,
  'Almond butter': 605,
  'Sesame oil': 606,
  
  // Other
  'Lemon juice': 701,
  'Balsamic vinegar': 702,
  'Soy sauce': 703,
  'Teriyaki sauce': 704,
  'Hot sauce': 705,
  'Honey': 706,
  'Chia seeds': 707,
  'Pumpkin seeds': 708,
  'Pine nuts': 709,
  'Dark chocolate chips': 710,
  'Maple syrup': 711,
  'Vanilla extract': 712,
  'Cinnamon': 713,
  'Cumin': 714,
  'Chili powder': 715,
  'Salt': 716,
  'Pepper': 717,
  'Dill': 718,
  'Basil': 719,
  'Parsley': 720,
  'Cilantro': 721,
  'Herbs': 722,
  'Ginger': 723,
  'Curry paste': 724,
  'Tomato sauce': 725,
  'Vegetable broth': 726,
  'Chicken broth': 727,
  'White wine': 728,
  'Caesar dressing': 729,
  'Croutons': 730,
  'Hummus': 731,
  'Olives': 732,
  'Basil pesto': 733,
  'Mayo': 734,
  'Mustard': 735,
  'Lettuce': 736,
  'Tomato': 737,
  'Red pepper flakes': 738,
  'Baking powder': 739,
  'Almonds': 740,
  'Nuts': 741,
  'Microgreens': 742,
};

// Convert a string ingredient to a RecipeIngredient object
export function convertStringToRecipeIngredient(ingredient: string): RecipeIngredient | string {
  // Try to find an exact match
  if (ingredientMap[ingredient]) {
    return {
      id: ingredientMap[ingredient],
      amount: 100, // Default amount
      unit: 'g', // Default unit
      name: ingredient
    };
  }
  
  // Try to find a partial match
  for (const [key, id] of Object.entries(ingredientMap)) {
    if (ingredient.includes(key)) {
      // Try to extract amount from the ingredient string
      const amountMatch = ingredient.match(/^([\d.]+)\s*(\w+)?\s/);
      let amount = 100; // Default amount
      let unit: 'g' | 'ml' | 'piece' = 'g'; // Default unit
      
      if (amountMatch) {
        amount = parseFloat(amountMatch[1]);
        
        // Determine unit if present
        if (amountMatch[2]) {
          const extractedUnit = amountMatch[2].toLowerCase();
          if (extractedUnit === 'g' || extractedUnit.includes('gram')) {
            unit = 'g';
          } else if (extractedUnit === 'ml' || extractedUnit.includes('liter') || extractedUnit === 'l') {
            unit = 'ml';
          } else {
            unit = 'piece';
          }
        } else if (ingredient.includes('cup') || ingredient.includes('spoon') || 
                   ingredient.includes('slice') || ingredient.includes('piece')) {
          unit = 'piece';
        }
      }
      
      return {
        id,
        amount,
        unit,
        name: key
      };
    }
  }
  
  // If no match found, return the original string
  return ingredient;
}

// Get the ID from a RecipeIngredient (for both string and object format)
export function getIngredientId(ingredient: RecipeIngredient | string): number | null {
  if (typeof ingredient === 'string') {
    // Try to extract the ID from the string
    const match = Object.entries(ingredientMap).find(([key]) => ingredient.includes(key));
    return match ? match[1] : null;
  }
  
  return ingredient.id;
}

// Get the amount from a RecipeIngredient (for both string and object format)
export function getIngredientAmount(ingredient: RecipeIngredient | string): number {
  if (typeof ingredient === 'string') {
    // Try to extract amount from the string
    const amountMatch = ingredient.match(/^([\d.]+)/);
    return amountMatch ? parseFloat(amountMatch[1]) : 100; // Default to 100 if no amount specified
  }
  
  return ingredient.amount;
}

// Check if an ingredient is a RecipeIngredient object
export function isRecipeIngredient(ingredient: RecipeIngredient | string): ingredient is RecipeIngredient {
  return typeof ingredient !== 'string';
}

// Convert a RecipeIngredient to a display string
export function getIngredientAsString(ingredient: RecipeIngredient | string): string {
  if (typeof ingredient === 'string') {
    return ingredient;
  }
  
  return `${ingredient.amount} ${ingredient.unit} ${ingredient.name || ''}`;
}

// Check if an ingredient contains a specific search term
export function ingredientContains(ingredient: RecipeIngredient | string, searchTerm: string): boolean {
  if (typeof ingredient === 'string') {
    return ingredient.toLowerCase().includes(searchTerm.toLowerCase());
  }
  
  return (ingredient.name || '').toLowerCase().includes(searchTerm.toLowerCase());
}
