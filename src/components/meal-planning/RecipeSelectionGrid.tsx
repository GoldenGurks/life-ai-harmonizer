
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ThumbsDown, ImageOff, Clock } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { cn } from '@/lib/utils';
import NutrientBar from './NutrientBar';

interface RecipeSelectionGridProps {
  recipes: MealItem[];
  selectedRecipes: MealItem[];
  onRecipeSelect: (recipe: MealItem) => void;
  onSavePlan: () => void;
  onDislikeRecipe: (recipeId: string) => void;
  onShowShoppingList?: () => void;
  maxMeals: number; // Added prop to receive the meal count from parent
}

/**
 * Grid component for displaying and selecting recipes during meal planning setup
 */
const RecipeSelectionGrid: React.FC<RecipeSelectionGridProps> = ({
  recipes,
  selectedRecipes,
  onRecipeSelect,
  onSavePlan,
  onDislikeRecipe,
  onShowShoppingList,
  maxMeals // Use this prop instead of hardcoded value
}) => {
  const mealCount = selectedRecipes.length;
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <NutrientBar
          calories={100}
          protein={25}
          carbs={50}
          fat={25}
          maxCalories={100}
          showLegend={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recipes.map((recipe) => {
          const isSelected = selectedRecipes.some(r => r.id === recipe.id);
          const difficulty = recipe.preparationTime + recipe.cookingTime <= 30 ? 'Easy' : 'Medium';
          
          return (
            <Card 
              key={recipe.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md overflow-hidden",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onRecipeSelect(recipe)}
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
                
                {isSelected && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDislikeRecipe(recipe.id);
                  }}
                  className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
                  title="Dislike this recipe"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                
                <div className="absolute bottom-2 left-2 right-16 text-white">
                  <h3 className="font-medium text-sm">{recipe.name}</h3>
                </div>
              </div>
              
              <CardContent className="p-2">
                <NutrientBar
                  calories={recipe.calories}
                  protein={recipe.protein}
                  carbs={recipe.carbs}
                  fat={recipe.fat}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedRecipes.length} of {maxMeals} meals selected
          </div>
          <div className="flex gap-2">
            {selectedRecipes.length === maxMeals && onShowShoppingList && (
              <Button 
                variant="outline" 
                onClick={onShowShoppingList}
                className="flex items-center gap-1"
              >
                View Shopping List
              </Button>
            )}
            <Button
              onClick={onSavePlan}
              disabled={selectedRecipes.length !== maxMeals}
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
