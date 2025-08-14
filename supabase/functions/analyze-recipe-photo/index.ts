import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecipeExtraction {
  title: string;
  ingredients: Array<{
    id: number;
    amount: number;
    unit: 'g' | 'ml' | 'piece';
    name: string;
  }>;
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  time: string;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    cost: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting recipe analysis request');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Parse multipart form data
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      throw new Error('No image provided');
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Maximum 10MB allowed.');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    console.log(`Processing image: ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`);

    // Convert image to base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(buffer))
    );

    console.log('Sending image to OpenAI Vision API');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a recipe extraction expert. Analyze the image and extract a complete recipe with precise measurements. 

Return a JSON object with this exact structure:
{
  "title": "Recipe Name",
  "ingredients": [
    {
      "id": 1001,
      "amount": 200,
      "unit": "g",
      "name": "Ingredient name"
    }
  ],
  "instructions": ["Step 1", "Step 2"],
  "difficulty": "Easy|Medium|Hard",
  "category": "Breakfast|Lunch|Dinner|Snack|Dessert",
  "tags": ["tag1", "tag2"],
  "time": "X mins",
  "nutrition": {
    "calories": 400,
    "protein": 20,
    "carbs": 50,
    "fat": 15,
    "fiber": 8,
    "sugar": 10,
    "cost": 5
  }
}

Use metric units (g, ml) and estimate nutritional values. Start ingredient IDs from 1001.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please extract the recipe from this image with precise measurements and detailed instructions.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageFile.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('OpenAI response received');

    try {
      const parsed: RecipeExtraction = JSON.parse(content);
      
      // Validate the response structure
      if (!parsed.title || !Array.isArray(parsed.ingredients) || !Array.isArray(parsed.instructions)) {
        throw new Error('Invalid response format from AI');
      }

      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing JSON from OpenAI:', parseError);
      throw new Error('Failed to parse recipe from AI response');
    }

  } catch (error) {
    console.error('Error in analyze-recipe-photo function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze recipe photo'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});