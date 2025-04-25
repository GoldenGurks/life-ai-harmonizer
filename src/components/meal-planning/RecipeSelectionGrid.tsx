
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { cn } from '@/lib/utils';

interface RecipeSelectionGridProps {
  recipes: MealItem[];
  selectedRecipes: MealItem[];
  onRecipeSelect: (recipe: MealItem) => void;
  onSavePlan: () => void;
}

const RecipeSelectionGrid: React.FC<RecipeSelectionGridProps> = ({
  recipes,
  selectedRecipes,
  onRecipeSelect,
  onSavePlan,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => {
          const isSelected = selectedRecipes.some(r => r.id === recipe.id);
          
          return (
            <Card 
              key={recipe.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onRecipeSelect(recipe)}
            >
              <CardHeader className="relative p-0">
                <div className="relative h-48 w-full">
                  {recipe.image ? (
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      No image available
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{recipe.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {recipe.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSavePlan}
          disabled={selectedRecipes.length !== 5}
        >
          Save Plan ({selectedRecipes.length}/5 Selected)
        </Button>
      </div>
    </div>
  );
};

export default RecipeSelectionGrid;
