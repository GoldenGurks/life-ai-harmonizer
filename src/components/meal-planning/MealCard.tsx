import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Euro } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import NutrientProgressBar from '@/components/dashboard/NutrientProgressBar';
import { toast } from 'sonner';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface MealCardProps {
  title: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    cost: number;
  };
  tags: string[];
  ingredients?: Ingredient[];
  alternativeMeals?: { name: string; nutrition: { calories: number; cost: number }; image?: string }[];
  onMealChange: (mealType: string) => void;
  onLike?: () => void;
  onDislike?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  icon,
  name,
  description,
  nutrition,
  tags,
  ingredients = [],
  alternativeMeals = [],
  onMealChange,
  onLike,
  onDislike,
}) => {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [currentAlternative, setCurrentAlternative] = useState(0);
  
  const handleLike = () => {
    if (onLike) onLike();
    toast.success("Added to your preferences!");
  };
  
  const handleDislike = () => {
    if (onDislike) onDislike();
    toast.success("We'll avoid this in the future.");
  };
  
  const showNextAlternative = () => {
    if (alternativeMeals.length > 0) {
      setCurrentAlternative((prev) => (prev + 1) % alternativeMeals.length);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
        <div className="flex items-center">
          {icon}
          <CardTitle className="text-lg ml-2">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onMealChange(title.toLowerCase())}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-base">{name}</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Euro className="h-3 w-3" />
            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(nutrition.cost)}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mt-1 mb-3">
          {description}
        </p>
        
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{nutrition.calories}</span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{nutrition.protein}g</span>
            <span className="text-xs text-muted-foreground">protein</span>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{nutrition.carbs || 0}g</span>
            <span className="text-xs text-muted-foreground">carbs</span>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{nutrition.sugar || 0}g</span>
            <span className="text-xs text-muted-foreground">sugar</span>
          </div>
        </div>
        
        <Collapsible open={isNutritionOpen} onOpenChange={setIsNutritionOpen} className="w-full mb-3">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between my-2">
              <span>Nutrition Details</span>
              {isNutritionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2">
            <NutrientProgressBar 
              label="Calories" 
              value={nutrition.calories} 
              max={800} 
              unit="kcal"
              color="bg-amber-500"
            />
            <NutrientProgressBar 
              label="Protein" 
              value={nutrition.protein} 
              max={50} 
              unit="g"
              color="bg-blue-500"
            />
            <NutrientProgressBar 
              label="Carbs" 
              value={nutrition.carbs || 0} 
              max={100} 
              unit="g"
              color="bg-green-500"
            />
            <NutrientProgressBar 
              label="Fat" 
              value={nutrition.fat || 0} 
              max={30} 
              unit="g"
              color="bg-secondary"
            />
            <NutrientProgressBar 
              label="Fiber" 
              value={nutrition.fiber || 0} 
              max={25} 
              unit="g"
              color="bg-accent"
            />
            <NutrientProgressBar 
              label="Sugar" 
              value={nutrition.sugar || 0} 
              max={50} 
              unit="g"
              color="bg-pink-500"
            />
            <NutrientProgressBar 
              label="Cost" 
              value={nutrition.cost} 
              max={10} 
              unit="€"
              color="bg-primary"
              isCost={true}
            />
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
        
        <Collapsible open={isIngredientsOpen} onOpenChange={setIsIngredientsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full flex justify-between my-2">
              <span>Ingredients</span>
              {isIngredientsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2">
            {ingredients.length > 0 ? (
              <ul className="text-sm space-y-1">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{ingredient.name}</span>
                    <span className="text-muted-foreground">{ingredient.amount} {ingredient.unit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No ingredients available</p>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {alternativeMeals.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">Alternative suggestions:</p>
            <div className="bg-muted/50 p-2 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm">{alternativeMeals[currentAlternative].name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{alternativeMeals[currentAlternative].nutrition.calories} kcal</span>
                  <span>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(alternativeMeals[currentAlternative].nutrition.cost)}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-1" onClick={showNextAlternative}>
                Show next alternative
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3">
        <Button variant="outline" size="sm" onClick={handleLike}>
          <ThumbsUp className="h-4 w-4 mr-1" />
          I like this
        </Button>
        <Button variant="outline" size="sm" onClick={handleDislike}>
          <ThumbsDown className="h-4 w-4 mr-1" />
          Not for me
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MealCard;
