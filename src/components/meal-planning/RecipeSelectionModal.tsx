
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft, Clock, ChefHat, ImageOff } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { cn } from '@/lib/utils';
import { recipeData } from '@/data/recipeDatabase';
import { convertRecipeToMealItem } from './WeeklyPlanTab';

interface RecipeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealCount: number;
  onConfirmSelection: (selectedRecipes: MealItem[]) => void;
}

/**
 * Modal for selecting recipes with meal type filtering
 */
const RecipeSelectionModal: React.FC<RecipeSelectionModalProps> = ({
  isOpen,
  onClose,
  mealCount,
  onConfirmSelection
}) => {
  const [selectedRecipes, setSelectedRecipes] = useState<MealItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'breakfast' | 'other'>('other');
  const [availableRecipes, setAvailableRecipes] = useState<MealItem[]>([]);

  // Convert recipe database to meal items on mount
  useEffect(() => {
    const recipes = recipeData.map(convertRecipeToMealItem);
    setAvailableRecipes(recipes);
  }, []);

  // Filter recipes based on active filter
  const filteredRecipes = availableRecipes.filter(recipe => {
    if (activeFilter === 'breakfast') {
      return recipe.type === 'breakfast';
    }
    return recipe.type !== 'breakfast';
  });

  const handleRecipeToggle = (recipe: MealItem) => {
    const isSelected = selectedRecipes.some(r => r.id === recipe.id);
    
    if (isSelected) {
      setSelectedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    } else {
      if (selectedRecipes.length >= mealCount) return;
      setSelectedRecipes(prev => [...prev, recipe]);
    }
  };

  const handleConfirm = () => {
    if (selectedRecipes.length === mealCount) {
      onConfirmSelection(selectedRecipes);
      onClose();
    }
  };

  const getDifficulty = (recipe: MealItem) => {
    const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);
    if (totalTime <= 20) return 'Einfach';
    if (totalTime <= 40) return 'Mittel';
    return 'Schwer';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle>Wähle {mealCount} Gerichte</DialogTitle>
          <Badge variant="outline" className="ml-auto">
            {selectedRecipes.length} / {mealCount} gewählt
          </Badge>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'breakfast' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('breakfast')}
              className="flex-1"
            >
              Frühstück
            </Button>
            <Button
              variant={activeFilter === 'other' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('other')}
              className="flex-1"
            >
              Lunch & Dinner
            </Button>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {filteredRecipes.map((recipe) => {
              const isSelected = selectedRecipes.some(r => r.id === recipe.id);
              const isDisabled = !isSelected && selectedRecipes.length >= mealCount;
              const difficulty = getDifficulty(recipe);
              const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

              return (
                <Card
                  key={recipe.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md overflow-hidden",
                    isSelected && "ring-2 ring-primary",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => !isDisabled && handleRecipeToggle(recipe)}
                >
                  <div className="relative h-32 w-full">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant="secondary" className="bg-black/30 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {totalTime}m
                      </Badge>
                    </div>

                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/30 text-xs">
                        <ChefHat className="h-3 w-3 mr-1" />
                        {difficulty}
                      </Badge>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-8 text-white">
                      <h3 className="font-medium text-sm leading-tight">{recipe.name}</h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleConfirm}
              disabled={selectedRecipes.length !== mealCount}
              size="lg"
            >
              Plan generieren ({selectedRecipes.length}/{mealCount})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSelectionModal;
