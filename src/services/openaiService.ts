
interface OpenAIRecipeExtraction {
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

class OpenAIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    const stored = localStorage.getItem('openai_api_key');
    if (stored) {
      this.apiKey = stored;
      return stored;
    }
    
    return null;
  }

  async extractRecipeFromImage(imageFile: File): Promise<OpenAIRecipeExtraction> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not set');
    }

    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
                  url: `data:image/jpeg;base64,${base64Image}`
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error) {
      throw new Error('Failed to parse recipe from AI response');
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        resolve(base64.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const openaiService = new OpenAIService();
