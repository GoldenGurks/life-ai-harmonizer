
import { Recipe, EnrichedRecipe } from '@/types/recipes';

/**
 * Generate recipe suggestions in a particular style using LLM
 * @param style Cooking style or author to emulate
 * @param ingredients List of ingredients to include
 * @returns Promise with array of recipe suggestions
 */
export async function suggestByStyle(style: string, ingredients: string[]): Promise<Recipe[]> {
  const prompt = `Schlage 5 Rezepte im Stil von ${style} mit diesen Zutaten vor: ${ingredients.join(', ')}`;
  
  // For testing or development without LLM API access, return mock data
  if (process.env.NODE_ENV === 'test' || !process.env.LLM_API_KEY) {
    console.log('Using mock LLM response for style:', style);
    return generateMockRecipes(style, ingredients);
  }
  
  try {
    // In a real implementation, this would call an LLM API
    // Example of what a real implementation might look like:
    /*
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LLM_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a culinary expert that creates recipe suggestions in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    const recipesJson = JSON.parse(data.choices[0].message.content);
    return recipesJson.recipes;
    */
    
    // For now, return mock data
    return generateMockRecipes(style, ingredients);
  } catch (error) {
    console.error('Error suggesting recipes by style:', error);
    return [];
  }
}

/**
 * Generate mock recipes for testing or when LLM API is not available
 */
function generateMockRecipes(style: string, ingredients: string[]): Recipe[] {
  // Ensure we have at least some ingredients to work with
  const availableIngredients = ingredients.length > 0 
    ? ingredients 
    : ['tomato', 'onion', 'garlic', 'olive oil', 'pasta'];
  
  // Create recipe variations based on style
  const styleAdjective = getStyleAdjective(style);
  
  return [
    {
      id: `llm-${style.toLowerCase()}-1`,
      title: `${styleAdjective} ${capitalize(availableIngredients[0])} Dish`,
      image: 'placeholder.svg',
      time: '25 mins',
      category: 'Main',
      tags: [style, 'LLM-Generated', availableIngredients[0]],
      saved: false,
      ingredients: availableIngredients.slice(0, 3).map(ing => ({ 
        id: Math.floor(Math.random() * 1000), 
        amount: 100, 
        unit: 'g' 
      })),
      instructions: [
        `Prepare the ${availableIngredients[0]} in ${styleAdjective} way`,
        `Add ${availableIngredients.slice(1, 3).join(' and ')}`,
        'Cook until done'
      ],
      difficulty: 'Medium',
      nutrition: {
        calories: 350,
        protein: 15,
        carbs: 40,
        fat: 12,
        fiber: 5,
        sugar: 8,
        cost: 3.50
      },
      authorStyle: style
    },
    {
      id: `llm-${style.toLowerCase()}-2`,
      title: `${style} ${capitalize(availableIngredients[1])} Special`,
      image: 'placeholder.svg',
      time: '35 mins',
      category: 'Main',
      tags: [style, 'LLM-Generated', availableIngredients[1]],
      saved: false,
      ingredients: availableIngredients.slice(1, 4).map(ing => ({ 
        id: Math.floor(Math.random() * 1000), 
        amount: 150, 
        unit: 'g' 
      })),
      instructions: [
        `Prepare the ${availableIngredients[1]} according to ${style} tradition`,
        `Mix with ${availableIngredients.slice(2, 4).join(' and ')}`,
        'Serve hot'
      ],
      difficulty: 'Easy',
      nutrition: {
        calories: 400,
        protein: 20,
        carbs: 45,
        fat: 15,
        fiber: 6,
        sugar: 5,
        cost: 4.20
      },
      authorStyle: style
    },
    {
      id: `llm-${style.toLowerCase()}-3`,
      title: `${styleAdjective} Fusion with ${capitalize(availableIngredients[2])}`,
      image: 'placeholder.svg',
      time: '40 mins',
      category: 'Main',
      tags: [style, 'Fusion', 'LLM-Generated'],
      saved: false,
      ingredients: [...availableIngredients.slice(0, 2), ...availableIngredients.slice(3, 5)].map(ing => ({ 
        id: Math.floor(Math.random() * 1000), 
        amount: 80, 
        unit: 'g' 
      })),
      instructions: [
        `Combine ${availableIngredients[0]} and ${availableIngredients[1]}`,
        `Add a ${styleAdjective} touch with spices`,
        'Cook for 25 minutes'
      ],
      difficulty: 'Hard',
      nutrition: {
        calories: 320,
        protein: 18,
        carbs: 35,
        fat: 10,
        fiber: 7,
        sugar: 4,
        cost: 5.90
      },
      authorStyle: style
    },
    {
      id: `llm-${style.toLowerCase()}-4`,
      title: `Quick ${style} ${capitalize(availableIngredients[0])} Bowl`,
      image: 'placeholder.svg',
      time: '15 mins',
      category: 'Lunch',
      tags: [style, 'Quick', 'LLM-Generated'],
      saved: false,
      ingredients: availableIngredients.filter((_, i) => i % 2 === 0).map(ing => ({ 
        id: Math.floor(Math.random() * 1000), 
        amount: 120, 
        unit: 'g' 
      })),
      instructions: [
        `Prepare a quick ${style} sauce`,
        `Add ${availableIngredients[0]} and cook briefly`,
        'Serve in a bowl'
      ],
      difficulty: 'Easy',
      nutrition: {
        calories: 280,
        protein: 12,
        carbs: 30,
        fat: 8,
        fiber: 4,
        sugar: 6,
        cost: 3.10
      },
      authorStyle: style
    },
    {
      id: `llm-${style.toLowerCase()}-5`,
      title: `${style} Inspired ${capitalize(availableIngredients[availableIngredients.length - 1])} Delight`,
      image: 'placeholder.svg',
      time: '30 mins',
      category: 'Dinner',
      tags: [style, 'Inspired', 'LLM-Generated'],
      saved: false,
      ingredients: availableIngredients.slice(-3).map(ing => ({ 
        id: Math.floor(Math.random() * 1000), 
        amount: 100, 
        unit: 'g' 
      })),
      instructions: [
        `Start with ${availableIngredients[availableIngredients.length - 1]}`,
        `Apply ${style} cooking techniques`,
        'Garnish and serve'
      ],
      difficulty: 'Medium',
      nutrition: {
        calories: 420,
        protein: 22,
        carbs: 38,
        fat: 18,
        fiber: 5,
        sugar: 7,
        cost: 4.80
      },
      authorStyle: style
    }
  ];
}

/**
 * Get descriptive adjective based on cooking style
 */
function getStyleAdjective(style: string): string {
  const styleMap: Record<string, string> = {
    'Italian': 'Rustic',
    'French': 'Elegant',
    'Japanese': 'Minimal',
    'Chinese': 'Bold',
    'Indian': 'Spicy',
    'Mediterranean': 'Fresh',
    'Mexican': 'Vibrant',
    'Thai': 'Aromatic',
    'Gordon Ramsay': 'Masterful',
    'Jamie Oliver': 'Simple',
    'Julia Child': 'Classic',
    'Anthony Bourdain': 'Adventurous',
    'Nigella Lawson': 'Indulgent'
  };
  
  return styleMap[style] || 'Creative';
}

/**
 * Capitalize first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
