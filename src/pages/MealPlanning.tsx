
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
    weeklySettings, handleWeeklySetup, handleSetupChoice
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
      {/* Header section */}
      <MealPlanHeader 
        onGeneratePlan={generateMealPlan}
        onOpenPreferences={handleOpenPreferences}
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
    </Layout>
  );
};

export default MealPlanning;
