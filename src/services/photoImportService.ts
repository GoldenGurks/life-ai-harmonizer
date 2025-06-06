
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
  private supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  private supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  async analyzeRecipePhoto(file: File): Promise<SmartPlateResponse> {
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error('Supabase configuration not found. Please set up Supabase integration.');
    }

    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', file);

      // Call our Supabase Edge Function
      const response = await fetch(`${this.supabaseUrl}/functions/v1/analyze-recipe-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response structure
      if (!data.title || !Array.isArray(data.ingredients) || !Array.isArray(data.instructions)) {
        throw new Error('Invalid response format from recipe analysis service');
      }

      return data;
    } catch (error) {
      console.error('Photo analysis error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Could not analyze photo. Please try another image.');
    }
  }
}

export const photoImportService = new PhotoImportService();
