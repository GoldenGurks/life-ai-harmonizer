
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeeklyPlan } from '@/types/meal-planning';
import DaySlot, { MealType } from './DaySlot';

interface WeekOverviewProps {
  plan: WeeklyPlan;
  onAddMeal: (day: string, mealType: MealType) => void;
}

const WeekOverview: React.FC<WeekOverviewProps> = ({ plan, onAddMeal }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {days.map((day) => {
        const breakfastMeal = plan.assignedDays[day]?.breakfast;
        const lunchMeal = plan.assignedDays[day]?.lunch;
        const dinnerMeal = plan.assignedDays[day]?.dinner;
        
        return (
          <Card key={day} className="overflow-hidden">
            <div className="p-3 pb-2 text-center border-b">
              <h3 className="text-sm font-medium">{day}</h3>
            </div>
            <CardContent className="p-2 space-y-2">
              <DaySlot
                day={day}
                mealType="breakfast"
                meal={breakfastMeal}
                onAdd={onAddMeal}
              />
              <DaySlot
                day={day}
                mealType="lunch"
                meal={lunchMeal}
                onAdd={onAddMeal}
              />
              <DaySlot
                day={day}
                mealType="dinner"
                meal={dinnerMeal}
                onAdd={onAddMeal}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WeekOverview;
