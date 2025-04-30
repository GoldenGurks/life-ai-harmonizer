
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MealItem } from '@/types/meal-planning';
import { ClockIcon, GaugeIcon, UtensilsCrossedIcon, Euro } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: MealItem;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  recipe 
}) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{recipe.name}</DialogTitle>
          <DialogDescription>
            {recipe.description}
          </DialogDescription>
        </DialogHeader>

        {recipe.image && (
          <div className="w-full h-64 rounded-md overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center bg-muted/50 rounded-md p-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mt-1">{recipe.preparationTime || 0} min</span>
            <span className="text-xs text-muted-foreground">Prep Time</span>
          </div>
          <div className="flex flex-col items-center bg-muted/50 rounded-md p-2">
            <UtensilsCrossedIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mt-1">{recipe.cookingTime || 0} min</span>
            <span className="text-xs text-muted-foreground">Cooking</span>
          </div>
          <div className="flex flex-col items-center bg-muted/50 rounded-md p-2">
            <GaugeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mt-1">{recipe.calories} kcal</span>
            <span className="text-xs text-muted-foreground">Calories</span>
          </div>
          <div className="flex flex-col items-center bg-muted/50 rounded-md p-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium mt-1">Affordable</span>
            <span className="text-xs text-muted-foreground">Cost</span>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Nutrition</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div className="bg-muted p-2 rounded text-center">
              <span className="block text-sm font-medium">{recipe.protein}g</span>
              <span className="text-xs text-muted-foreground">Protein</span>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <span className="block text-sm font-medium">{recipe.carbs || 0}g</span>
              <span className="text-xs text-muted-foreground">Carbs</span>
            </div>
            <div className="bg-muted p-2 rounded text-center">
              <span className="block text-sm font-medium">{recipe.fat || 0}g</span>
              <span className="text-xs text-muted-foreground">Fat</span>
            </div>
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div>
          <h3 className="text-lg font-medium">Ingredients</h3>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Instructions</h3>
            <ol className="mt-2 space-y-2 list-decimal pl-5">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="pl-1">{instruction}</li>
              ))}
            </ol>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
