
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChefHat, Coffee, Salad, Utensils, ArrowLeft, ImageOff } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';

interface EnhancedAddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMealSelect: (meal: MealItem, day: string, mealType: string) => void;
}

const EnhancedAddMealModal: React.FC<EnhancedAddMealModalProps> = ({
  isOpen,
  onClose,
  onMealSelect,
}) => {
  const [step, setStep] = useState<'mealType' | 'recipeSelection' | 'daySelection'>('mealType');
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedRecipe, setSelectedRecipe] = useState<MealItem | null>(null);
  const { recommendations } = useRecipeRecommendations({ count: 9 });
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Coffee },
    { id: 'lunch', label: 'Lunch', icon: Salad },
    { id: 'dinner', label: 'Dinner', icon: Utensils },
  ];

  const handleMealTypeSelect = (mealType: string) => {
    setSelectedMealType(mealType);
    setStep('recipeSelection');
  };

  const handleRecipeSelect = (recipe: MealItem) => {
    setSelectedRecipe(recipe);
    setStep('daySelection');
  };

  const handleDaySelect = (day: string) => {
    if (selectedRecipe && selectedMealType) {
      onMealSelect(selectedRecipe, day, selectedMealType);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('mealType');
    setSelectedMealType('');
    setSelectedRecipe(null);
    onClose();
  };

  const handleBack = () => {
    if (step === 'recipeSelection') {
      setStep('mealType');
      setSelectedMealType('');
    } else if (step === 'daySelection') {
      setStep('recipeSelection');
      setSelectedRecipe(null);
    }
  };

  // Filter recipes by meal type (simplified logic)
  const filteredRecipes = recommendations
    .map(convertRecipeToMealItem)
    .filter(recipe => {
      if (selectedMealType === 'breakfast') {
        return recipe.type === 'breakfast' || recipe.name.toLowerCase().includes('breakfast');
      }
      return recipe.type !== 'breakfast';
    })
    .slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== 'mealType' && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Add Meal to Plan
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === 'mealType' && (
            <div>
              <h4 className="font-medium mb-4 text-center">Select Meal Type</h4>
              <div className="grid grid-cols-1 gap-3">
                {mealTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant="outline"
                      className="flex items-center gap-3 h-16 justify-start"
                      onClick={() => handleMealTypeSelect(type.id)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-lg">{type.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'recipeSelection' && (
            <div>
              <h4 className="font-medium mb-4 text-center">Choose a {selectedMealType}</h4>
              <div className="grid grid-cols-1 gap-3">
                {filteredRecipes.map((recipe) => (
                  <Button
                    key={recipe.id}
                    variant="outline"
                    className="flex items-center gap-3 h-20 justify-start p-3"
                    onClick={() => handleRecipeSelect(recipe)}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ImageOff className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{recipe.name}</p>
                      <p className="text-xs text-muted-foreground">{recipe.calories} kcal</p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 'daySelection' && (
            <div>
              <h4 className="font-medium mb-4 text-center">Select Day</h4>
              <div className="grid grid-cols-2 gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDaySelect(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAddMealModal;
