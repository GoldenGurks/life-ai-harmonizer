
import { useState, useEffect } from 'react';
import { WeeklySetupSettings } from '@/components/meal-planning/WeeklySetupModal';
import { MealItem, WeeklyPlan } from '@/types/meal-planning';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { useUserProfile } from '@/hooks/useUserProfile';

/**
 * Custom hook to manage meal planning state
 */
export const useMealPlanningState = () => {
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();
  const { weeklySettings, updateWeeklySettings } = useMealPreferences();
  const { profile, updateProfile } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Modal states
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);
  const [showWeeklySetupModal, setShowWeeklySetupModal] = useState(false);
  const [showClearPlanConfirmation, setShowClearPlanConfirmation] = useState(false);
  
  // New state for the weekly planner workflow
  const [showMealCountSelector, setShowMealCountSelector] = useState(false);
  const [showRecipeSelectionModal, setShowRecipeSelectionModal] = useState(false);
  const [showPlanSuccessModal, setShowPlanSuccessModal] = useState(false);
  const [mealCount, setMealCount] = useState(5);

  /**
   * Handle weekly setup settings
   * @param settings Weekly setup settings
   */
  const handleWeeklySetup = (settings: WeeklySetupSettings) => {
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

  /**
   * Start the new weekly planning workflow
   */
  const startWeeklyPlanning = () => {
    setShowMealCountSelector(true);
  };

  /**
   * Handle meal count confirmation and proceed to recipe selection
   */
  const handleMealCountConfirm = () => {
    setShowMealCountSelector(false);
    setShowRecipeSelectionModal(true);
  };

  /**
   * Handle recipe selection confirmation and create the plan
   * @param selectedRecipes Array of selected recipes
   */
  const handleRecipeSelectionConfirm = (selectedRecipes: MealItem[]) => {
    // Randomly assign recipes to days with proper meal type distribution
    const shuffledDays = [...days].sort(() => Math.random() - 0.5);
    const assignedDays: { [day: string]: { [key: string]: MealItem | undefined } } = {};
    
    // Initialize all days
    days.forEach(day => {
      assignedDays[day] = {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined
      };
    });

    // Separate recipes by type
    const breakfastRecipes = selectedRecipes.filter(r => r.type === 'breakfast');
    const lunchRecipes = selectedRecipes.filter(r => r.type === 'lunch');
    const dinnerRecipes = selectedRecipes.filter(r => r.type === 'dinner');
    const otherRecipes = selectedRecipes.filter(r => !['breakfast', 'lunch', 'dinner'].includes(r.type));

    // Assign breakfast recipes
    breakfastRecipes.forEach((recipe, index) => {
      if (index < shuffledDays.length) {
        const day = shuffledDays[index];
        assignedDays[day].breakfast = recipe;
      }
    });

    // Assign lunch recipes
    lunchRecipes.forEach((recipe, index) => {
      if (index < shuffledDays.length) {
        const day = shuffledDays[index];
        assignedDays[day].lunch = recipe;
      }
    });

    // Assign dinner recipes
    dinnerRecipes.forEach((recipe, index) => {
      if (index < shuffledDays.length) {
        const day = shuffledDays[index];
        assignedDays[day].dinner = recipe;
      }
    });

    // Assign other recipes to lunch by default
    otherRecipes.forEach((recipe, index) => {
      const availableDays = shuffledDays.filter(day => !assignedDays[day].lunch);
      if (availableDays.length > 0 && index < availableDays.length) {
        const day = availableDays[index];
        assignedDays[day].lunch = recipe;
      }
    });

    const newPlan: WeeklyPlan = {
      selectedRecipes,
      assignedDays,
      createdAt: new Date().toISOString()
    };

    if (profile) {
      updateProfile({
        ...profile,
        currentWeekPlan: newPlan
      });
    }

    setShowRecipeSelectionModal(false);
    setShowPlanSuccessModal(true);
  };

  /**
   * Handle viewing the generated plan
   */
  const handleViewGeneratedPlan = () => {
    setActiveTab('weekly');
  };

  /**
   * Handle clear plan request
   */
  const handleClearPlanRequest = () => {
    setShowClearPlanConfirmation(true);
  };

  /**
   * Handle confirmed clear plan
   */
  const handleClearPlanConfirm = () => {
    if (profile) {
      updateProfile({
        ...profile,
        currentWeekPlan: undefined
      });
    }
    setShowClearPlanConfirmation(false);
    toast.success('Weekly plan cleared');
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
    showClearPlanConfirmation,
    setShowClearPlanConfirmation,
    // New weekly planner states
    showMealCountSelector,
    setShowMealCountSelector,
    showRecipeSelectionModal,
    setShowRecipeSelectionModal,
    showPlanSuccessModal,
    setShowPlanSuccessModal,
    mealCount,
    setMealCount,
    weeklySettings,
    handleWeeklySetup,
    handleSetupChoice,
    startWeeklyPlanning,
    handleMealCountConfirm,
    handleRecipeSelectionConfirm,
    handleViewGeneratedPlan,
    handleClearPlanRequest,
    handleClearPlanConfirm
  };
};
