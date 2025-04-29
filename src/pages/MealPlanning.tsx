
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Settings, Edit, Calendar, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import WelcomeModal from '@/components/meal-planning/WelcomeModal';
import QuickSetupModal from '@/components/meal-planning/QuickSetupModal';
import DetailedPlanningModal from '@/components/meal-planning/DetailedPlanningModal';
import WeeklySetupModal, { WeeklySetupSettings } from '@/components/meal-planning/WeeklySetupModal';
import WeeklyPlanTab from '@/components/meal-planning/WeeklyPlanTab';
import LanguageSelector from '@/components/meal-planning/LanguageSelector';

import SavedPlansTab from '@/components/meal-planning/SavedPlansTab';
import TinderDishTab from '@/components/meal-planning/TinderDishTab';
import { MealPlan, MealItem } from '@/types/meal-planning';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Interface for displaying the weekly meal plan
 */
interface WeeklyPlanDisplay {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

/**
 * MealPlanning component handles the main meal planning functionality
 * Allows users to create weekly meal plans with breakfast, lunch, and dinner options
 */
const MealPlanning = () => {
  const { toast: toastNotification } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Get user preferences
  const { preferences, isSetupComplete } = useMealPreferences();
  
  // Modal states
  const [isNewUser, setIsNewUser] = useState(!isSetupComplete);
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

  // Get number of dishes from settings
  const dishCount = weeklySettings.dishCount;

  // Load recipe recommendations with the current dish count
  const { recommendations } = useRecipeRecommendations({ count: dishCount });

  // State for meal plans
  const [mealPlans, setMealPlans] = useState<WeeklyPlanDisplay[]>([]);

  // Initialize meal plans based on recommendations
  useEffect(() => {
    // Skip if no recommendations are available
    if (recommendations.length === 0) return;

    // Create a plan object for each day of the week
    const newPlans = days.map((day, idx) => {
      const recipe = recommendations[idx];
      const mealItem = recipe
        ? convertRecipeToMealItem(recipe)
        : undefined;

      return {
        id: day.toLowerCase(),
        name: `${day}'s Plan`,
        day,
        meals: mealItem ? [mealItem] : [],
        totalNutrition: mealItem
          ? {
              calories: mealItem.calories,
              protein: mealItem.protein,
              carbs: mealItem.carbs,
              fat: mealItem.fat,
              fiber: mealItem.fiber,
            }
          : undefined,
      } as WeeklyPlanDisplay;
    });

    setMealPlans(newPlans);
  }, [recommendations, days]);

  // Save weekly settings to local storage
  useEffect(() => {
    localStorage.setItem('weeklyMealSettings', JSON.stringify(weeklySettings));
  }, [weeklySettings]);

  // Show welcome modal for new users
  useEffect(() => {
    if (isNewUser) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

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
   * Handle meal change by replacing a meal in the current day's plan
   * @param mealId ID of the meal to change
   */
  const handleMealChange = (mealId: string) => {
    if (!isSetupComplete) {
      toast.error(t('mealPlanning.completeSetupFirst'));
      return;
    }

    toastNotification({
      title: t('mealPlanning.mealOptions'),
      description: t('mealPlanning.showingAlternatives'),
    });
    
    // Find the current plan and meal to replace
    const currentPlan = mealPlans.find(plan => plan.day === currentDay);
    if (!currentPlan) return;
    
    const mealToReplace = currentPlan.meals.find(meal => meal.id === mealId);
    if (!mealToReplace) return;
    
    // Find a replacement from recommendations
    const replacementMeal = recommendations.find(recipe => 
      recipe.id !== mealId
    );
    
    if (!replacementMeal) {
      toast.error(t('mealPlanning.noAlternativesAvailable'));
      return;
    }
    
    // Convert to meal item and update the plan
    const newMealItem = convertRecipeToMealItem(replacementMeal);
    
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === currentDay) {
        const updatedMeals = plan.meals.map(meal => 
          meal.id === mealId ? newMealItem : meal
        );
        
        const totalNutrition = {
          calories: updatedMeals.reduce((sum, meal) => sum + meal.calories, 0),
          protein: updatedMeals.reduce((sum, meal) => sum + meal.protein, 0),
          carbs: updatedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0),
          fat: updatedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0),
          fiber: updatedMeals.reduce((sum, meal) => sum + (meal.fiber || 0), 0)
        };
        
        return {
          ...plan,
          meals: updatedMeals,
          totalNutrition
        };
      }
      return plan;
    });
    
    setMealPlans(updatedPlans);
    toast.success(t('mealPlanning.mealUpdated'));
  };

  /**
   * Handle adding a meal to a specific day
   * @param meal Meal to add
   * @param day Day to add the meal to
   */
  const handleAddMealToDay = (meal: MealItem, day: string) => {
    const dayPlan = mealPlans.find(plan => plan.day === day);
    if (!dayPlan) return;
    
    const hasMealType = dayPlan.meals.some(existingMeal => existingMeal.type === meal.type);
    
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === day) {
        const updatedMeals = hasMealType
          ? plan.meals.map(existingMeal => 
              existingMeal.type === meal.type ? meal : existingMeal
            )
          : [...plan.meals, meal];
        
        const totalNutrition = {
          calories: updatedMeals.reduce((sum, m) => sum + m.calories, 0),
          protein: updatedMeals.reduce((sum, m) => sum + m.protein, 0),
          carbs: updatedMeals.reduce((sum, m) => sum + (m.carbs || 0), 0),
          fat: updatedMeals.reduce((sum, m) => sum + (m.fat || 0), 0),
          fiber: updatedMeals.reduce((sum, m) => sum + (m.fiber || 0), 0)
        };
        
        return {
          ...plan,
          meals: updatedMeals,
          totalNutrition
        };
      }
      return plan;
    });
    
    setMealPlans(updatedPlans);
    toast.success(t('mealPlanning.mealAdded', { name: meal.name, day }));
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
   * Open preferences modal
   */
  const handleOpenPreferences = () => {
    setShowDetailedPlanningModal(true);
  };

  /**
   * Handle accepting a meal in the Tinder-style interface
   * @param meal Meal to accept
   */
  const handleAcceptMeal = (meal: MealItem) => {
    handleAddMealToDay(meal, currentDay);
  };

  /**
   * Handle rejecting a meal in the Tinder-style interface
   * @param meal Meal to reject
   */
  const handleRejectMeal = (meal: MealItem) => {
    toast.info(t('mealPlanning.removedFromSuggestions', { name: meal.name }));
  };

  return (
    <Layout>
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 uppercase">{t('mealPlanning.title')}</h1>
        <p className="text-muted-foreground">
          {t('mealPlanning.subtitle')}
        </p>
      </div>

      {/* Tabs navigation */}
      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <TabsList className="h-auto flex-wrap">
            <TabsTrigger value="weekly" className="uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('mealPlanning.weeklyPlan')}
            </TabsTrigger>
            <TabsTrigger value="tinder-dish" className="uppercase flex items-center gap-2">
              <List className="h-4 w-4" />
              {t('mealPlanning.mealDiscovery')}
            </TabsTrigger>
            <TabsTrigger value="saved" className="uppercase">{t('mealPlanning.savedPlans')}</TabsTrigger>
          </TabsList>
          <div className="flex gap-2 flex-wrap">
            <LanguageSelector />
            <Button variant="outline" onClick={handleOpenPreferences} className="gap-2">
              <Settings className="h-4 w-4" />
              {t('mealPlanning.preferences')}
            </Button>
            <Button onClick={generateMealPlan} className="gap-2 bg-primary hover:bg-primary/90">
              <RefreshCw className="h-4 w-4" />
              {t('mealPlanning.generateAIPlan')}
            </Button>
          </div>
        </div>

        {/* Weekly plan tab content */}
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-12">
              <WeeklyPlanTab 
                currentDay={currentDay}
                days={days}
                onDayChange={setCurrentDay}
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
      </Tabs>
      
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
