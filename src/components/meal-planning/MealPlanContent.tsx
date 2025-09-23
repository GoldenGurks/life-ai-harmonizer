
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import WeeklyPlanTab from './WeeklyPlanTab';
import TinderDishTab from './TinderDishTab';
import TemplatesTab from './TemplatesTab';
import SavedPlansTab from './SavedPlansTab';
import ClearPlanConfirmation from './ClearPlanConfirmation';
import { recipeData } from '@/data/recipeDatabase';
import { MealItem } from '@/types/meal-planning';
import { useUserProfile } from '@/hooks/useUserProfile';

interface MealPlanContentProps {
  activeTab: string;
  currentDay: string;
  days: string[];
  showWeeklySetupModal: boolean;
  setShowWeeklySetupModal: (show: boolean) => void;
  showClearPlanConfirmation: boolean;
  setShowClearPlanConfirmation: (show: boolean) => void;
  handleClearPlanRequest: () => void;
  handleClearPlanConfirm: () => void;
}

/**
 * Content component for the meal planning tabs
 */
const MealPlanContent: React.FC<MealPlanContentProps> = ({
  activeTab,
  currentDay,
  days,
  showWeeklySetupModal,
  setShowWeeklySetupModal,
  showClearPlanConfirmation,
  setShowClearPlanConfirmation,
  handleClearPlanRequest,
  handleClearPlanConfirm
}) => {
  const { addLikedMeal, addDislikedMeal } = useUserProfile();
  
  // Convert recipes to meal items for Tinder Dish
  const tinderSuggestions: MealItem[] = recipeData.slice(0, 20).map(recipe => ({
    id: recipe.id,
    name: recipe.title,
    description: '',
    image: recipe.image,
    calories: recipe.nutrition?.calories || 0,
    protein: recipe.nutrition?.protein || 0,
    carbs: recipe.nutrition?.carbs || 0,
    fat: recipe.nutrition?.fat || 0,
    ingredients: recipe.ingredients?.map(ing => typeof ing === 'string' ? ing : ing.name) || [],
    preparationTime: 15,
    cookingTime: 25,
    type: 'lunch',
    tags: recipe.tags || []
  }));
  
  const handleAcceptMeal = (meal: MealItem) => {
    addLikedMeal(meal.id);
  };
  
  const handleRejectMeal = (meal: MealItem) => {
    addDislikedMeal(meal.id);
  };

  return (
    <>
      <TabsContent value="weekly">
        <WeeklyPlanTab currentDay={currentDay} days={days} />
      </TabsContent>
      
      <TabsContent value="tinder">
        <TinderDishTab 
          suggestions={tinderSuggestions}
          onAccept={handleAcceptMeal}
          onReject={handleRejectMeal}
        />
      </TabsContent>
      
      <TabsContent value="discovery">
        <TemplatesTab />
      </TabsContent>
      
      <TabsContent value="saved">
        <SavedPlansTab />
      </TabsContent>

      <ClearPlanConfirmation
        isOpen={showClearPlanConfirmation}
        onClose={() => setShowClearPlanConfirmation(false)}
        onConfirm={handleClearPlanConfirm}
      />
    </>
  );
};

export default MealPlanContent;
