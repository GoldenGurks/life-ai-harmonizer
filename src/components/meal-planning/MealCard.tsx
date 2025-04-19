
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  tags: string[];
  ingredients?: Ingredient[];
  alternativeMeals?: { name: string; calories: number; protein: number; image?: string }[];
  onMealChange: (mealType: string) => void;
  onLike?: () => void;
  onDislike?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  icon,
  name,
  description,
  calories,
  protein,
  carbs = 0,
  fat = 0,
  fiber = 0,
  sugar = 0,
  tags,
  ingredients = [],
  alternativeMeals = [],
  onMealChange,
  onLike,
  onDislike,
}) => {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
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
        <h3 className="font-medium text-base">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {description}
        </p>
        
        <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{calories}</span>
            <span className="text-xs text-muted-foreground">kcal</span>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{protein}g</span>
            <span className="text-xs text-muted-foreground">protein</span>
          </div>
          <div className="bg-muted p-2 rounded text-center">
            <span className="block text-sm font-medium">{carbs}g</span>
            <span className="text-xs text-muted-foreground">carbs</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex justify-between text-xs items-center">
            <span>Fat</span>
            <span className="font-medium">{fat}g</span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span>Fiber</span>
            <span className="font-medium">{fiber}g</span>
          </div>
          <div className="flex justify-between text-xs items-center">
            <span>Sugar</span>
            <span className="font-medium">{sugar}g</span>
          </div>
        </div>
        
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
                <span className="text-xs text-muted-foreground">{alternativeMeals[currentAlternative].calories} kcal</span>
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
