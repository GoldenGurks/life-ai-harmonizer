
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
  onMealClick?: (meal: MealItem) => void;
  onDragStart?: (day: string, mealType: MealType, meal: MealItem) => void;
  onDrop?: (day: string, mealType: MealType) => void;
  isDragOver?: boolean;
}

const DaySlot: React.FC<DaySlotProps> = ({ 
  day, 
  mealType, 
  meal, 
  onAdd, 
  onMealClick,
  onDragStart,
  onDrop,
  isDragOver 
}) => {
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

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent) => {
    if (meal && onDragStart) {
      e.dataTransfer.setData('text/plain', JSON.stringify({ day, mealType, mealId: meal.id }));
      onDragStart(day, mealType, meal);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(day, mealType);
    }
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // If no meal is assigned, show the add button
  if (!meal) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center justify-center p-2 cursor-pointer transition-all hover:bg-muted/50 rounded-md group ${isDragOver ? 'bg-muted/70 border-2 border-dashed border-primary/50' : ''}`}
              onClick={() => onAdd(day, mealType)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
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
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md border-0 shadow-sm ${isDragOver ? 'bg-muted/70 border-2 border-dashed border-primary/50' : ''} cursor-pointer`}
      draggable={true}
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => onMealClick && meal && onMealClick(meal)}
    >
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
