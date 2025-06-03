
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

// Import components
import WelcomeModal from '@/components/meal-planning/WelcomeModal';
import QuickSetupModal from '@/components/meal-planning/QuickSetupModal';
import DetailedPlanningModal from '@/components/meal-planning/DetailedPlanningModal';
import WeeklySetupModal from '@/components/meal-planning/WeeklySetupModal';
import MealPlanHeader from '@/components/meal-planning/MealPlanHeader';
import MealPlanTabs from '@/components/meal-planning/MealPlanTabs';
import MealPlanContent from '@/components/meal-planning/MealPlanContent';
import MealCountSelector from '@/components/meal-planning/MealCountSelector';
import RecipeSelectionModal from '@/components/meal-planning/RecipeSelectionModal';
import PlanSuccessModal from '@/components/meal-planning/PlanSuccessModal';

// Import hooks
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { useLanguage } from '@/hooks/useLanguage';
import { useMealPlanningState } from '@/hooks/useMealPlanningState';

/**
 * MealPlanning component handles the main meal planning functionality
 * Allows users to create weekly meal plans with breakfast, lunch, and dinner options
 */
const MealPlanning = () => {
  const { t } = useLanguage();
  
  // Get state from custom hooks
  const { 
    activeTab, setActiveTab,
    currentDay, setCurrentDay, days,
    showWelcomeModal, setShowWelcomeModal,
    showQuickSetupModal, setShowQuickSetupModal,
    showDetailedPlanningModal, setShowDetailedPlanningModal,
    showWeeklySetupModal, setShowWeeklySetupModal,
    // New weekly planner states
    showMealCountSelector, setShowMealCountSelector,
    showRecipeSelectionModal, setShowRecipeSelectionModal,
    showPlanSuccessModal, setShowPlanSuccessModal,
    mealCount, setMealCount,
    weeklySettings, handleWeeklySetup, handleSetupChoice,
    startWeeklyPlanning, handleMealCountConfirm,
    handleRecipeSelectionConfirm, handleViewGeneratedPlan
  } = useMealPlanningState();
  
  // Get user preferences
  const { isSetupComplete } = useMealPreferences();
  
  // Show welcome modal for new users
  useEffect(() => {
    if (!isSetupComplete) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isSetupComplete, setShowWelcomeModal]);

  /**
   * Generate meal plan based on user preferences
   */
  const generateMealPlan = () => {
    if (!isSetupComplete) {
      toast.error(t('mealPlanning.completeSetupFirst'));
      setShowWelcomeModal(true);
      return;
    }

    setShowWeeklySetupModal(true);
  };

  /**
   * Open preferences modal
   */
  const handleOpenPreferences = () => {
    setShowDetailedPlanningModal(true);
  };

  return (
    <Layout>
      {/* Meal Count Selector (Conditional Rendering) */}
      {showMealCountSelector && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
          <MealCountSelector
            mealCount={mealCount}
            onMealCountChange={setMealCount}
            onConfirm={handleMealCountConfirm}
          />
        </div>
      )}

      {/* Header section */}
      <MealPlanHeader 
        onGeneratePlan={generateMealPlan}
        onOpenPreferences={handleOpenPreferences}
        onStartWeeklyPlanning={startWeeklyPlanning}
      />

      {/* Tabs navigation */}
      <MealPlanTabs activeTab={activeTab} onValueChange={setActiveTab}>
        <MealPlanContent
          activeTab={activeTab}
          currentDay={currentDay}
          days={days}
          showWeeklySetupModal={showWeeklySetupModal}
          setShowWeeklySetupModal={setShowWeeklySetupModal}
        />
      </MealPlanTabs>
      
      {/* Modals */}
      <WelcomeModal 
        open={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
        onSetupChoice={handleSetupChoice} 
      />
      
      <QuickSetupModal 
        open={showQuickSetupModal} 
        onClose={() => setShowQuickSetupModal(false)} 
      />
      
      <DetailedPlanningModal 
        open={showDetailedPlanningModal} 
        onClose={() => setShowDetailedPlanningModal(false)} 
      />
      
      <WeeklySetupModal
        open={showWeeklySetupModal}
        onClose={() => setShowWeeklySetupModal(false)}
        onSetup={handleWeeklySetup}
        initialSettings={weeklySettings}
      />

      {/* New Weekly Planner Modals */}
      <RecipeSelectionModal
        isOpen={showRecipeSelectionModal}
        onClose={() => setShowRecipeSelectionModal(false)}
        mealCount={mealCount}
        onConfirmSelection={handleRecipeSelectionConfirm}
      />

      <PlanSuccessModal
        isOpen={showPlanSuccessModal}
        onClose={() => setShowPlanSuccessModal(false)}
        onViewPlan={handleViewGeneratedPlan}
      />
    </Layout>
  );
};

export default MealPlanning;
