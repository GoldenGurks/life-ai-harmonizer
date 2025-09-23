
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import WeeklyPlanTab from './WeeklyPlanTab';
import TinderDishTab from './TinderDishTab';
import TemplatesTab from './TemplatesTab';
import SavedPlansTab from './SavedPlansTab';
import ClearPlanConfirmation from './ClearPlanConfirmation';
import { convertRecipeToMealItem } from './WeeklyPlanTab';
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
  
  // Convert recipes to meal items for Tinder Dish using the existing converter
  const tinderSuggestions: MealItem[] = recipeData.slice(0, 20).map(convertRecipeToMealItem);
  
  const handleAcceptMeal = (meal: MealItem) => {
    addLikedMeal(meal.id);
  };
  
  const handleRejectMeal = (meal: MealItem) => {
    addDislikedMeal(meal.id);
  };
  
  // Dummy functions for WeeklyPlanTab props (can be enhanced later)
  const handleDayChange = (day: string) => {
    console.log('Day changed to:', day);
  };
  
  const handleMealChange = (mealId: string) => {
    console.log('Meal changed:', mealId);
  };
  
  // Empty meal plans for now (can be enhanced with actual data)
  const mealPlans = [];

  return (
    <>
      <TabsContent value="weekly">
        <WeeklyPlanTab 
          currentDay={currentDay} 
          days={days}
          onDayChange={handleDayChange}
          handleMealChange={handleMealChange}
          mealPlans={mealPlans}
        />
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
