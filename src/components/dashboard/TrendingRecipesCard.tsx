
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, TrendingUp, Plus } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';

interface TrendingRecipesCardProps {
  popularRecipes: MealItem[];
  onAddToWeeklyPlan: (recipe: MealItem) => void;
}

const TrendingRecipesCard: React.FC<TrendingRecipesCardProps> = ({
  popularRecipes,
  onAddToWeeklyPlan
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-secondary" />
          Trending This Week
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recipes loved by our community
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {popularRecipes.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer relative">
              <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                {recipe.image ? (
                  <img 
                    src={recipe.image} 
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ChefHat className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                  <h4 className="font-medium text-sm mb-2 text-center">{recipe.name}</h4>
                  <p className="text-xs mb-3">{recipe.calories} kcal</p>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWeeklyPlan(recipe);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Plan
                  </Button>
                </div>
              </div>
              <h4 className="font-medium text-sm mb-1 line-clamp-2">{recipe.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">{recipe.calories} kcal</p>
              <div className="flex gap-1">
                {recipe.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingRecipesCard;
