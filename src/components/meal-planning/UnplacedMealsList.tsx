
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MealItem } from '@/types/meal-planning';
import { ChefHat, Utensils, Coffee, PlusCircle } from 'lucide-react';
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
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5 pb-3">
        <CardTitle className="text-lg uppercase">Suggested Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pt-4">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <div className="meal-card-header">
              <div className="flex items-center">
                {getIconForMealType(meal.type)}
                <span className="font-medium">{meal.name}</span>
              </div>
              <Badge variant="outline" className="ml-2">{meal.calories} cal</Badge>
            </div>
            <div className="p-3">
              <p className="text-sm text-muted-foreground mb-3">{meal.description.substring(0, 60)}...</p>
              
              <div>
                <div className="text-xs font-medium mb-1 uppercase">Add to day:</div>
                <div className="flex flex-wrap gap-1">
                  {days.map((day) => (
                    <Button 
                      key={day} 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onAddToDay(meal, day)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" />
                      {day.substring(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UnplacedMealsList;
