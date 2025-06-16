
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChefHat, Coffee, Salad, Utensils } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMealSelect: (meal: MealItem, day: string, mealType: string) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onMealSelect,
}) => {
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const { recommendations } = useRecipeRecommendations({ count: 3 });
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: Salad },
    { id: 'dinner', label: 'Dinner', icon: Utensils },
  ];

  const handleMealTypeSelect = (mealType: string) => {
    setSelectedMealType(mealType);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
  };

  const handleConfirm = () => {
    if (selectedMealType && selectedDay && recommendations.length > 0) {
      const randomMeal = convertRecipeToMealItem(recommendations[0]);
      onMealSelect(randomMeal, selectedDay, selectedMealType);
      onClose();
      setSelectedMealType('');
      setSelectedDay('');
    }
  };

  const canConfirm = selectedMealType && selectedDay;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Add Meal to Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Select Meal Type</h4>
            <div className="grid grid-cols-3 gap-2">
              {mealTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={selectedMealType === type.id ? 'default' : 'outline'}
                    className="flex flex-col gap-1 h-auto py-3"
                    onClick={() => handleMealTypeSelect(type.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{type.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Select Day</h4>
            <div className="grid grid-cols-2 gap-2">
              {days.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!canConfirm}
              className="flex-1"
            >
              Add Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealModal;
