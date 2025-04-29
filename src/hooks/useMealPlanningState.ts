
import { useState, useEffect } from 'react';
import { WeeklySetupSettings } from '@/components/meal-planning/WeeklySetupModal';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useMealPreferences } from '@/hooks/useMealPreferences';

/**
 * Custom hook to manage meal planning state
 */
export const useMealPlanningState = () => {
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();
  const { weeklySettings, updateWeeklySettings } = useMealPreferences();
  
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Modal states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);
  const [showWeeklySetupModal, setShowWeeklySetupModal] = useState(false);

  /**
   * Handle weekly setup settings
   * @param settings Weekly setup settings
   */
  const handleWeeklySetup = (settings: WeeklySetupSettings) => {
    // Update the weekly settings using our central preferences hook
    updateWeeklySettings(settings);
    
    toastNotification({
      title: t('mealPlanning.aiPlanGenerated'),
      description: t('mealPlanning.personalizedPlanCreated'),
    });
  };

  /**
   * Handle setup choice
   * @param choice Setup choice ('quick' or 'detailed')
   */
  const handleSetupChoice = (choice: 'quick' | 'detailed') => {
    if (choice === 'quick') {
      setShowQuickSetupModal(true);
    } else {
      setShowDetailedPlanningModal(true);
    }
    setShowWelcomeModal(false);
  };

  return {
    activeTab,
    setActiveTab,
    currentDay,
    setCurrentDay,
    days,
    showWelcomeModal,
    setShowWelcomeModal,
    showQuickSetupModal,
    setShowQuickSetupModal,
    showDetailedPlanningModal,
    setShowDetailedPlanningModal,
    showWeeklySetupModal,
    setShowWeeklySetupModal,
    weeklySettings,
    handleWeeklySetup,
    handleSetupChoice
  };
};
