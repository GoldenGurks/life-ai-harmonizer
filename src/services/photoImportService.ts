
interface SmartPlateIngredient {
  name: string;
  amount: number;
  unit: string;
}

interface SmartPlateResponse {
  title: string;
  ingredients: SmartPlateIngredient[];
  instructions: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  servings?: number;
  time?: string;
}

class PhotoImportService {
  private apiKey: string | null = null;
  private endpoint = 'https://api.openai.com/v1/chat/completions'; // Using OpenAI API for SmartPlate GPT

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('smartplate_api_key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    
    const stored = localStorage.getItem('smartplate_api_key');
    if (stored) {
      this.apiKey = stored;
      return stored;
    }
    
    return null;
  }

  async analyzeRecipePhoto(file: File): Promise<SmartPlateResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('SmartPlate API key not set');
    }

    // Convert image to base64 for GPT Vision
    const base64Image = await this.fileToBase64(file);

    try {
      // Upload image to SmartPlate GPT endpoint
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using GPT-4 Vision for image analysis
          messages: [
            {
              role: 'system',
              content: `You are SmartPlate, a recipe extraction expert. Analyze food images and return structured recipe data.

Return JSON in this exact format:
{
  "title": "Recipe Name",
  "ingredients": [{"name": "ingredient", "amount": 1, "unit": "cup"}],
  "instructions": ["Step 1", "Step 2"],
  "difficulty": "Easy|Medium|Hard",
  "servings": 4,
  "time": "30 mins"
}

Extract precise measurements and clear instructions from the image.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please analyze this food image and extract a complete recipe with ingredients and instructions.'
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
        throw new Error(`SmartPlate API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse JSON response into SmartPlateResponse
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (error) {
        throw new Error('Failed to parse recipe from SmartPlate response');
      }
    } catch (error) {
      console.error('Photo analysis error:', error);
      throw new Error('Could not analyze photo. Try another image.');
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

export const photoImportService = new PhotoImportService();
