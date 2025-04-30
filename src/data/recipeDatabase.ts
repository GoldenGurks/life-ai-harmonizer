import { Recipe, FoodItem } from '@/types/recipes';
import { ensureNutrientScore } from '@/lib/recipeEnrichment';
import { loadVegLibrary, convertFoodItemToRecipe } from '@/services/nutritionService';
import { convertStringToRecipeIngredient } from '@/utils/ingredientUtils';

// Helper function to ensure all recipes have a servings property
function ensureServingsProperty(recipe: any): Recipe {
  return {
    ...recipe,
    // Default to 2 servings if not specified
    servings: recipe.servings || 2
  };
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
  // For all remaining recipes, ensure they have servings property
  ensureServingsProperty({
    id: '4',
    title: 'Baked Salmon with Asparagus',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    time: '30 mins',
    category: 'Dinner',
    tags: ['Omega-3', 'High Protein'],
    saved: false,
    calories: 450,
    protein: 36,
    carbs: 8,
    fat: 28,
    fiber: 4,
    ingredients: ['Salmon fillet', 'Asparagus', 'Lemon', 'Olive oil', 'Garlic', 'Dill', 'Salt', 'Pepper'],
    difficulty: 'Medium',
    alternativeIds: ['7', '11'],
    nutrientScore: 0.50
  }),
  ensureServingsProperty({
    id: '5',
    title: 'Buddha Bowl with Sweet Potato',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    time: '35 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'Meal Prep', 'Fiber Rich'],
    saved: false,
    calories: 510,
    protein: 15,
    carbs: 78,
    fat: 16,
    fiber: 12,
    ingredients: ['Sweet potato', 'Quinoa', 'Chickpeas', 'Avocado', 'Spinach', 'Tahini', 'Lemon juice', 'Pumpkin seeds'],
    difficulty: 'Medium',
    alternativeIds: ['1', '10'],
    nutrientScore: 0.54
  }),
  ensureServingsProperty({
    id: '6',
    title: 'Spicy Black Bean Bowl',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6',
    time: '20 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Spicy'],
    saved: false,
    calories: 380,
    protein: 15,
    carbs: 65,
    fat: 8,
    fiber: 12,
    ingredients: ['Black beans', 'Brown rice', 'Corn', 'Red onion', 'Avocado', 'Lime', 'Cilantro', 'Hot sauce'],
    difficulty: 'Easy',
    alternativeIds: ['1', '5'],
    nutrientScore: 0.49
  }),
  ensureServingsProperty({
    id: '7',
    title: 'Berry Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Low Fat'],
    saved: false,
    calories: 280,
    protein: 24,
    carbs: 35,
    fat: 5,
    fiber: 8,
    ingredients: ['Whey protein', 'Mixed berries', 'Banana', 'Greek yogurt', 'Almond milk', 'Honey'],
    difficulty: 'Easy',
    alternativeIds: ['2', '12'],
    nutrientScore: 0.47
  }),
  ensureServingsProperty({
    id: '8',
    title: 'Teriyaki Chicken Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Asian', 'High Protein', 'Meal Prep'],
    saved: false,
    calories: 420,
    protein: 35,
    carbs: 45,
    fat: 12,
    fiber: 6,
    ingredients: ['Chicken breast', 'Broccoli', 'Carrots', 'Bell peppers', 'Teriyaki sauce', 'Brown rice'],
    difficulty: 'Medium',
    alternativeIds: ['4', '15'],
    nutrientScore: 0.51
  }),
  ensureServingsProperty({
    id: '9',
    title: 'Mediterranean Hummus Platter',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    time: '15 mins',
    category: 'Snack',
    tags: ['Mediterranean', 'Vegetarian', 'Party'],
    saved: false,
    calories: 350,
    protein: 12,
    carbs: 42,
    fat: 18,
    fiber: 10,
    ingredients: ['Hummus', 'Pita bread', 'Cherry tomatoes', 'Cucumber', 'Olives', 'Feta cheese'],
    difficulty: 'Easy',
    alternativeIds: ['3', '6'],
    nutrientScore: 0.46
  }),
  ensureServingsProperty({
    id: '10',
    title: 'Grilled Steak with Sweet Potato',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    time: '35 mins',
    category: 'Dinner',
    tags: ['High Protein', 'Gluten Free', 'Paleo'],
    saved: false,
    calories: 520,
    protein: 42,
    carbs: 38,
    fat: 22,
    fiber: 6,
    ingredients: ['Ribeye steak', 'Sweet potato', 'Asparagus', 'Olive oil', 'Garlic', 'Herbs'],
    difficulty: 'Medium',
    alternativeIds: ['4', '8'],
    nutrientScore: 0.53
  }),
  ensureServingsProperty({
    id: '11',
    title: 'Peanut Butter Energy Balls',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    time: '15 mins',
    category: 'Snack',
    tags: ['No Bake', 'High Protein', 'Vegan'],
    saved: false,
    calories: 180,
    protein: 8,
    carbs: 22,
    fat: 10,
    fiber: 4,
    ingredients: ['Oats', 'Peanut butter', 'Honey', 'Chia seeds', 'Dark chocolate chips'],
    difficulty: 'Easy',
    nutrientScore: 0.45
  }),
  ensureServingsProperty({
    id: '12',
    title: 'Spinach and Feta Omelette',
    image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71',
    time: '10 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Low Carb', 'Vegetarian'],
    saved: false,
    calories: 320,
    protein: 22,
    carbs: 4,
    fat: 24,
    fiber: 2,
    ingredients: ['Eggs', 'Spinach', 'Feta cheese', 'Red onion', 'Olive oil', 'Salt', 'Pepper'],
    difficulty: 'Easy',
    alternativeIds: ['7', '2'],
    nutrientScore: 0.44
  }),
  ensureServingsProperty({
    id: '13',
    title: 'Lentil Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '40 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Comfort Food'],
    saved: false,
    calories: 280,
    protein: 16,
    carbs: 48,
    fat: 4,
    fiber: 14,
    ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Garlic', 'Vegetable broth', 'Tomatoes', 'Cumin'],
    difficulty: 'Easy',
    alternativeIds: ['6', '1'],
    nutrientScore: 0.43
  }),
  ensureServingsProperty({
    id: '14',
    title: 'Coconut Curry Chicken',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    time: '35 mins',
    category: 'Dinner',
    tags: ['Asian', 'Spicy', 'Comfort Food'],
    saved: false,
    calories: 450,
    protein: 32,
    carbs: 28,
    fat: 24,
    fiber: 6,
    ingredients: ['Chicken thighs', 'Coconut milk', 'Curry paste', 'Bell peppers', 'Onion', 'Garlic', 'Ginger', 'Rice'],
    difficulty: 'Medium',
    alternativeIds: ['8', '4'],
    nutrientScore: 0.42
  }),
  ensureServingsProperty({
    id: '15',
    title: 'Beef and Broccoli Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Asian', 'High Protein', 'Quick'],
    saved: false,
    calories: 380,
    protein: 30,
    carbs: 25,
    fat: 18,
    fiber: 5,
    ingredients: ['Beef sirloin', 'Broccoli', 'Garlic', 'Ginger', 'Soy sauce', 'Sesame oil', 'Brown rice'],
    difficulty: 'Medium',
    alternativeIds: ['8', '10'],
    nutrientScore: 0.41
  }),
  ensureServingsProperty({
    id: '16',
    title: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'No Cook'],
    saved: false,
    calories: 290,
    protein: 18,
    carbs: 40,
    fat: 8,
    fiber: 5,
    ingredients: ['Greek yogurt', 'Granola', 'Mixed berries', 'Honey', 'Chia seeds'],
    difficulty: 'Easy',
    alternativeIds: ['2', '7'],
    nutrientScore: 0.40
  }),
  ensureServingsProperty({
    id: '17',
    title: 'Stuffed Bell Peppers',
    image: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8',
    time: '45 mins',
    category: 'Dinner',
    tags: ['Gluten Free', 'Meal Prep', 'High Protein'],
    saved: false,
    calories: 340,
    protein: 24,
    carbs: 38,
    fat: 12,
    fiber: 8,
    ingredients: ['Bell peppers', 'Ground turkey', 'Brown rice', 'Onion', 'Garlic', 'Tomato sauce', 'Cheese'],
    difficulty: 'Medium',
    alternativeIds: ['14', '15'],
    nutrientScore: 0.39
  }),
  ensureServingsProperty({
    id: '18',
    title: 'Chickpea Salad Sandwich',
    image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304',
    time: '10 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'High Fiber', 'Quick'],
    saved: false,
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 12,
    fiber: 10,
    ingredients: ['Chickpeas', 'Celery', 'Red onion', 'Mayo', 'Mustard', 'Whole grain bread', 'Lettuce'],
    difficulty: 'Easy',
    alternativeIds: ['3', '9'],
    nutrientScore: 0.38
  }),
  ensureServingsProperty({
    id: '19',
    title: 'Banana Oatmeal Pancakes',
    image: 'https://images.unsplash.com/photo-1575853121743-60c24dbe7ad6',
    time: '15 mins',
    category: 'Breakfast',
    tags: ['Whole Grain', 'Kid Friendly', 'Low Fat'],
    saved: false,
    calories: 320,
    protein: 10,
    carbs: 62,
    fat: 6,
    fiber: 8,
    ingredients: ['Oats', 'Banana', 'Eggs', 'Milk', 'Cinnamon', 'Vanilla extract', 'Maple syrup'],
    difficulty: 'Easy',
    alternativeIds: ['16', '2'],
    nutrientScore: 0.37
  }),
  ensureServingsProperty({
    id: '20',
    title: 'Shrimp and Avocado Salad',
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
    time: '15 mins',
    category: 'Lunch',
    tags: ['Seafood', 'Low Carb', 'High Protein'],
    saved: false,
    calories: 310,
    protein: 28,
    carbs: 12,
    fat: 18,
    fiber: 6,
    ingredients: ['Shrimp', 'Avocado', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Lime juice', 'Olive oil'],
    difficulty: 'Easy',
    alternativeIds: ['3', '9'],
    nutrientScore: 0.36
  }),
  ensureServingsProperty({
    id: '21',
    title: 'Vegetable Frittata',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    time: '25 mins',
    category: 'Breakfast',
    tags: ['Vegetarian', 'High Protein', 'Low Carb'],
    saved: false,
    calories: 280,
    protein: 20,
    carbs: 8,
    fat: 18,
    fiber: 3,
    ingredients: ['Eggs', 'Bell peppers', 'Spinach', 'Onion', 'Feta cheese', 'Olive oil', 'Herbs'],
    difficulty: 'Medium',
    alternativeIds: ['12', '16'],
    nutrientScore: 0.35
  }),
  ensureServingsProperty({
    id: '22',
    title: 'Turkey and Avocado Wrap',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
    time: '10 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Quick', 'Meal Prep'],
    saved: false,
    calories: 420,
    protein: 28,
    carbs: 38,
    fat: 20,
    fiber: 8,
    ingredients: ['Turkey breast', 'Avocado', 'Whole wheat wrap', 'Lettuce', 'Tomato', 'Greek yogurt', 'Mustard'],
    difficulty: 'Easy',
    alternativeIds: ['18', '3'],
    nutrientScore: 0.34
  }),
  ensureServingsProperty({
    id: '23',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    time: '40 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'Italian', 'Comfort Food'],
    saved: false,
    calories: 480,
    protein: 12,
    carbs: 78,
    fat: 14,
    fiber: 4,
    ingredients: ['Arborio rice', 'Mushrooms', 'Onion', 'Garlic', 'White wine', 'Vegetable broth', 'Parmesan cheese'],
    difficulty: 'Hard',
    alternativeIds: ['14', '17'],
    nutrientScore: 0.33
  }),
  ensureServingsProperty({
    id: '24',
    title: 'Chocolate Protein Mug Cake',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    time: '5 mins',
    category: 'Dessert',
    tags: ['High Protein', 'Quick', 'Low Sugar'],
    saved: false,
    calories: 220,
    protein: 24,
    carbs: 18,
    fat: 6,
    fiber: 5,
    ingredients: ['Protein powder', 'Cocoa powder', 'Almond flour', 'Almond milk', 'Egg', 'Baking powder'],
    difficulty: 'Easy',
    alternativeIds: ['11', '7'],
    nutrientScore: 0.32
  }),
  ensureServingsProperty({
    id: '25',
    title: 'Caprese Salad',
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5',
    time: '10 mins',
    category: 'Appetizer',
    tags: ['Italian', 'Vegetarian', 'No Cook'],
    saved: false,
    calories: 280,
    protein: 14,
    carbs: 8,
    fat: 22,
    fiber: 2,
    ingredients: ['Tomatoes', 'Fresh mozzarella', 'Basil', 'Balsamic glaze', 'Olive oil', 'Salt', 'Pepper'],
    difficulty: 'Easy',
    alternativeIds: ['9', '20'],
    nutrientScore: 0.31
  }),
  ensureServingsProperty({
    id: '26',
    title: 'Pesto Zucchini Noodles',
    image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77',
    time: '15 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Vegetarian', 'Quick'],
    saved: false,
    calories: 260,
    protein: 8,
    carbs: 12,
    fat: 20,
    fiber: 4,
    ingredients: ['Zucchini', 'Basil pesto', 'Cherry tomatoes', 'Pine nuts', 'Parmesan cheese', 'Garlic'],
    difficulty: 'Easy',
    alternativeIds: ['23', '17'],
    nutrientScore: 0.30
  }),
  ensureServingsProperty({
    id: '27',
    title: 'Tuna Salad Stuffed Avocado',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    time: '10 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Low Carb', 'Omega-3'],
    saved: false,
    calories: 320,
    protein: 28,
    carbs: 10,
    fat: 22,
    fiber: 8,
    ingredients: ['Tuna', 'Avocado', 'Greek yogurt', 'Celery', 'Red onion', 'Lemon juice', 'Dill'],
    difficulty: 'Easy',
    alternativeIds: ['20', '3'],
    nutrientScore: 0.29
  }),
  ensureServingsProperty({
    id: '28',
    title: 'Sweet Potato and Black Bean Chili',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '45 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'High Fiber', 'Meal Prep'],
    saved: false,
    calories: 380,
    protein: 14,
    carbs: 68,
    fat: 6,
    fiber: 16,
    ingredients: ['Sweet potato', 'Black beans', 'Tomatoes', 'Onion', 'Bell pepper', 'Chili powder', 'Cumin'],
    difficulty: 'Medium',
    alternativeIds: ['13', '6'],
    nutrientScore: 0.28
  }),
  ensureServingsProperty({
    id: '29',
    title: 'Almond Butter Toast with Banana',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Quick', 'Vegetarian', 'Kid Friendly'],
    saved: false,
    calories: 340,
    protein: 10,
    carbs: 42,
    fat: 16,
    fiber: 6,
    ingredients: ['Whole grain bread', 'Almond butter', 'Banana', 'Cinnamon', 'Honey'],
    difficulty: 'Easy',
    alternativeIds: ['19', '16'],
    nutrientScore: 0.27
  }),
  ensureServingsProperty({
    id: '30',
    title: 'Roasted Vegetable Quinoa Bowl',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
    time: '35 mins',
    category: 'Lunch',
    tags: ['Vegan', 'Gluten Free', 'Meal Prep'],
    saved: false,
    calories: 420,
    protein: 12,
    carbs: 72,
    fat: 14,
    fiber: 12,
    ingredients: ['Quinoa', 'Sweet potato', 'Broccoli', 'Chickpeas', 'Red onion', 'Tahini', 'Lemon juice'],
    difficulty: 'Medium',
    alternativeIds: ['1', '5'],
    nutrientScore: 0.26
  }),
  ensureServingsProperty({
    id: '31',
    title: 'Chicken and Vegetable Soup',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '50 mins',
    category: 'Dinner',
    tags: ['Comfort Food', 'High Protein', 'Meal Prep'],
    saved: false,
    calories: 280,
    protein: 24,
    carbs: 28,
    fat: 8,
    fiber: 6,
    ingredients: ['Chicken breast', 'Carrots', 'Celery', 'Onion', 'Garlic', 'Chicken broth', 'Herbs'],
    difficulty: 'Medium',
    alternativeIds: ['13', '14'],
    nutrientScore: 0.25
  }),
  ensureServingsProperty({
    id: '32',
    title: 'Cottage Cheese with Berries',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    time: '5 mins',
    category: 'Snack',
    tags: ['High Protein', 'Low Carb', 'No Cook'],
    saved: false,
    calories: 180,
    protein: 24,
    carbs: 14,
    fat: 4,
    fiber: 3,
    ingredients: ['Cottage cheese', 'Mixed berries', 'Honey', 'Cinnamon', 'Almonds'],
    difficulty: 'Easy',
    alternativeIds: ['16', '11'],
    nutrientScore: 0.24
  }),
  ensureServingsProperty({
    id: '33',
    title: 'Tofu Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'High Protein', 'Asian'],
    saved: false,
    calories: 320,
    protein: 18,
    carbs: 32,
    fat: 16,
    fiber: 8,
    ingredients: ['Tofu', 'Broccoli', 'Bell peppers', 'Carrots', 'Soy sauce', 'Ginger', 'Garlic'],
    difficulty: 'Medium',
    alternativeIds: ['8', '15'],
    nutrientScore: 0.23
  }),
  ensureServingsProperty({
    id: '34',
    title: 'Overnight Oats',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    time: '5 mins + overnight',
    category: 'Breakfast',
    tags: ['Meal Prep', 'No Cook', 'High Fiber'],
    saved: false,
    calories: 340,
    protein: 14,
    carbs: 58,
    fat: 8,
    fiber: 10,
    ingredients: ['Rolled oats', 'Milk', 'Greek yogurt', 'Chia seeds', 'Honey', 'Berries', 'Nuts'],
    difficulty: 'Easy',
    alternativeIds: ['19', '29'],
    nutrientScore: 0.22
  }),
  ensureServingsProperty({
    id: '35',
    title: 'Cauliflower Fried Rice',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Vegetarian', 'Asian'],
    saved: false,
    calories: 240,
    protein: 10,
    carbs: 18,
    fat: 14,
    fiber: 6,
    ingredients: ['Cauliflower', 'Eggs', 'Carrots', 'Peas', 'Garlic', 'Ginger', 'Soy sauce', 'Sesame oil'],
    difficulty: 'Medium',
    alternativeIds: ['33', '8'],
    nutrientScore: 0.21
  }),
  ensureServingsProperty({
    id: '36',
    title: 'Turkey and Sweet Potato Chili',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    time: '45 mins',
    category: 'Dinner',
    tags: ['High Protein', 'Comfort Food', 'Meal Prep'],
    saved: false,
    calories: 380,
    protein: 32,
    carbs: 42,
    fat: 10,
    fiber: 10,
    ingredients: ['Ground turkey', 'Sweet potato', 'Kidney beans', 'Tomatoes', 'Onion', 'Bell pepper', 'Chili powder'],
    difficulty: 'Medium',
    alternativeIds: ['28', '31'],
    nutrientScore: 0.20
  }),
  ensureServingsProperty({
    id: '37',
    title: 'Mango and Spinach Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Vegan', 'Quick', 'Vitamin Rich'],
    saved: false,
    calories: 220,
    protein: 6,
    carbs: 48,
    fat: 4,
    fiber: 6,
    ingredients: ['Mango', 'Spinach', 'Banana', 'Almond milk', 'Chia seeds', 'Lime juice'],
    difficulty: 'Easy',
    alternativeIds: ['2', '7'],
    nutrientScore: 0.19
  }),
  ensureServingsProperty({
    id: '38',
    title: 'Baked Falafel Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    time: '40 mins',
    category: 'Lunch',
    tags: ['Vegetarian', 'Mediterranean', 'High Fiber'],
    saved: false,
    calories: 420,
    protein: 16,
    carbs: 62,
    fat: 14,
    fiber: 14,
    ingredients: ['Chickpeas', 'Parsley', 'Cilantro', 'Garlic', 'Cumin', 'Tahini', 'Cucumber', 'Tomato'],
    difficulty: 'Medium',
    alternativeIds: ['1', '9'],
    nutrientScore: 0.18
  }),
  ensureServingsProperty({
    id: '39',
    title: 'Egg and Avocado Toast',
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543',
    time: '10 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Vegetarian'],
    saved: false,
    calories: 340,
    protein: 16,
    carbs: 28,
    fat: 18,
    fiber: 6,
    ingredients: ['Whole grain bread', 'Eggs', 'Avocado', 'Cherry tomatoes', 'Microgreens', 'Salt', 'Pepper'],
    difficulty: 'Easy',
    alternativeIds: ['29', '12'],
    nutrientScore: 0.17
  }),
  ensureServingsProperty({
    id: '40',
    title: 'Lemon Garlic Shrimp Pasta',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
    time: '25 mins',
    category: 'Dinner',
    tags: ['Seafood', 'Italian', 'Quick'],
    saved: false,
    calories: 480,
    protein: 28,
    carbs: 62,
    fat: 14,
    fiber: 4,
    ingredients: ['Shrimp', 'Whole wheat pasta', 'Garlic', 'Lemon', 'Olive oil', 'Parsley', 'Red pepper flakes'],
    difficulty: 'Medium',
    alternativeIds: ['20', '23'],
    nutrientScore: 0.16
  }),
  ensureServingsProperty({
    id: '41',
    title: 'Peanut Butter Banana Smoothie',
    image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['High Protein', 'Quick', 'Kid Friendly'],
    saved: false,
    calories: 380,
    protein: 18,
    carbs: 52,
    fat: 14,
    fiber: 6,
    ingredients: ['Banana', 'Peanut butter', 'Greek yogurt', 'Milk', 'Honey', 'Ice'],
    difficulty: 'Easy',
    alternativeIds: ['7', '37'],
    nutrientScore: 0.15
  }),
  ensureServingsProperty({
    id: '42',
    title: 'Roasted Brussels Sprouts with Bacon',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f',
    time: '25 mins',
    category: 'Side Dish',
    tags: ['Low Carb', 'Gluten Free', 'Keto'],
    saved: false,
    calories: 220,
    protein: 10,
    carbs: 12,
    fat: 16,
    fiber: 6,
    ingredients: ['Brussels sprouts', 'Bacon', 'Olive oil', 'Garlic', 'Balsamic vinegar', 'Salt', 'Pepper'],
    difficulty: 'Easy',
    alternativeIds: ['26', '35'],
    nutrientScore: 0.14
  }),
  ensureServingsProperty({
    id: '43',
    title: 'Chicken Caesar Wrap',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569',
    time: '15 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Quick', 'Meal Prep'],
    saved: false,
    calories: 420,
    protein: 32,
    carbs: 38,
    fat: 18,
    fiber: 4,
    ingredients: ['Chicken breast', 'Whole wheat wrap', 'Romaine lettuce', 'Parmesan cheese', 'Caesar dressing', 'Croutons'],
    difficulty: 'Easy',
    alternativeIds: ['22', '3'],
    nutrientScore: 0.13
  }),
  ensureServingsProperty({
    id: '44',
    title: 'Vegetable Curry with Coconut Rice',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    time: '40 mins',
    category: 'Dinner',
    tags: ['Vegetarian', 'Spicy', 'Asian'],
    saved: false,
    calories: 460,
    protein: 12,
    carbs: 78,
    fat: 14,
    fiber: 10,
    ingredients: ['Mixed vegetables', 'Coconut milk', 'Curry paste', 'Jasmine rice', 'Garlic', 'Ginger', 'Cilantro'],
    difficulty: 'Medium',
    alternativeIds: ['14', '33'],
    nutrientScore: 0.12
  }),
  ensureServingsProperty({
    id: '45',
    title: 'Cauliflower Rice Stir-Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    time: '20 mins',
    category: 'Dinner',
    tags: ['Low Carb', 'Keto', 'Vegetarian'],
    saved: false,
    calories: 250,
    protein: 12,
    carbs: 15,
    fat: 18,
    fiber: 8,
    ingredients: ['Cauliflower', 'Bell peppers', 'Onion', 'Garlic', 'Soy sauce', 'Sesame oil'],
    difficulty: 'Easy',
    alternativeIds: ['8', '10'],
    nutrientScore: 0.11
  })
].map(recipe => ensureServingsProperty(recipe)); // Make sure all recipes have servings

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
  if (recipe.ingredients.every(isRecipeIngredient)) {
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
