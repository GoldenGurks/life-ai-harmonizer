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
import UnplacedMealsList from '@/components/meal-planning/UnplacedMealsList';
import SavedPlansTab from '@/components/meal-planning/SavedPlansTab';
import TemplatesTab from '@/components/meal-planning/TemplatesTab';
import TinderDishTab from '@/components/meal-planning/TinderDishTab';
import { MealPlan, MealItem } from '@/types/meal-planning';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { mealSuggestionService } from '@/services/mealSuggestionService';
import { toast } from 'sonner';

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

const MealPlanning = () => {
  const { toast: toastNotification } = useToast();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const { preferences, isSetupComplete } = useMealPreferences();
  
  const [isNewUser, setIsNewUser] = useState(!isSetupComplete);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);
  
  const [showWeeklySetupModal, setShowWeeklySetupModal] = useState(false);
  const [weeklySettings, setWeeklySettings] = useState<WeeklySetupSettings>(() => {
    const savedSettings = localStorage.getItem('weeklyMealSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : { dishCount: 7, includeBreakfast: true };
  });
  
  const [unplacedMeals, setUnplacedMeals] = useState<MealItem[]>([]);
  
  const [mealSuggestions, setMealSuggestions] = useState<MealItem[]>([]);

  const initialMealPlan: WeeklyPlanDisplay = {
    id: '1',
    name: 'Balanced Week',
    day: 'Monday',
    meals: [
      {
        id: '1',
        name: 'Greek Yogurt with Berries',
        description: 'Protein-rich Greek yogurt topped with fresh berries and honey',
        calories: 320,
        protein: 18,
        carbs: 35,
        fat: 10,
        type: 'breakfast',
        tags: ['high-protein', 'quick'],
        preparationTime: 5,
        cookingTime: 0,
        ingredients: [
          { name: 'Greek yogurt', amount: '200', unit: 'g' },
          { name: 'Mixed berries', amount: '100', unit: 'g' },
          { name: 'Honey', amount: '1', unit: 'tbsp' }
        ],
        instructions: ['Mix all ingredients in a bowl and enjoy.'],
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
        nutritionScore: 8
      },
      {
        id: '2',
        name: 'Mediterranean Salad',
        description: 'Fresh greens with feta cheese, olives, tomatoes, and olive oil dressing',
        calories: 450,
        protein: 12,
        carbs: 22,
        fat: 32,
        type: 'lunch',
        tags: ['vegetarian', 'fresh'],
        preparationTime: 15,
        cookingTime: 0,
        ingredients: [
          { name: 'Mixed greens', amount: '100', unit: 'g' },
          { name: 'Feta cheese', amount: '50', unit: 'g' },
          { name: 'Olives', amount: '30', unit: 'g' },
          { name: 'Cherry tomatoes', amount: '100', unit: 'g' },
          { name: 'Olive oil', amount: '1', unit: 'tbsp' }
        ],
        instructions: ['Combine all ingredients in a bowl', 'Drizzle with olive oil and toss'],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        nutritionScore: 7
      },
      {
        id: '3',
        name: 'Grilled Salmon with Vegetables',
        description: 'Wild-caught salmon with steamed broccoli and sweet potatoes',
        calories: 580,
        protein: 32,
        carbs: 30,
        fat: 28,
        type: 'dinner',
        tags: ['high-protein', 'omega-3'],
        preparationTime: 10,
        cookingTime: 25,
        ingredients: [
          { name: 'Salmon fillet', amount: '150', unit: 'g' },
          { name: 'Broccoli', amount: '100', unit: 'g' },
          { name: 'Sweet potato', amount: '150', unit: 'g' },
          { name: 'Olive oil', amount: '1', unit: 'tbsp' },
          { name: 'Lemon', amount: '1', unit: 'slice' }
        ],
        instructions: [
          'Season salmon with salt and pepper',
          'Grill for about 4 minutes on each side',
          'Steam broccoli and sweet potatoes'
        ],
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        nutritionScore: 9
      },
      {
        id: '4',
        name: 'Apple with Almond Butter',
        description: 'Sliced apple with 2 tbsp natural almond butter',
        calories: 210,
        protein: 5,
        carbs: 25,
        fat: 12,
        type: 'snack',
        tags: ['quick', 'fiber'],
        preparationTime: 2,
        cookingTime: 0,
        ingredients: [
          { name: 'Apple', amount: '1', unit: 'medium' },
          { name: 'Almond butter', amount: '2', unit: 'tbsp' }
        ],
        instructions: ['Slice apple and serve with almond butter'],
        image: 'https://images.unsplash.com/photo-1502741384106-56538287cff6',
        nutritionScore: 6
      }
    ]
  };

  const [mealPlans, setMealPlans] = useState<WeeklyPlanDisplay[]>([initialMealPlan]);

  useEffect(() => {
    localStorage.setItem('weeklyMealSettings', JSON.stringify(weeklySettings));
  }, [weeklySettings]);

  useEffect(() => {
    if (isNewUser) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (isSetupComplete) {
      const hasGeneratedBefore = localStorage.getItem('hasGeneratedMealPlan');
      if (!hasGeneratedBefore) {
        setShowWeeklySetupModal(true);
      } else {
        generateMealSuggestions();
      }
    }
  }, [isNewUser, isSetupComplete]);

  const generateMealSuggestions = () => {
    if (!preferences) return;
    
    localStorage.setItem('hasGeneratedMealPlan', 'true');
    
    const newPlans: WeeklyPlanDisplay[] = [];
    let allUnplacedMeals: MealItem[] = [];
    let allSuggestions: MealItem[] = [];
    
    if (!weeklySettings.includeBreakfast) {
      const extraLunchMeals = mealSuggestionService.generateSuggestions(
        preferences, 
        Math.ceil(weeklySettings.dishCount * 0.6), 
        'lunch'
      );
      
      const extraDinnerMeals = mealSuggestionService.generateSuggestions(
        preferences, 
        Math.ceil(weeklySettings.dishCount * 0.6), 
        'dinner'
      );
      
      allUnplacedMeals = [...extraLunchMeals, ...extraDinnerMeals];
      setUnplacedMeals(allUnplacedMeals);
    } else {
      setUnplacedMeals([]);
    }
    
    days.forEach((day) => {
      let dayMeals: MealItem[] = [];
      
      if (weeklySettings.includeBreakfast) {
        const breakfastMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'breakfast');
        dayMeals = [...dayMeals, ...breakfastMeals];
        allSuggestions = [...allSuggestions, ...breakfastMeals];
      }
      
      const lunchMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'lunch');
      const dinnerMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'dinner');
      
      dayMeals = [...dayMeals, ...lunchMeals, ...dinnerMeals];
      allSuggestions = [...allSuggestions, ...lunchMeals, ...dinnerMeals];
      
      const totalCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      const totalProtein = dayMeals.reduce((sum, meal) => sum + meal.protein, 0);
      const totalCarbs = dayMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
      const totalFat = dayMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
      const totalFiber = dayMeals.reduce((sum, meal) => sum + (meal.fiber || 0), 0);
      
      const dayPlan: WeeklyPlanDisplay = {
        id: day.toLowerCase(),
        name: `${day}'s Plan`,
        day: day,
        meals: dayMeals,
        totalNutrition: {
          calories: totalCalories,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat,
          fiber: totalFiber
        }
      };
      
      newPlans.push(dayPlan);
    });
    
    setMealPlans(newPlans);
    
    const additionalSuggestions = mealSuggestionService.generateSuggestions(
      preferences,
      10,
      'any'
    );
    
    setMealSuggestions([...allSuggestions, ...additionalSuggestions]);
  };

  const generateAIMealPlan = () => {
    if (!isSetupComplete) {
      toast.error("Please complete your meal preferences setup first");
      setShowWelcomeModal(true);
      return;
    }

    setShowWeeklySetupModal(true);
  };

  const handleWeeklySetup = (settings: WeeklySetupSettings) => {
    setWeeklySettings(settings);
    
    toastNotification({
      title: "AI-Generated Plan",
      description: "Your personalized meal plan is being created based on your preferences.",
    });
    
    setTimeout(() => {
      generateMealSuggestions();
      
      toastNotification({
        title: "Meal Plan Ready!",
        description: "Your new meal plan has been created and is ready to review.",
      });
    }, 1000);
  };

  const handleMealChange = (mealId: string) => {
    if (!isSetupComplete) {
      toast.error("Please complete your meal preferences setup first");
      return;
    }

    toastNotification({
      title: "Meal Options",
      description: "Showing alternative meals based on your preferences and nutritional goals.",
    });
    
    const currentPlan = mealPlans.find(plan => plan.day === currentDay);
    if (!currentPlan) return;
    
    const mealToReplace = currentPlan.meals.find(meal => meal.id === mealId);
    if (!mealToReplace) return;
    
    const replacementMeals = mealSuggestionService.generateSuggestions(preferences, 1, mealToReplace.type);
    if (replacementMeals.length === 0) return;
    
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === currentDay) {
        const updatedMeals = plan.meals.map(meal => 
          meal.id === mealId ? replacementMeals[0] : meal
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
    toast.success(`Meal updated successfully!`);
  };

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
    
    setUnplacedMeals(current => current.filter(m => m.id !== meal.id));
    
    toast.success(`Added ${meal.name} to ${day}`);
  };

  const handleSetupChoice = (choice: 'quick' | 'detailed') => {
    if (choice === 'quick') {
      setShowQuickSetupModal(true);
    } else {
      setShowDetailedPlanningModal(true);
    }
    setShowWelcomeModal(false);
  };

  const handleOpenPreferences = () => {
    setShowDetailedPlanningModal(true);
  };

  const handleAcceptMeal = (meal: MealItem) => {
    handleAddMealToDay(meal, currentDay);
  };

  const handleRejectMeal = (meal: MealItem) => {
    setMealSuggestions(current => current.filter(m => m.id !== meal.id));
    toast.info(`Removed ${meal.name} from suggestions`);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 uppercase">Meal Planning</h1>
        <p className="text-muted-foreground">
          Create and manage your personalized meal plans with AI assistance.
        </p>
      </div>

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="weekly" className="uppercase">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly Plan
            </TabsTrigger>
            <TabsTrigger value="tinder-dish" className="uppercase">
              <List className="h-4 w-4 mr-2" />
              Tinder Dish
            </TabsTrigger>
            <TabsTrigger value="saved" className="uppercase">Saved Plans</TabsTrigger>
            <TabsTrigger value="templates" className="uppercase">Templates</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenPreferences} className="gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </Button>
            <Button onClick={generateAIMealPlan} className="gap-2 bg-primary hover:bg-primary/90">
              <RefreshCw className="h-4 w-4" />
              Generate AI Plan
            </Button>
          </div>
        </div>

        <TabsContent value="weekly" className="space-y-4">
          {unplacedMeals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 lg:col-span-3">
                <UnplacedMealsList 
                  meals={unplacedMeals} 
                  onAddToDay={handleAddMealToDay} 
                />
              </div>
              <div className="md:col-span-9 lg:col-span-9">
                <WeeklyPlanTab 
                  currentDay={currentDay}
                  days={days}
                  onDayChange={setCurrentDay}
                  handleMealChange={handleMealChange}
                  mealPlans={mealPlans}
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" onClick={() => setShowWeeklySetupModal(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Plan Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {unplacedMeals.length === 0 && (
            <>
              <WeeklyPlanTab 
                currentDay={currentDay}
                days={days}
                onDayChange={setCurrentDay}
                handleMealChange={handleMealChange}
                mealPlans={mealPlans}
              />
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setShowWeeklySetupModal(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Plan Settings
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tinder-dish" className="space-y-4">
          <TinderDishTab 
            suggestions={mealSuggestions}
            onAccept={handleAcceptMeal}
            onReject={handleRejectMeal}
          />
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <SavedPlansTab />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
      
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
