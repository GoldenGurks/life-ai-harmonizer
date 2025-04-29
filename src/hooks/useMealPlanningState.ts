
import { useState, useEffect } from 'react';
import { WeeklySetupSettings } from '@/components/meal-planning/WeeklySetupModal';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Custom hook to manage meal planning state
 */
export const useMealPlanningState = () => {
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Modal states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);
  const [showWeeklySetupModal, setShowWeeklySetupModal] = useState(false);
  
  // Weekly meal setup settings
  const [weeklySettings, setWeeklySettings] = useState<WeeklySetupSettings>(() => {
    const savedSettings = localStorage.getItem('weeklyMealSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : { dishCount: 7, includeBreakfast: true };
  });

  // Save weekly settings to local storage
  useEffect(() => {
    localStorage.setItem('weeklyMealSettings', JSON.stringify(weeklySettings));
  }, [weeklySettings]);

  /**
   * Handle weekly setup settings
   * @param settings Weekly setup settings
   */
  const handleWeeklySetup = (settings: WeeklySetupSettings) => {
    setWeeklySettings(settings);
    localStorage.setItem('weeklyMealSettings', JSON.stringify(settings));
    
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
    setWeeklySettings,
    handleWeeklySetup,
    handleSetupChoice
  };
};
