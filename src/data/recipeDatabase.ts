import { Recipe, FoodItem } from '@/types/recipes';
import { ensureNutrientScore } from '@/lib/recipeEnrichment';
import { loadVegLibrary, convertFoodItemToRecipe } from '@/services/nutritionService';
import { convertStringToRecipeIngredient, isRecipeIngredient } from '@/utils/ingredientUtils';

// Helper function to ensure all recipes have a servings property
function ensureServingsProperty(recipe: any): Recipe {
  return {
    ...recipe,
    // Default to 2 servings if not specified
    servings: recipe.servings || 2
  };
}

// Helper function to convert string ingredients to proper ingredient objects
function convertIngredientsToObjects(ingredients: (string | any)[]): any[] {
  return ingredients.map((ingredient, index) => {
    if (typeof ingredient === 'string') {
      return convertStringToRecipeIngredient(ingredient);
    }
    return ingredient;
  });
}

// Add nutrientScore to all recipes (was missing and causing type errors)
export const recipeData: Recipe[] = [
  // First three recipes already migrated to new format
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    time: '25 mins',
    category: 'Lunch',
    tags: ['Vegan', 'High Protein', 'Mediterranean'],
    saved: true,
    servings: 2,
    ingredients: [
      { id: 301, amount: 150, unit: 'g', name: 'Quinoa' },
      { id: 105, amount: 200, unit: 'g', name: 'Chickpeas' },
      { id: 205, amount: 1, unit: 'piece', name: 'Cucumber' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 401, amount: 50, unit: 'g', name: 'Feta' },
      { id: 601, amount: 15, unit: 'ml', name: 'Olive oil' },
      { id: 701, amount: 15, unit: 'ml', name: 'Lemon juice' }
    ],
    instructions: [
      'Cook quinoa according to package instructions.',
      'Dice cucumber, red onion, and halve cherry tomatoes.',
      'Drain and rinse chickpeas.',
      'Combine all ingredients in a bowl.',
      'Drizzle with olive oil and lemon juice.',
      'Crumble feta cheese on top and serve.'
    ],
    difficulty: 'Easy',
    alternativeIds: ['5', '3'],
    nutrientScore: 0.55,
    calories: 420,
    protein: 18,
    carbs: 62,
    fat: 12,
    fiber: 8
  },
  {
    id: '2',
    title: 'Avocado & Kale Smoothie',
    image: 'https://images.unsplash.com/photo-1504310578167-435ac09e69f3',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Vegan', 'Quick', 'Superfood'],
    saved: false,
    servings: 1,
    ingredients: [
      { id: 202, amount: 50, unit: 'g', name: 'Kale' },
      { id: 208, amount: 0.5, unit: 'piece', name: 'Avocado' },
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 403, amount: 250, unit: 'ml', name: 'Almond milk' },
      { id: 707, amount: 10, unit: 'g', name: 'Chia seeds' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' }
    ],
    instructions: [
      'Wash and roughly chop the kale, removing tough stems.',
      'Add all ingredients to a blender.',
      'Blend until smooth, adding more almond milk if needed for desired consistency.',
      'Pour into a glass and serve immediately.'
    ],
    difficulty: 'Easy',
    alternativeIds: ['8', '10'],
    nutrientScore: 0.48,
    calories: 310,
    protein: 8,
    carbs: 34,
    fat: 16,
    fiber: 6
  },
  {
    id: '3',
    title: 'Grilled Chicken Salad',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    time: '20 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Low Carb'],
    saved: true,
    servings: 2,
    ingredients: [
      { id: 101, amount: 200, unit: 'g', name: 'Chicken breast' },
      { id: 201, amount: 100, unit: 'g', name: 'Mixed greens' },
      { id: 205, amount: 1, unit: 'piece', name: 'Cucumber' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 401, amount: 30, unit: 'g', name: 'Feta cheese' },
      { id: 601, amount: 15, unit: 'ml', name: 'Olive oil' },
      { id: 702, amount: 10, unit: 'ml', name: 'Balsamic vinegar' }
    ],
    instructions: [
      'Season chicken breast with salt and pepper.',
      'Grill chicken for 6-7 minutes on each side until cooked through.',
      'Let chicken rest for 5 minutes, then slice.',
      'In a large bowl, combine mixed greens, diced cucumber, halved cherry tomatoes, and sliced red onion.',
      'Top with grilled chicken slices and crumbled feta cheese.',
      'Drizzle with olive oil and balsamic vinegar.',
      'Toss gently and serve.'
    ],
    difficulty: 'Medium',
    alternativeIds: ['1', '9'],
    nutrientScore: 0.52,
    calories: 380,
    protein: 32,
    carbs: 12,
    fat: 18,
    fiber: 4
  },
  // Convert all remaining recipes to have proper ingredient objects
  {
    id: '4',
    title: 'Baked Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    time: '30 mins',
    category: 'Dinner',
    tags: ['Omega-3', 'High Protein'],
    saved: false,
    servings: 2,
    calories: 450,
    protein: 36,
    carbs: 8,
    fat: 28,
    fiber: 4,
    ingredients: [
      { id: 301, amount: 200, unit: 'g', name: 'Salmon fillet' },
      { id: 302, amount: 300, unit: 'g', name: 'Asparagus' },
      { id: 303, amount: 1, unit: 'piece', name: 'Lemon' },
      { id: 601, amount: 20, unit: 'ml', name: 'Olive oil' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 305, amount: 5, unit: 'g', name: 'Fresh dill' },
      { id: 306, amount: 2, unit: 'g', name: 'Salt' },
      { id: 307, amount: 1, unit: 'g', name: 'Black pepper' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['7', '11'],
    nutrientScore: 0.50
  },
  {
    id: '5',
    title: 'Buddha Bowl with Sweet Potato',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    time: '35 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'Meal Prep', 'Fiber Rich'],
    saved: false,
    servings: 2,
    calories: 510,
    protein: 15,
    carbs: 78,
    fat: 16,
    fiber: 12,
    ingredients: [
      { id: 308, amount: 200, unit: 'g', name: 'Sweet potato' },
      { id: 301, amount: 100, unit: 'g', name: 'Quinoa' },
      { id: 105, amount: 150, unit: 'g', name: 'Chickpeas' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 202, amount: 50, unit: 'g', name: 'Spinach' },
      { id: 309, amount: 30, unit: 'ml', name: 'Tahini' },
      { id: 701, amount: 15, unit: 'ml', name: 'Lemon juice' },
      { id: 310, amount: 20, unit: 'g', name: 'Pumpkin seeds' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['1', '10'],
    nutrientScore: 0.54
  },
  {
    id: '6',
    title: 'Spicy Black Bean Bowl',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6',
    time: '20 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Spicy'],
    saved: false,
    servings: 2,
    calories: 380,
    protein: 15,
    carbs: 65,
    fat: 8,
    fiber: 12,
    ingredients: [
      { id: 311, amount: 150, unit: 'g', name: 'Black beans' },
      { id: 312, amount: 150, unit: 'g', name: 'Brown rice' },
      { id: 313, amount: 100, unit: 'g', name: 'Corn' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 314, amount: 1, unit: 'piece', name: 'Lime' },
      { id: 315, amount: 10, unit: 'g', name: 'Cilantro' },
      { id: 316, amount: 5, unit: 'ml', name: 'Hot sauce' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['1', '5'],
    nutrientScore: 0.49
  },
  {
    id: '7',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Low Fat'],
    saved: false,
    servings: 1,
    calories: 280,
    protein: 24,
    carbs: 35,
    fat: 5,
    fiber: 8,
    ingredients: [
      { id: 317, amount: 30, unit: 'g', name: 'Whey protein' },
      { id: 318, amount: 100, unit: 'g', name: 'Mixed berries' },
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 319, amount: 100, unit: 'g', name: 'Greek yogurt' },
      { id: 403, amount: 200, unit: 'ml', name: 'Almond milk' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['2', '12'],
    nutrientScore: 0.47
  },
  {
    id: '8',
    title: 'Teriyaki Chicken Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Asian', 'High Protein', 'Meal Prep'],
    saved: false,
    servings: 2,
    calories: 420,
    protein: 35,
    carbs: 45,
    fat: 12,
    fiber: 6,
    ingredients: [
      { id: 101, amount: 200, unit: 'g', name: 'Chicken breast' },
      { id: 320, amount: 150, unit: 'g', name: 'Broccoli' },
      { id: 321, amount: 100, unit: 'g', name: 'Carrots' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell peppers' },
      { id: 323, amount: 50, unit: 'ml', name: 'Teriyaki sauce' },
      { id: 312, amount: 150, unit: 'g', name: 'Brown rice' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['4', '15'],
    nutrientScore: 0.51
  },
  {
    id: '9',
    title: 'Mediterranean Hummus Platter',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    time: '15 mins',
    category: 'Snack',
    tags: ['Mediterranean', 'Vegetarian', 'Party'],
    saved: false,
    servings: 2,
    calories: 350,
    protein: 12,
    carbs: 42,
    fat: 18,
    fiber: 10,
    ingredients: [
      { id: 324, amount: 150, unit: 'g', name: 'Hummus' },
      { id: 325, amount: 2, unit: 'piece', name: 'Pita bread' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 205, amount: 1, unit: 'piece', name: 'Cucumber' },
      { id: 326, amount: 50, unit: 'g', name: 'Olives' },
      { id: 401, amount: 50, unit: 'g', name: 'Feta cheese' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['3', '6'],
    nutrientScore: 0.46
  },
  {
    id: '10',
    title: 'Grilled Steak with Sweet Potato',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    time: '35 mins',
    category: 'Dinner',
    tags: ['High Protein', 'Gluten Free', 'Paleo'],
    saved: false,
    servings: 2,
    calories: 520,
    protein: 42,
    carbs: 38,
    fat: 22,
    fiber: 6,
    ingredients: [
      { id: 327, amount: 250, unit: 'g', name: 'Ribeye steak' },
      { id: 308, amount: 200, unit: 'g', name: 'Sweet potato' },
      { id: 302, amount: 150, unit: 'g', name: 'Asparagus' },
      { id: 601, amount: 20, unit: 'ml', name: 'Olive oil' },
      { id: 304, amount: 3, unit: 'piece', name: 'Garlic cloves' },
      { id: 328, amount: 5, unit: 'g', name: 'Herbs' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['4', '8'],
    nutrientScore: 0.53
  },
  {
    id: '11',
    title: 'Peanut Butter Energy Balls',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    time: '15 mins',
    category: 'Snack',
    tags: ['No Bake', 'High Protein', 'Vegan'],
    saved: false,
    servings: 12,
    calories: 180,
    protein: 8,
    carbs: 22,
    fat: 10,
    fiber: 4,
    ingredients: [
      { id: 329, amount: 100, unit: 'g', name: 'Oats' },
      { id: 330, amount: 100, unit: 'g', name: 'Peanut butter' },
      { id: 706, amount: 30, unit: 'ml', name: 'Honey' },
      { id: 707, amount: 20, unit: 'g', name: 'Chia seeds' },
      { id: 331, amount: 50, unit: 'g', name: 'Dark chocolate chips' }
    ],
    difficulty: 'Easy',
    nutrientScore: 0.45
  },
  {
    id: '12',
    title: 'Spinach and Feta Omelette',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71',
    time: '10 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Low Carb', 'Vegetarian'],
    saved: false,
    servings: 1,
    calories: 320,
    protein: 22,
    carbs: 4,
    fat: 24,
    fiber: 2,
    ingredients: [
      { id: 332, amount: 3, unit: 'piece', name: 'Eggs' },
      { id: 202, amount: 50, unit: 'g', name: 'Spinach' },
      { id: 401, amount: 40, unit: 'g', name: 'Feta cheese' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 601, amount: 10, unit: 'ml', name: 'Olive oil' },
      { id: 306, amount: 1, unit: 'g', name: 'Salt' },
      { id: 307, amount: 1, unit: 'g', name: 'Pepper' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['7', '2'],
    nutrientScore: 0.44
  },
  {
    id: '13',
    title: 'Lentil Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '40 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Comfort Food'],
    saved: false,
    servings: 4,
    calories: 280,
    protein: 16,
    carbs: 48,
    fat: 4,
    fiber: 14,
    ingredients: [
      { id: 333, amount: 200, unit: 'g', name: 'Lentils' },
      { id: 321, amount: 100, unit: 'g', name: 'Carrots' },
      { id: 334, amount: 100, unit: 'g', name: 'Celery' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 336, amount: 1000, unit: 'ml', name: 'Vegetable broth' },
      { id: 337, amount: 150, unit: 'g', name: 'Tomatoes' },
      { id: 338, amount: 5, unit: 'g', name: 'Cumin' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['6', '1'],
    nutrientScore: 0.43
  },
  {
    id: '14',
    title: 'Coconut Curry Chicken',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    time: '35 mins',
    category: 'Dinner',
    tags: ['Asian', 'Spicy', 'Comfort Food'],
    saved: false,
    servings: 2,
    calories: 450,
    protein: 32,
    carbs: 28,
    fat: 24,
    fiber: 6,
    ingredients: [
      { id: 339, amount: 200, unit: 'g', name: 'Chicken thighs' },
      { id: 340, amount: 400, unit: 'ml', name: 'Coconut milk' },
      { id: 341, amount: 50, unit: 'g', name: 'Curry paste' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell peppers' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 342, amount: 10, unit: 'g', name: 'Ginger' },
      { id: 343, amount: 150, unit: 'g', name: 'Rice' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['8', '4'],
    nutrientScore: 0.42
  },
  {
    id: '15',
    title: 'Beef and Broccoli Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Asian', 'High Protein', 'Quick'],
    saved: false,
    servings: 2,
    calories: 380,
    protein: 30,
    carbs: 25,
    fat: 18,
    fiber: 5,
    ingredients: [
      { id: 344, amount: 200, unit: 'g', name: 'Beef sirloin' },
      { id: 320, amount: 150, unit: 'g', name: 'Broccoli' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 342, amount: 10, unit: 'g', name: 'Ginger' },
      { id: 345, amount: 30, unit: 'ml', name: 'Soy sauce' },
      { id: 346, amount: 10, unit: 'ml', name: 'Sesame oil' },
      { id: 312, amount: 150, unit: 'g', name: 'Brown rice' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['8', '10'],
    nutrientScore: 0.41
  },
  {
    id: '16',
    title: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'No Cook'],
    saved: false,
    servings: 1,
    calories: 290,
    protein: 18,
    carbs: 40,
    fat: 8,
    fiber: 5,
    ingredients: [
      { id: 319, amount: 150, unit: 'g', name: 'Greek yogurt' },
      { id: 347, amount: 50, unit: 'g', name: 'Granola' },
      { id: 318, amount: 100, unit: 'g', name: 'Mixed berries' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' },
      { id: 707, amount: 20, unit: 'g', name: 'Chia seeds' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['2', '7'],
    nutrientScore: 0.40
  },
  {
    id: '17',
    title: 'Stuffed Bell Peppers',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8',
    time: '45 mins',
    category: 'Dinner',
    tags: ['Gluten Free', 'Meal Prep', 'High Protein'],
    saved: false,
    servings: 4,
    calories: 340,
    protein: 24,
    carbs: 38,
    fat: 12,
    fiber: 8,
    ingredients: [
      { id: 322, amount: 4, unit: 'piece', name: 'Bell peppers' },
      { id: 348, amount: 200, unit: 'g', name: 'Ground turkey' },
      { id: 312, amount: 150, unit: 'g', name: 'Brown rice' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 349, amount: 150, unit: 'ml', name: 'Tomato sauce' },
      { id: 350, amount: 50, unit: 'g', name: 'Cheese' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['14', '15'],
    nutrientScore: 0.39
  },
  {
    id: '18',
    title: 'Chickpea Salad Sandwich',
    image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304',
    time: '10 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Quick'],
    saved: false,
    servings: 2,
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 12,
    fiber: 10,
    ingredients: [
      { id: 105, amount: 200, unit: 'g', name: 'Chickpeas' },
      { id: 334, amount: 50, unit: 'g', name: 'Celery' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 351, amount: 30, unit: 'g', name: 'Mayo' },
      { id: 352, amount: 10, unit: 'g', name: 'Mustard' },
      { id: 353, amount: 4, unit: 'slice', name: 'Whole grain bread' },
      { id: 354, amount: 20, unit: 'g', name: 'Lettuce' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['3', '9'],
    nutrientScore: 0.38
  },
  {
    id: '19',
    title: 'Banana Oatmeal Pancakes',
    image: 'https://images.unsplash.com/photo-1575853121743-60c24dbe7ad6',
    time: '15 mins',
    category: 'Breakfast',
    tags: ['Whole Grain', 'Kid Friendly', 'Low Fat'],
    saved: false,
    servings: 2,
    calories: 320,
    protein: 10,
    carbs: 62,
    fat: 6,
    fiber: 8,
    ingredients: [
      { id: 329, amount: 100, unit: 'g', name: 'Oats' },
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 332, amount: 2, unit: 'piece', name: 'Eggs' },
      { id: 355, amount: 100, unit: 'ml', name: 'Milk' },
      { id: 356, amount: 5, unit: 'g', name: 'Cinnamon' },
      { id: 357, amount: 5, unit: 'ml', name: 'Vanilla extract' },
      { id: 358, amount: 30, unit: 'ml', name: 'Maple syrup' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['16', '2'],
    nutrientScore: 0.37
  },
  {
    id: '20',
    title: 'Shrimp and Avocado Salad',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
    time: '15 mins',
    category: 'Lunch',
    tags: ['Seafood', 'Low Carb', 'High Protein'],
    saved: false,
    servings: 2,
    calories: 310,
    protein: 28,
    carbs: 12,
    fat: 18,
    fiber: 6,
    ingredients: [
      { id: 359, amount: 200, unit: 'g', name: 'Shrimp' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 201, amount: 100, unit: 'g', name: 'Mixed greens' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 205, amount: 1, unit: 'piece', name: 'Cucumber' },
      { id: 314, amount: 1, unit: 'piece', name: 'Lime juice' },
      { id: 601, amount: 15, unit: 'ml', name: 'Olive oil' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['3', '9'],
    nutrientScore: 0.36
  },
  {
    id: '21',
    title: 'Vegetable Frittata',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    time: '25 mins',
    category: 'Breakfast',
    tags: ['Vegetarian', 'High Protein', 'Low Carb'],
    saved: false,
    servings: 4,
    calories: 280,
    protein: 20,
    carbs: 8,
    fat: 18,
    fiber: 3,
    ingredients: [
      { id: 332, amount: 6, unit: 'piece', name: 'Eggs' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell peppers' },
      { id: 202, amount: 50, unit: 'g', name: 'Spinach' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 401, amount: 50, unit: 'g', name: 'Feta cheese' },
      { id: 601, amount: 15, unit: 'ml', name: 'Olive oil' },
      { id: 328, amount: 5, unit: 'g', name: 'Herbs' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['12', '16'],
    nutrientScore: 0.35
  },
  {
    id: '22',
    title: 'Turkey and Avocado Wrap',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
    time: '10 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Quick', 'Meal Prep'],
    saved: false,
    servings: 1,
    calories: 420,
    protein: 28,
    carbs: 38,
    fat: 20,
    fiber: 8,
    ingredients: [
      { id: 360, amount: 150, unit: 'g', name: 'Turkey breast' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 361, amount: 1, unit: 'piece', name: 'Whole wheat wrap' },
      { id: 354, amount: 20, unit: 'g', name: 'Lettuce' },
      { id: 362, amount: 50, unit: 'g', name: 'Tomato' },
      { id: 319, amount: 30, unit: 'g', name: 'Greek yogurt' },
      { id: 352, amount: 10, unit: 'g', name: 'Mustard' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['18', '3'],
    nutrientScore: 0.34
  },
  {
    id: '23',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    time: '40 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'Italian', 'Comfort Food'],
    saved: false,
    servings: 4,
    calories: 480,
    protein: 12,
    carbs: 78,
    fat: 14,
    fiber: 4,
    ingredients: [
      { id: 363, amount: 200, unit: 'g', name: 'Arborio rice' },
      { id: 364, amount: 150, unit: 'g', name: 'Mushrooms' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 365, amount: 100, unit: 'ml', name: 'White wine' },
      { id: 336, amount: 1000, unit: 'ml', name: 'Vegetable broth' },
      { id: 366, amount: 50, unit: 'g', name: 'Parmesan cheese' }
    ],
    difficulty: 'Hard',
    alternativeIds: ['14', '17'],
    nutrientScore: 0.33
  },
  {
    id: '24',
    title: 'Chocolate Protein Mug Cake',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    time: '5 mins',
    category: 'Dessert',
    tags: ['High Protein', 'Quick', 'Low Sugar'],
    saved: false,
    servings: 1,
    calories: 220,
    protein: 24,
    carbs: 18,
    fat: 6,
    fiber: 5,
    ingredients: [
      { id: 317, amount: 30, unit: 'g', name: 'Protein powder' },
      { id: 367, amount: 15, unit: 'g', name: 'Cocoa powder' },
      { id: 368, amount: 30, unit: 'g', name: 'Almond flour' },
      { id: 403, amount: 100, unit: 'ml', name: 'Almond milk' },
      { id: 332, amount: 1, unit: 'piece', name: 'Egg' },
      { id: 369, amount: 5, unit: 'g', name: 'Baking powder' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['11', '7'],
    nutrientScore: 0.32
  },
  {
    id: '25',
    title: 'Caprese Salad',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5',
    time: '10 mins',
    category: 'Appetizer',
    tags: ['Italian', 'Vegetarian', 'No Cook'],
    saved: false,
    servings: 2,
    calories: 280,
    protein: 14,
    carbs: 8,
    fat: 22,
    fiber: 2,
    ingredients: [
      { id: 370, amount: 150, unit: 'g', name: 'Tomatoes' },
      { id: 371, amount: 100, unit: 'g', name: 'Fresh mozzarella' },
      { id: 372, amount: 10, unit: 'g', name: 'Basil' },
      { id: 373, amount: 20, unit: 'ml', name: 'Balsamic glaze' },
      { id: 601, amount: 15, unit: 'ml', name: 'Olive oil' },
      { id: 306, amount: 1, unit: 'g', name: 'Salt' },
      { id: 307, amount: 1, unit: 'g', name: 'Pepper' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['9', '20'],
    nutrientScore: 0.31
  },
  {
    id: '26',
    title: 'Pesto Zucchini Noodles',
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77',
    time: '15 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Vegetarian', 'Quick'],
    saved: false,
    servings: 2,
    calories: 260,
    protein: 8,
    carbs: 12,
    fat: 20,
    fiber: 4,
    ingredients: [
      { id: 374, amount: 200, unit: 'g', name: 'Zucchini' },
      { id: 375, amount: 50, unit: 'g', name: 'Basil pesto' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 310, amount: 20, unit: 'g', name: 'Pine nuts' },
      { id: 366, amount: 30, unit: 'g', name: 'Parmesan cheese' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['23', '17'],
    nutrientScore: 0.30
  },
  {
    id: '27',
    title: 'Tuna Salad Stuffed Avocado',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    time: '10 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Low Carb', 'Omega-3'],
    saved: false,
    servings: 2,
    calories: 320,
    protein: 28,
    carbs: 10,
    fat: 22,
    fiber: 8,
    ingredients: [
      { id: 376, amount: 150, unit: 'g', name: 'Tuna' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 319, amount: 50, unit: 'g', name: 'Greek yogurt' },
      { id: 334, amount: 30, unit: 'g', name: 'Celery' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 701, amount: 15, unit: 'ml', name: 'Lemon juice' },
      { id: 305, amount: 5, unit: 'g', name: 'Dill' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['20', '3'],
    nutrientScore: 0.29
  },
  {
    id: '28',
    title: 'Sweet Potato and Black Bean Chili',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '45 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'High Fiber', 'Meal Prep'],
    saved: false,
    servings: 4,
    calories: 380,
    protein: 14,
    carbs: 68,
    fat: 6,
    fiber: 16,
    ingredients: [
      { id: 308, amount: 200, unit: 'g', name: 'Sweet potato' },
      { id: 311, amount: 150, unit: 'g', name: 'Black beans' },
      { id: 337, amount: 150, unit: 'g', name: 'Tomatoes' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell pepper' },
      { id: 338, amount: 10, unit: 'g', name: 'Chili powder' },
      { id: 338, amount: 5, unit: 'g', name: 'Cumin' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['13', '6'],
    nutrientScore: 0.28
  },
  {
    id: '29',
    title: 'Almond Butter Toast with Banana',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Quick', 'Vegetarian', 'Kid Friendly'],
    saved: false,
    servings: 1,
    calories: 340,
    protein: 10,
    carbs: 42,
    fat: 16,
    fiber: 6,
    ingredients: [
      { id: 353, amount: 2, unit: 'slice', name: 'Whole grain bread' },
      { id: 377, amount: 30, unit: 'g', name: 'Almond butter' },
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 356, amount: 5, unit: 'g', name: 'Cinnamon' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['19', '16'],
    nutrientScore: 0.27
  },
  {
    id: '30',
    title: 'Roasted Vegetable Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    time: '35 mins',
    category: 'Lunch',
    tags: ['Vegan', 'Gluten Free', 'Meal Prep'],
    saved: false,
    servings: 2,
    calories: 420,
    protein: 12,
    carbs: 72,
    fat: 14,
    fiber: 12,
    ingredients: [
      { id: 301, amount: 150, unit: 'g', name: 'Quinoa' },
      { id: 308, amount: 150, unit: 'g', name: 'Sweet potato' },
      { id: 320, amount: 100, unit: 'g', name: 'Broccoli' },
      { id: 105, amount: 150, unit: 'g', name: 'Chickpeas' },
      { id: 207, amount: 0.5, unit: 'piece', name: 'Red onion' },
      { id: 309, amount: 30, unit: 'ml', name: 'Tahini' },
      { id: 701, amount: 15, unit: 'ml', name: 'Lemon juice' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['1', '5'],
    nutrientScore: 0.26
  },
  {
    id: '31',
    title: 'Chicken and Vegetable Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '50 mins',
    category: 'Dinner',
    tags: ['Comfort Food', 'High Protein', 'Meal Prep'],
    saved: false,
    servings: 4,
    calories: 280,
    protein: 24,
    carbs: 28,
    fat: 8,
    fiber: 6,
    ingredients: [
      { id: 101, amount: 200, unit: 'g', name: 'Chicken breast' },
      { id: 321, amount: 100, unit: 'g', name: 'Carrots' },
      { id: 334, amount: 100, unit: 'g', name: 'Celery' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 378, amount: 1000, unit: 'ml', name: 'Chicken broth' },
      { id: 328, amount: 5, unit: 'g', name: 'Herbs' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['13', '14'],
    nutrientScore: 0.25
  },
  {
    id: '32',
    title: 'Cottage Cheese with Berries',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    time: '5 mins',
    category: 'Snack',
    tags: ['High Protein', 'Low Carb', 'No Cook'],
    saved: false,
    servings: 1,
    calories: 180,
    protein: 24,
    carbs: 14,
    fat: 4,
    fiber: 3,
    ingredients: [
      { id: 379, amount: 150, unit: 'g', name: 'Cottage cheese' },
      { id: 318, amount: 100, unit: 'g', name: 'Mixed berries' },
      { id: 706, amount: 10, unit: 'ml', name: 'Honey' },
      { id: 356, amount: 5, unit: 'g', name: 'Cinnamon' },
      { id: 380, amount: 20, unit: 'g', name: 'Almonds' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['16', '11'],
    nutrientScore: 0.24
  },
  {
    id: '33',
    title: 'Tofu Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'High Protein', 'Asian'],
    saved: false,
    servings: 2,
    calories: 320,
    protein: 18,
    carbs: 32,
    fat: 16,
    fiber: 8,
    ingredients: [
      { id: 381, amount: 200, unit: 'g', name: 'Tofu' },
      { id: 320, amount: 150, unit: 'g', name: 'Broccoli' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell peppers' },
      { id: 321, amount: 100, unit: 'g', name: 'Carrots' },
      { id: 345, amount: 30, unit: 'ml', name: 'Soy sauce' },
      { id: 342, amount: 10, unit: 'g', name: 'Ginger' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['8', '15'],
    nutrientScore: 0.23
  },
  {
    id: '34',
    title: 'Overnight Oats',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    time: '5 mins + overnight',
    category: 'Breakfast',
    tags: ['Meal Prep', 'No Cook', 'High Fiber'],
    saved: false,
    servings: 1,
    calories: 340,
    protein: 14,
    carbs: 58,
    fat: 8,
    fiber: 10,
    ingredients: [
      { id: 329, amount: 100, unit: 'g', name: 'Rolled oats' },
      { id: 355, amount: 150, unit: 'ml', name: 'Milk' },
      { id: 319, amount: 50, unit: 'g', name: 'Greek yogurt' },
      { id: 707, amount: 20, unit: 'g', name: 'Chia seeds' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' },
      { id: 318, amount: 100, unit: 'g', name: 'Berries' },
      { id: 380, amount: 20, unit: 'g', name: 'Nuts' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['19', '29'],
    nutrientScore: 0.22
  },
  {
    id: '35',
    title: 'Cauliflower Fried Rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Vegetarian', 'Asian'],
    saved: false,
    servings: 2,
    calories: 240,
    protein: 10,
    carbs: 18,
    fat: 14,
    fiber: 6,
    ingredients: [
      { id: 382, amount: 200, unit: 'g', name: 'Cauliflower' },
      { id: 332, amount: 2, unit: 'piece', name: 'Eggs' },
      { id: 321, amount: 100, unit: 'g', name: 'Carrots' },
      { id: 383, amount: 50, unit: 'g', name: 'Peas' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 342, amount: 10, unit: 'g', name: 'Ginger' },
      { id: 345, amount: 30, unit: 'ml', name: 'Soy sauce' },
      { id: 346, amount: 10, unit: 'ml', name: 'Sesame oil' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['33', '8'],
    nutrientScore: 0.21
  },
  {
    id: '36',
    title: 'Turkey and Sweet Potato Chili',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '45 mins',
    category: 'Dinner',
    tags: ['High Protein', 'Comfort Food', 'Meal Prep'],
    saved: false,
    servings: 4,
    calories: 380,
    protein: 32,
    carbs: 42,
    fat: 10,
    fiber: 10,
    ingredients: [
      { id: 348, amount: 200, unit: 'g', name: 'Ground turkey' },
      { id: 308, amount: 200, unit: 'g', name: 'Sweet potato' },
      { id: 384, amount: 150, unit: 'g', name: 'Kidney beans' },
      { id: 337, amount: 150, unit: 'g', name: 'Tomatoes' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell pepper' },
      { id: 338, amount: 10, unit: 'g', name: 'Chili powder' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['28', '31'],
    nutrientScore: 0.20
  },
  {
    id: '37',
    title: 'Mango and Spinach Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Vegan', 'Quick', 'Vitamin Rich'],
    saved: false,
    servings: 1,
    calories: 220,
    protein: 6,
    carbs: 48,
    fat: 4,
    fiber: 6,
    ingredients: [
      { id: 385, amount: 150, unit: 'g', name: 'Mango' },
      { id: 202, amount: 50, unit: 'g', name: 'Spinach' },
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 403, amount: 200, unit: 'ml', name: 'Almond milk' },
      { id: 707, amount: 20, unit: 'g', name: 'Chia seeds' },
      { id: 314, amount: 1, unit: 'piece', name: 'Lime juice' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['2', '7'],
    nutrientScore: 0.19
  },
  {
    id: '38',
    title: 'Baked Falafel Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    time: '40 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'Mediterranean', 'High Fiber'],
    saved: false,
    servings: 2,
    calories: 420,
    protein: 16,
    carbs: 62,
    fat: 14,
    fiber: 14,
    ingredients: [
      { id: 105, amount: 200, unit: 'g', name: 'Chickpeas' },
      { id: 386, amount: 20, unit: 'g', name: 'Parsley' },
      { id: 315, amount: 20, unit: 'g', name: 'Cilantro' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 338, amount: 5, unit: 'g', name: 'Cumin' },
      { id: 309, amount: 30, unit: 'ml', name: 'Tahini' },
      { id: 205, amount: 1, unit: 'piece', name: 'Cucumber' },
      { id: 337, amount: 150, unit: 'g', name: 'Tomato' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['1', '9'],
    nutrientScore: 0.18
  },
  {
    id: '39',
    title: 'Egg and Avocado Toast',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    time: '10 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Vegetarian'],
    saved: false,
    servings: 1,
    calories: 340,
    protein: 16,
    carbs: 28,
    fat: 18,
    fiber: 6,
    ingredients: [
      { id: 353, amount: 2, unit: 'slice', name: 'Whole grain bread' },
      { id: 332, amount: 2, unit: 'piece', name: 'Eggs' },
      { id: 208, amount: 1, unit: 'piece', name: 'Avocado' },
      { id: 206, amount: 100, unit: 'g', name: 'Cherry tomatoes' },
      { id: 387, amount: 10, unit: 'g', name: 'Microgreens' },
      { id: 306, amount: 1, unit: 'g', name: 'Salt' },
      { id: 307, amount: 1, unit: 'g', name: 'Pepper' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['29', '12'],
    nutrientScore: 0.17
  },
  {
    id: '40',
    title: 'Lemon Garlic Shrimp Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Seafood', 'Italian', 'Quick'],
    saved: false,
    servings: 2,
    calories: 480,
    protein: 28,
    carbs: 62,
    fat: 14,
    fiber: 4,
    ingredients: [
      { id: 359, amount: 200, unit: 'g', name: 'Shrimp' },
      { id: 388, amount: 150, unit: 'g', name: 'Whole wheat pasta' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 303, amount: 1, unit: 'piece', name: 'Lemon' },
      { id: 601, amount: 20, unit: 'ml', name: 'Olive oil' },
      { id: 389, amount: 10, unit: 'g', name: 'Parsley' },
      { id: 390, amount: 1, unit: 'g', name: 'Red pepper flakes' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['20', '23'],
    nutrientScore: 0.16
  },
  {
    id: '41',
    title: 'Peanut Butter Banana Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Kid Friendly'],
    saved: false,
    servings: 1,
    calories: 380,
    protein: 18,
    carbs: 52,
    fat: 14,
    fiber: 6,
    ingredients: [
      { id: 501, amount: 1, unit: 'piece', name: 'Banana' },
      { id: 330, amount: 30, unit: 'g', name: 'Peanut butter' },
      { id: 319, amount: 100, unit: 'g', name: 'Greek yogurt' },
      { id: 355, amount: 150, unit: 'ml', name: 'Milk' },
      { id: 706, amount: 15, unit: 'ml', name: 'Honey' },
      { id: 391, amount: 100, unit: 'g', name: 'Ice' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['7', '37'],
    nutrientScore: 0.15
  },
  {
    id: '42',
    title: 'Roasted Brussels Sprouts with Bacon',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f',
    time: '25 mins',
    category: 'Side Dish',
    tags: ['Low Carb', 'Gluten Free', 'Keto'],
    saved: false,
    servings: 2,
    calories: 220,
    protein: 10,
    carbs: 12,
    fat: 16,
    fiber: 6,
    ingredients: [
      { id: 392, amount: 200, unit: 'g', name: 'Brussels sprouts' },
      { id: 393, amount: 100, unit: 'g', name: 'Bacon' },
      { id: 601, amount: 20, unit: 'ml', name: 'Olive oil' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 373, amount: 20, unit: 'ml', name: 'Balsamic vinegar' },
      { id: 306, amount: 1, unit: 'g', name: 'Salt' },
      { id: 307, amount: 1, unit: 'g', name: 'Pepper' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['26', '35'],
    nutrientScore: 0.14
  },
  {
    id: '43',
    title: 'Chicken Caesar Wrap',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
    time: '15 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Quick', 'Meal Prep'],
    saved: false,
    servings: 1,
    calories: 420,
    protein: 32,
    carbs: 38,
    fat: 18,
    fiber: 4,
    ingredients: [
      { id: 101, amount: 150, unit: 'g', name: 'Chicken breast' },
      { id: 361, amount: 1, unit: 'piece', name: 'Whole wheat wrap' },
      { id: 354, amount: 20, unit: 'g', name: 'Romaine lettuce' },
      { id: 366, amount: 30, unit: 'g', name: 'Parmesan cheese' },
      { id: 394, amount: 30, unit: 'ml', name: 'Caesar dressing' },
      { id: 395, amount: 20, unit: 'g', name: 'Croutons' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['22', '3'],
    nutrientScore: 0.13
  },
  {
    id: '44',
    title: 'Vegetable Curry with Coconut Rice',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    time: '40 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'Spicy', 'Asian'],
    saved: false,
    servings: 4,
    calories: 460,
    protein: 12,
    carbs: 78,
    fat: 14,
    fiber: 10,
    ingredients: [
      { id: 320, amount: 150, unit: 'g', name: 'Mixed vegetables' },
      { id: 340, amount: 400, unit: 'ml', name: 'Coconut milk' },
      { id: 341, amount: 50, unit: 'g', name: 'Curry paste' },
      { id: 396, amount: 150, unit: 'g', name: 'Jasmine rice' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 342, amount: 10, unit: 'g', name: 'Ginger' },
      { id: 315, amount: 20, unit: 'g', name: 'Cilantro' }
    ],
    difficulty: 'Medium',
    alternativeIds: ['14', '33'],
    nutrientScore: 0.12
  },
  {
    id: '45',
    title: 'Cauliflower Rice Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Keto', 'Vegetarian'],
    saved: false,
    servings: 2,
    calories: 250,
    protein: 12,
    carbs: 15,
    fat: 18,
    fiber: 8,
    ingredients: [
      { id: 382, amount: 200, unit: 'g', name: 'Cauliflower' },
      { id: 322, amount: 100, unit: 'g', name: 'Bell peppers' },
      { id: 335, amount: 1, unit: 'piece', name: 'Onion' },
      { id: 304, amount: 2, unit: 'piece', name: 'Garlic cloves' },
      { id: 345, amount: 30, unit: 'ml', name: 'Soy sauce' },
      { id: 346, amount: 10, unit: 'ml', name: 'Sesame oil' }
    ],
    difficulty: 'Easy',
    alternativeIds: ['8', '10'],
    nutrientScore: 0.11
  }
].map(recipe => ({
  ...ensureServingsProperty(recipe),
  ingredients: convertIngredientsToObjects(recipe.ingredients || [])
})); // Make sure all recipes have servings and proper ingredient objects

// Function to find recipe by ID
export const findRecipeById = (id: string): Recipe | undefined => {
  return recipeData.find(recipe => recipe.id === id);
};

// Function to get alternative recipes
export const getAlternativeRecipes = (recipeId: string): Recipe[] => {
  const recipe = findRecipeById(recipeId);
  if (!recipe?.alternativeIds) return [];
  return recipe.alternativeIds
    .map(id => findRecipeById(id))
    .filter((recipe): recipe is Recipe => recipe !== undefined);
};

// Keep a cache of all recipes (original + food library)
let allRecipesCache: Recipe[] | null = null;

/**
 * Gets all recipes including those converted from the food library
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  // Return cached data if available
  if (allRecipesCache) {
    return allRecipesCache;
  }
  
  try {
    // Load veg library and convert items to recipes
    const vegLibrary = await loadVegLibrary();
    const vegRecipes = vegLibrary.map(item => convertFoodItemToRecipe(item));
    
    // Combine with existing recipes
    const combinedRecipes = [...recipeData, ...vegRecipes];
    
    // Ensure all recipes have nutrient scores
    const enrichedRecipes = ensureNutrientScore(combinedRecipes);
    
    // Cache the results
    allRecipesCache = enrichedRecipes;
    return enrichedRecipes;
  } catch (error) {
    console.error('Error loading all recipes:', error);
    // If there's an error loading the veg library, just return the original recipes
    return ensureNutrientScore(recipeData);
  }
}

/**
 * Finds a recipe by ID from both static and dynamic sources
 */
export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  // Check static recipes first (faster)
  const staticRecipe = recipeData.find(recipe => recipe.id === id);
  if (staticRecipe) {
    return staticRecipe;
  }
  
  // Check if it's a food-converted recipe
  if (id.startsWith('food-')) {
    const foodId = parseInt(id.replace('food-', ''), 10);
    if (!isNaN(foodId)) {
      const allRecipes = await getAllRecipes();
      return allRecipes.find(recipe => recipe.id === id);
    }
  }
  
  return undefined;
}

/**
 * Helper function to migrate string ingredients to RecipeIngredient objects
 * This is a temporary function to assist with migration
 */
export function migrateRecipeIngredients(recipe: Recipe): Recipe {
  // Skip if already migrated
  if (recipe.ingredients.every(ing => isRecipeIngredient(ing))) {
    return recipe;
  }
  
  const migratedIngredients = recipe.ingredients.map(ingredient => {
    if (typeof ingredient === 'string') {
      return convertStringToRecipeIngredient(ingredient);
    }
    return ingredient;
  });
  
  return {
    ...recipe,
    ingredients: migratedIngredients,
    // Add default servings if not present
    servings: recipe.servings || 2
  };
}

/**
 * Migrate all recipes to use RecipeIngredient objects
 */
export function migrateAllRecipes(): Recipe[] {
  return recipeData.map(migrateRecipeIngredients);
}
