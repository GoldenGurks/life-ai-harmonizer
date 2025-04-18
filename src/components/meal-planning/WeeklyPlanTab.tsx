
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChefHat, Utensils, Apple, Info, Coffee } from 'lucide-react';
import MealCard from './MealCard';
import DaySelector from './DaySelector';
import { MealItem } from '@/types/meal-planning';

interface WeeklyPlanTabProps {
  currentDay: string;
  days: string[];
  onDayChange: (day: string) => void;
  handleMealChange: (mealId: string) => void;
  mealPlans: {
    id: string;
    name: string;
    day: string;
    meals: MealItem[];
  }[];
}

const WeeklyPlanTab: React.FC<WeeklyPlanTabProps> = ({
  currentDay,
  days,
  onDayChange,
  handleMealChange,
  mealPlans
}) => {
  // Find meals for the current day
  const currentDayMeals = mealPlans.find(plan => plan.day === currentDay)?.meals || [];
  
  const getIconForMealType = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <ChefHat className="h-5 w-5 text-primary mr-2" />;
      case 'lunch':
        return <Utensils className="h-5 w-5 text-secondary mr-2" />;
      case 'dinner':
        return <Utensils className="h-5 w-5 text-accent mr-2" />;
      case 'snack':
        return <Apple className="h-5 w-5 text-primary mr-2" />;
      case 'dessert':
        return <Coffee className="h-5 w-5 text-secondary mr-2" />;
      default:
        return null;
    }
  };

  const getMealTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Weekly Schedule</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" /> 
              April 7-13, 2025
            </Button>
          </div>
        </div>
        <CardDescription>
          View and modify your weekly meal plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DaySelector 
          days={days} 
          currentDay={currentDay} 
          onDayChange={onDayChange} 
        />

        <div className="space-y-6">
          {currentDayMeals.map((meal) => (
            <MealCard
              key={meal.id}
              title={getMealTitle(meal.type)}
              icon={getIconForMealType(meal.type)}
              name={meal.name}
              description={meal.description}
              calories={meal.calories}
              protein={meal.protein}
              tags={meal.tags}
              onMealChange={handleMealChange}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" className="mr-2">Save Plan</Button>
          <Button>
            <Info className="h-4 w-4 mr-2" />
            View Nutrition Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyPlanTab;
