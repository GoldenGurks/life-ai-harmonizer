
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Loader2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { photoImportService } from '@/services/photoImportService';
import { Recipe, RecipeIngredient } from '@/types/recipes';

interface PhotoImportModalProps {
  onRecipeCreated: (recipe: Recipe) => void;
  onClose: () => void;
}

const PhotoImportModal: React.FC<PhotoImportModalProps> = ({
  onRecipeCreated,
  onClose
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection from input
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  // Upload image to SmartPlate via Supabase Edge Function and analyze
  const handleAnalyzePhoto = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call our Supabase Edge Function to analyze the photo
      const smartPlateData = await photoImportService.analyzeRecipePhoto(selectedFile);
      
      // Parse JSON into RecipeIngredient[] format
      const ingredients: RecipeIngredient[] = smartPlateData.ingredients.map((ing, index) => ({
        id: 1000 + index, // Generate sequential IDs starting from 1000
        amount: ing.amount,
        unit: ing.unit as 'g' | 'ml' | 'piece',
        name: ing.name
      }));

      // Transform SmartPlate response into our Recipe shape
      const newRecipe: Recipe = {
        id: `photo-${Date.now()}`,
        title: smartPlateData.title,
        image: previewUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
        time: smartPlateData.time || '30 mins',
        category: 'Dinner', // Default category
        tags: ['Photo Import'], // Tag to identify photo-imported recipes
        saved: false,
        servings: smartPlateData.servings || 4,
        ingredients: ingredients,
        instructions: smartPlateData.instructions || [],
        difficulty: smartPlateData.difficulty || 'Medium',
        // Initialize with default nutrition values - will be calculated later
        nutrition: {
          calories: 400,
          protein: 20,
          carbs: 50,
          fat: 15,
          fiber: 8,
          sugar: 10,
          cost: 5
        }
      };

      toast.success('Recipe extracted successfully from photo!');
      
      // Insert the new recipe into our library
      onRecipeCreated(newRecipe);
      onClose();
    } catch (error) {
      console.error('Photo analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Could not analyze photo. Try another image.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Import Recipe from Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File upload input */}
          <div>
            <label className="text-sm font-medium">Food Photo</label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="food-photo"
              />
              <label
                htmlFor="food-photo"
                className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Food preview"
                      className="max-h-48 rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">Click to change photo</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Upload food photo</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG up to 10MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAnalyzePhoto}
              disabled={isAnalyzing || !selectedFile}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Photo...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Analyze Photo
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoImportModal;
