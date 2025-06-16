
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ChefHat } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';

interface WeeklyPlanCardProps {
  currentPlan: any;
  plannedMeals: MealItem[];
  days: string[];
  onAddMeal: () => void;
  getMealForDayAndType: (day: string, mealType: string) => MealItem | undefined;
  onStartPlanning: () => void;
}

const WeeklyPlanCard: React.FC<WeeklyPlanCardProps> = ({
  currentPlan,
  plannedMeals,
  days,
  onAddMeal,
  getMealForDayAndType,
  onStartPlanning
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week's Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {plannedMeals.length} meals planned
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={onAddMeal}>
            <Plus className="h-4 w-4" />
            Add Meal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {currentPlan ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {days.map((day) => {
              const breakfastMeal = getMealForDayAndType(day, 'breakfast');
              const lunchMeal = getMealForDayAndType(day, 'lunch');
              const dinnerMeal = getMealForDayAndType(day, 'dinner');
              
              return (
                <Card key={day} className="overflow-hidden">
                  <div className="p-3 pb-2 text-center border-b">
                    <h3 className="text-sm font-medium">{day.slice(0, 3)}</h3>
                  </div>
                  <CardContent className="p-2 space-y-2">
                    {/* Breakfast */}
                    <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                      {breakfastMeal ? (
                        <>
                          {breakfastMeal.image ? (
                            <img
                              src={breakfastMeal.image}
                              alt={breakfastMeal.name}
                              className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ChefHat className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white px-1">
                              <p className="text-xs font-medium">{breakfastMeal.name}</p>
                              <p className="text-xs">{breakfastMeal.calories} kcal</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ChefHat className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs">Breakfast</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Lunch */}
                    <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                      {lunchMeal ? (
                        <>
                          {lunchMeal.image ? (
                            <img
                              src={lunchMeal.image}
                              alt={lunchMeal.name}
                              className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ChefHat className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white px-1">
                              <p className="text-xs font-medium">{lunchMeal.name}</p>
                              <p className="text-xs">{lunchMeal.calories} kcal</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ChefHat className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs">Lunch</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Dinner */}
                    <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                      {dinnerMeal ? (
                        <>
                          {dinnerMeal.image ? (
                            <img
                              src={dinnerMeal.image}
                              alt={dinnerMeal.name}
                              className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <ChefHat className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white px-1">
                              <p className="text-xs font-medium">{dinnerMeal.name}</p>
                              <p className="text-xs">{dinnerMeal.calories} kcal</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ChefHat className="h-4 w-4 mx-auto mb-1" />
                          <p className="text-xs">Dinner</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-3">No meals planned yet</p>
            <Button onClick={onStartPlanning}>Start Planning</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyPlanCard;
