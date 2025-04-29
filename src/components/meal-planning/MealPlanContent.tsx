
import React, { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { toast } from 'sonner';

import WeeklyPlanTab from '@/components/meal-planning/WeeklyPlanTab';
import TinderDishTab from '@/components/meal-planning/TinderDishTab';
import SavedPlansTab from '@/components/meal-planning/SavedPlansTab';
import { useMealManager } from './useMealManager';
import { MealItem } from '@/types/meal-planning';
import { convertRecipeToMealItem } from './WeeklyPlanTab';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';

interface MealPlanContentProps {
  activeTab: string;
  currentDay: string;
  days: string[];
  showWeeklySetupModal: boolean;
  setShowWeeklySetupModal: (show: boolean) => void;
}

/**
 * Content component for the meal planning tabs
 */
const MealPlanContent: React.FC<MealPlanContentProps> = ({
  activeTab,
  currentDay,
  days,
  showWeeklySetupModal,
  setShowWeeklySetupModal
}) => {
  const { t } = useLanguage();
  const { isSetupComplete } = useMealPreferences();
  const { mealPlans, handleMealChange, handleAddMealToDay } = useMealManager(currentDay, days);
  const { recommendations } = useRecipeRecommendations({ count: 10 });

  const handleAcceptMeal = (meal: MealItem) => {
    handleAddMealToDay(meal, currentDay);
  };

  const handleRejectMeal = (meal: MealItem) => {
    toast.info(t('mealPlanning.removedFromSuggestions', { name: meal.name }));
  };

  return (
    <>
      {/* Weekly plan tab content */}
      <TabsContent value="weekly" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-12">
            <WeeklyPlanTab 
              currentDay={currentDay}
              days={days}
              onDayChange={() => {}}  // This will be handled in the parent component
              handleMealChange={handleMealChange}
              mealPlans={mealPlans}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setShowWeeklySetupModal(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            {t('mealPlanning.editPlanSettings')}
          </Button>
        </div>
      </TabsContent>

      {/* Meal discovery tab content */}
      <TabsContent value="tinder-dish" className="space-y-4">
        <TinderDishTab 
          suggestions={recommendations.map(convertRecipeToMealItem)}
          onAccept={handleAcceptMeal}
          onReject={handleRejectMeal}
        />
      </TabsContent>

      {/* Saved plans tab content */}
      <TabsContent value="saved" className="space-y-4">
        <SavedPlansTab />
      </TabsContent>
    </>
  );
};

export default MealPlanContent;
