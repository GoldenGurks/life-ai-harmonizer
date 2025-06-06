
import React from 'react';
import { Recipe } from '@/types/recipes';
import RecipeCard from './RecipeCard';
import { Button } from '@/components/ui/button';

interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeClick: (recipe: Recipe) => void;
  onSaveRecipe: (id: string, event?: React.MouseEvent) => void;
  onShowAlternatives: (recipeId: string, event?: React.MouseEvent) => void;
  onClearFilters: () => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ 
  recipes, 
  onRecipeClick, 
  onSaveRecipe, 
  onShowAlternatives,
  onClearFilters 
}) => {
  if (recipes.length === 0) {
    return (
      <div className="col-span-3 text-center py-10">
        <p className="text-muted-foreground">No recipes found with the current filters.</p>
        <Button variant="outline" className="mt-4" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <>
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onRecipeClick={onRecipeClick}
          onSaveRecipe={onSaveRecipe}
          onShowAlternatives={onShowAlternatives}
        />
      ))}
    </>
  );
};

export default RecipeGrid;
