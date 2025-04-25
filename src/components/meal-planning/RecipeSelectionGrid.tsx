
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ThumbsDown, ImageOff, ShoppingCart } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { cn } from '@/lib/utils';

interface RecipeSelectionGridProps {
  recipes: MealItem[];
  selectedRecipes: MealItem[];
  onRecipeSelect: (recipe: MealItem) => void;
  onSavePlan: () => void;
  onDislikeRecipe: (recipeId: string) => void;
  onShowShoppingList?: () => void;
}

const RecipeSelectionGrid: React.FC<RecipeSelectionGridProps> = ({
  recipes,
  selectedRecipes,
  onRecipeSelect,
  onSavePlan,
  onDislikeRecipe,
  onShowShoppingList
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => {
          const isSelected = selectedRecipes.some(r => r.id === recipe.id);
          
          return (
            <Card 
              key={recipe.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md overflow-hidden",
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
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ImageOff className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h3 className="font-medium text-sm">{recipe.name}</h3>
                    <p className="text-xs opacity-80 line-clamp-1">
                      {recipe.description}
                    </p>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDislikeRecipe(recipe.id);
                    }}
                    className="absolute top-2 left-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
                    title="Dislike this recipe"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex gap-2 text-xs">
                  <span className="bg-muted px-2 py-0.5 rounded-full">{recipe.calories} cal</span>
                  <span className="bg-muted px-2 py-0.5 rounded-full">{recipe.preparationTime + recipe.cookingTime} min</span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-2 h-8 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRecipeSelect(recipe);
                  }}
                >
                  {isSelected ? 'Deselect' : 'Select for Week'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedRecipes.length} of 5 meals selected
          </div>
          <div className="flex gap-2">
            {selectedRecipes.length === 5 && onShowShoppingList && (
              <Button 
                variant="outline" 
                onClick={onShowShoppingList}
                className="flex items-center gap-1"
              >
                <ShoppingCart className="h-4 w-4" />
                View Shopping List
              </Button>
            )}
            <Button
              onClick={onSavePlan}
              disabled={selectedRecipes.length !== 5}
            >
              Create Weekly Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSelectionGrid;
