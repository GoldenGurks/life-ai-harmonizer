
import { supabase } from '@/integrations/supabase/client';

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

/**
 * Secure OpenAI service that uses server-side API calls through Supabase Edge Functions
 * No API keys are stored or exposed on the client side
 */
class OpenAIService {
  async extractRecipeFromImage(imageFile: File): Promise<OpenAIRecipeExtraction> {
    // Validate file size on client side (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Maximum 10MB allowed.');
    }

    // Validate file type on client side
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
    }

    try {
      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', imageFile);

      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('analyze-recipe-photo', {
        body: formData,
      });

      if (error) {
        console.error('Error calling analyze-recipe-photo function:', error);
        throw new Error(`Failed to analyze recipe: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from recipe analysis service');
      }

      // Validate the response structure
      if (!data.title || !Array.isArray(data.ingredients) || !Array.isArray(data.instructions)) {
        throw new Error('Invalid response format from recipe analysis service');
      }

      return data as OpenAIRecipeExtraction;
    } catch (error) {
      console.error('Error in extractRecipeFromImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Could not analyze recipe image. Please try another image.');
    }
  }
}

export const openaiService = new OpenAIService();
