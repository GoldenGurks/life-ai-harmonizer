
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ImageOff, Sunrise, Utensils, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MealItem } from '@/types/meal-planning';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

interface DaySlotProps {
  day: string;
  mealType: MealType;
  meal?: MealItem;
  onAdd: (day: string, mealType: MealType) => void;
}

const DaySlot: React.FC<DaySlotProps> = ({ day, mealType, meal, onAdd }) => {
  // Get the appropriate icon based on meal type
  const getMealIcon = () => {
    switch (mealType) {
      case 'breakfast':
        return <Sunrise className="h-5 w-5 text-amber-500" />;
      case 'lunch':
        return <Utensils className="h-5 w-5 text-blue-500" />;
      case 'dinner':
        return <Moon className="h-5 w-5 text-indigo-500" />;
      default:
        return null;
    }
  };

  // Get the tooltip text based on meal type
  const getTooltipText = () => {
    return `Add ${mealType}`;
  };

  // If no meal is assigned, show the add button
  if (!meal) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex items-center justify-center p-2 cursor-pointer transition-all hover:bg-muted/50 rounded-md group"
              onClick={() => onAdd(day, mealType)}
            >
              <div className="flex items-center gap-2">
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                  {getMealIcon()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 rounded-full bg-muted/50 hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // If meal is assigned, show the meal card
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-0 shadow-sm">
      <div className="flex items-start gap-1 w-full">
        <div className="p-2 opacity-70">
          {getMealIcon()}
        </div>
        <div className="flex-1">
          <div className="relative aspect-video rounded-md overflow-hidden">
            {meal.image ? (
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <ImageOff className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardContent className="p-3 pt-1">
            <p className="text-sm font-medium line-clamp-1">{meal.name}</p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default DaySlot;
