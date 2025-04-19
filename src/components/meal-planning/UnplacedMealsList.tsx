
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MealItem } from '@/types/meal-planning';
import { ChefHat, Utensils, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UnplacedMealsListProps {
  meals: MealItem[];
  onAddToDay: (meal: MealItem, day: string) => void;
}

const UnplacedMealsList: React.FC<UnplacedMealsListProps> = ({ meals, onAddToDay }) => {
  const getIconForMealType = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <ChefHat className="h-4 w-4 text-primary mr-2" />;
      case 'lunch':
        return <Utensils className="h-4 w-4 text-secondary mr-2" />;
      case 'dinner':
        return <Utensils className="h-4 w-4 text-accent mr-2" />;
      default:
        return <Coffee className="h-4 w-4 text-primary mr-2" />;
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (meals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggested Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getIconForMealType(meal.type)}
                <span className="font-medium">{meal.name}</span>
              </div>
              <Badge variant="outline" className="ml-2">{meal.calories} cal</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{meal.description.substring(0, 60)}...</p>
            
            <div className="mt-3">
              <div className="text-xs font-medium mb-1">Add to day:</div>
              <div className="flex flex-wrap gap-1">
                {days.map((day) => (
                  <Button 
                    key={day} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7 px-2"
                    onClick={() => onAddToDay(meal, day)}
                  >
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UnplacedMealsList;
