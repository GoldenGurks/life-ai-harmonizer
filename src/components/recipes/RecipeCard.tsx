
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Tag, Heart, TrendingUp } from 'lucide-react';
import { Recipe } from '@/types/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeClick: (recipe: Recipe) => void;
  onSaveRecipe: (id: string, event?: React.MouseEvent) => void;
  onShowAlternatives: (recipeId: string, event?: React.MouseEvent) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onRecipeClick, 
  onSaveRecipe, 
  onShowAlternatives 
}) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
      onClick={() => onRecipeClick(recipe)}
    >
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${recipe.image})` }}
      >
        <div className="flex justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
          <Badge variant="secondary" className="bg-white/90 text-black">
            <Clock className="h-3 w-3 mr-1" />
            {recipe.time}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-black">
            {recipe.difficulty || 'Medium'}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{recipe.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => onSaveRecipe(recipe.id, e)}
          >
            {recipe.saved ? 
              <Heart className="h-4 w-4 fill-secondary text-secondary" /> :
              <Heart className="h-4 w-4" />
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <ChefHat className="h-4 w-4 mr-1" /> 
          <span>{recipe.category}</span>
          <span className="mx-2">•</span>
          <Tag className="h-4 w-4 mr-1" />
          <span>{recipe.tags.slice(0, 2).join(", ")}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="font-medium">{recipe.calories || 0}</span>
            <span className="text-muted-foreground">kcal</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="font-medium">{recipe.protein || 0}g</span>
            <span className="text-muted-foreground">Protein</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="font-medium">{recipe.carbs || 0}g</span>
            <span className="text-muted-foreground">Carbs</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="font-medium">{recipe.sugar || 0}g</span>
            <span className="text-muted-foreground">Sugar</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={(e) => onShowAlternatives(recipe.id, e)} className="text-muted-foreground">
          <TrendingUp className="h-4 w-4 mr-1" /> 
          Alternatives
        </Button>
        <Button variant="outline" size="sm">View Recipe</Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
