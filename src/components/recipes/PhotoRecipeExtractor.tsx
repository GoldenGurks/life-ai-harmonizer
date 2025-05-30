
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { openaiService } from '@/services/openaiService';
import { Recipe } from '@/types/recipes';

interface PhotoRecipeExtractorProps {
  onRecipeExtracted: (recipe: Recipe) => void;
  onClose: () => void;
}

const PhotoRecipeExtractor: React.FC<PhotoRecipeExtractorProps> = ({
  onRecipeExtracted,
  onClose
}) => {
  const [apiKey, setApiKey] = useState(() => openaiService.getApiKey() || '');
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleExtractRecipe = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    setIsExtracting(true);
    
    try {
      openaiService.setApiKey(apiKey);
      const extractedData = await openaiService.extractRecipeFromImage(selectedFile);
      
      // Convert to Recipe format
      const recipe: Recipe = {
        id: `ai-${Date.now()}`,
        title: extractedData.title,
        image: previewUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
        time: extractedData.time,
        category: extractedData.category,
        tags: extractedData.tags,
        saved: false,
        servings: 2,
        ingredients: extractedData.ingredients,
        instructions: extractedData.instructions,
        difficulty: extractedData.difficulty,
        calories: extractedData.nutrition?.calories || 400,
        protein: extractedData.nutrition?.protein || 20,
        carbs: extractedData.nutrition?.carbs || 50,
        fat: extractedData.nutrition?.fat || 15,
        fiber: extractedData.nutrition?.fiber || 8,
        nutrition: extractedData.nutrition
      };

      toast.success('Recipe extracted successfully!');
      onRecipeExtracted(recipe);
      onClose();
    } catch (error) {
      console.error('Recipe extraction error:', error);
      toast.error('Failed to extract recipe. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Extract Recipe from Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!openaiService.getApiKey() && (
            <div>
              <label className="text-sm font-medium">OpenAI API Key</label>
              <Input
                type="password"
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your API key is stored locally and used only for recipe extraction
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Recipe Photo</label>
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="recipe-photo"
              />
              <label
                htmlFor="recipe-photo"
                className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-muted-foreground/50 transition-colors"
              >
                {previewUrl ? (
                  <div className="space-y-2">
                    <img
                      src={previewUrl}
                      alt="Recipe preview"
                      className="max-h-48 rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">Click to change photo</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium">Upload recipe photo</p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG up to 10MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleExtractRecipe}
              disabled={isExtracting || !selectedFile}
              className="flex-1"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting Recipe...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Extract Recipe
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

export default PhotoRecipeExtractor;
