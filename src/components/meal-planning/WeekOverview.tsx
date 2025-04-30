
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WeeklyPlan, MealItem } from '@/types/meal-planning';
import DaySlot, { MealType } from './DaySlot';
import RecipeDetailModal from './RecipeDetailModal';

interface WeekOverviewProps {
  plan: WeeklyPlan;
  onAddMeal: (day: string, mealType: MealType) => void;
  onUpdatePlan?: (updatedPlan: WeeklyPlan) => void;
}

const WeekOverview: React.FC<WeekOverviewProps> = ({ plan, onAddMeal, onUpdatePlan }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // State for drag and drop
  const [dragData, setDragData] = useState<{ day: string; mealType: MealType; meal: MealItem } | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ day: string; mealType: MealType } | null>(null);
  
  // State for recipe detail modal
  const [selectedMeal, setSelectedMeal] = useState<MealItem | undefined>(undefined);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handle drag start
  const handleDragStart = (day: string, mealType: MealType, meal: MealItem) => {
    setDragData({ day, mealType, meal });
  };

  // Handle drag over
  const handleDragOver = (day: string, mealType: MealType) => {
    setDragOverSlot({ day, mealType });
  };

  // Handle drop
  const handleDrop = (targetDay: string, targetMealType: MealType) => {
    if (!dragData) return;
    
    const { day: sourceDay, mealType: sourceMealType, meal } = dragData;
    
    // Don't do anything if dropping in the same slot
    if (sourceDay === targetDay && sourceMealType === targetMealType) {
      setDragData(null);
      setDragOverSlot(null);
      return;
    }
    
    // Create a deep copy of the current plan
    const updatedPlan: WeeklyPlan = {
      ...plan,
      assignedDays: { ...plan.assignedDays }
    };
    
    // Initialize days if they don't exist
    if (!updatedPlan.assignedDays[sourceDay]) {
      updatedPlan.assignedDays[sourceDay] = {};
    }
    
    if (!updatedPlan.assignedDays[targetDay]) {
      updatedPlan.assignedDays[targetDay] = {};
    }
    
    // Create deep copies of the source and target days
    updatedPlan.assignedDays[sourceDay] = { ...updatedPlan.assignedDays[sourceDay] };
    updatedPlan.assignedDays[targetDay] = { ...updatedPlan.assignedDays[targetDay] };
    
    // Move the meal from source to target
    updatedPlan.assignedDays[targetDay][targetMealType] = meal;
    updatedPlan.assignedDays[sourceDay][sourceMealType] = undefined;
    
    // Update the plan
    if (onUpdatePlan) {
      onUpdatePlan(updatedPlan);
    }
    
    // Reset drag state
    setDragData(null);
    setDragOverSlot(null);
  };

  // Handle meal click to open detail modal
  const handleMealClick = (meal: MealItem) => {
    setSelectedMeal(meal);
    setIsDetailModalOpen(true);
  };

  return (
    <>
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
                  onMealClick={handleMealClick}
                  onDragStart={handleDragStart}
                  onDrop={() => handleDrop(day, 'breakfast')}
                  isDragOver={dragOverSlot?.day === day && dragOverSlot?.mealType === 'breakfast'}
                />
                <DaySlot
                  day={day}
                  mealType="lunch"
                  meal={lunchMeal}
                  onAdd={onAddMeal}
                  onMealClick={handleMealClick}
                  onDragStart={handleDragStart}
                  onDrop={() => handleDrop(day, 'lunch')}
                  isDragOver={dragOverSlot?.day === day && dragOverSlot?.mealType === 'lunch'}
                />
                <DaySlot
                  day={day}
                  mealType="dinner"
                  meal={dinnerMeal}
                  onAdd={onAddMeal}
                  onMealClick={handleMealClick}
                  onDragStart={handleDragStart}
                  onDrop={() => handleDrop(day, 'dinner')}
                  isDragOver={dragOverSlot?.day === day && dragOverSlot?.mealType === 'dinner'}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RecipeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        recipe={selectedMeal}
      />
    </>
  );
};

export default WeekOverview;
