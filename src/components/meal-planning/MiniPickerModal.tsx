
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MealItem } from '@/types/meal-planning';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ImageOff, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MealType } from './DaySlot';
import { cn } from '@/lib/utils';

interface MiniPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  availableRecipes: MealItem[];
  onSelectRecipe: (recipe: MealItem) => void;
}

/**
 * Modal component for picking a meal recipe to add to a specific day and meal type
 */
const MiniPickerModal: React.FC<MiniPickerModalProps> = ({
  isOpen,
  onClose,
  mealType,
  availableRecipes,
  onSelectRecipe
}) => {
  // Track currently selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState<MealItem | null>(null);

  // Filter recipes based on meal type or show all if no matching types
  const filteredRecipes = availableRecipes.filter(recipe => 
    !recipe.type || recipe.type === mealType || recipe.type === 'breakfast' || recipe.type === 'lunch' || recipe.type === 'dinner'
  );

  /**
   * Handle recipe selection
   */
  const handleSelection = (recipe: MealItem) => {
    setSelectedRecipe(recipe);
  };

  /**
   * Handle saving the selected recipe
   */
  const handleSave = () => {
    if (selectedRecipe) {
      // Create a copy with the correct meal type
      const recipeWithType = {
        ...selectedRecipe,
        type: mealType
      };
      onSelectRecipe(recipeWithType);
      setSelectedRecipe(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a {mealType} recipe</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => {
              const isSelected = selectedRecipe?.id === recipe.id;
              const difficulty = recipe.preparationTime + recipe.cookingTime <= 30 ? 'Easy' : 'Medium';
              
              return (
                <Card 
                  key={recipe.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md overflow-hidden",
                    isSelected && "ring-2 ring-primary"
                  )}
                  onClick={() => handleSelection(recipe)}
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
                    
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="secondary" className="bg-black/30">
                        {difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-black/30 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.preparationTime + recipe.cookingTime}m
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <h3 className="font-medium text-sm">{recipe.name}</h3>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No {mealType} recipes available. Try adding more recipes to your collection.
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedRecipe}>
            Add to plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MiniPickerModal;
