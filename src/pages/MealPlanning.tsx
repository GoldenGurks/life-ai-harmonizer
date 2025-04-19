
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import WelcomeModal from '@/components/meal-planning/WelcomeModal';
import QuickSetupModal from '@/components/meal-planning/QuickSetupModal';
import DetailedPlanningModal from '@/components/meal-planning/DetailedPlanningModal';
import WeeklyPlanTab from '@/components/meal-planning/WeeklyPlanTab';
import SavedPlansTab from '@/components/meal-planning/SavedPlansTab';
import TemplatesTab from '@/components/meal-planning/TemplatesTab';
import { MealPlan, MealItem } from '@/types/meal-planning';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { mealSuggestionService } from '@/services/mealSuggestionService';
import { toast } from 'sonner';

const MealPlanning = () => {
  const { toast: toastNotification } = useToast();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Get user preferences
  const { preferences, isSetupComplete } = useMealPreferences();
  
  // Setup flow state
  const [isNewUser, setIsNewUser] = useState(!isSetupComplete);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);

  // Initial meal plans data with full MealItem properties
  const initialMealPlan: MealPlan = {
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

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([initialMealPlan]);

  useEffect(() => {
    // Check if user is new (based on completed setup)
    if (isNewUser) {
      // Show welcome modal after a short delay to let the page render first
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (isSetupComplete) {
      // Generate meal suggestions based on saved preferences
      generateMealSuggestions();
    }
  }, [isNewUser, isSetupComplete]);

  const generateMealSuggestions = () => {
    // Only generate if we have preferences
    if (!preferences) return;

    const newPlans: MealPlan[] = [];
    
    // Generate meal plans for each day
    days.forEach((day) => {
      const breakfastMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'breakfast');
      const lunchMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'lunch');
      const dinnerMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'dinner');
      const snackMeals = mealSuggestionService.generateSuggestions(preferences, 1, 'snack');
      
      const dayPlan: MealPlan = {
        id: day.toLowerCase(),
        name: `${day}'s Plan`,
        day: day,
        meals: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals],
        totalNutrition: {
          calories: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals].reduce((sum, meal) => sum + meal.calories, 0),
          protein: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals].reduce((sum, meal) => sum + meal.protein, 0),
          carbs: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals].reduce((sum, meal) => sum + (meal.carbs || 0), 0),
          fat: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals].reduce((sum, meal) => sum + (meal.fat || 0), 0),
          fiber: [...breakfastMeals, ...lunchMeals, ...dinnerMeals, ...snackMeals].reduce((sum, meal) => sum + (meal.fiber || 0), 0),
        }
      };
      
      newPlans.push(dayPlan);
    });
    
    setMealPlans(newPlans);
  };

  const generateAIMealPlan = () => {
    if (!isSetupComplete) {
      toast.error("Please complete your meal preferences setup first");
      setShowWelcomeModal(true);
      return;
    }

    toastNotification({
      title: "AI-Generated Plan",
      description: "Your personalized meal plan is being created based on your preferences.",
    });
    
    // Generate new meal suggestions
    generateMealSuggestions();
    
    setTimeout(() => {
      toastNotification({
        title: "Meal Plan Ready!",
        description: "Your new meal plan has been created and is ready to review.",
      });
    }, 2000);
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
    
    // Find the meal to replace
    const currentPlan = mealPlans.find(plan => plan.day === currentDay);
    if (!currentPlan) return;
    
    const mealToReplace = currentPlan.meals.find(meal => meal.id === mealId);
    if (!mealToReplace) return;
    
    // Generate a replacement meal of the same type
    const replacementMeals = mealSuggestionService.generateSuggestions(preferences, 1, mealToReplace.type);
    if (replacementMeals.length === 0) return;
    
    // Update the meal plan
    const updatedPlans = mealPlans.map(plan => {
      if (plan.day === currentDay) {
        const updatedMeals = plan.meals.map(meal => 
          meal.id === mealId ? replacementMeals[0] : meal
        );
        
        // Recalculate nutrition totals
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

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meal Planning</h1>
        <p className="text-muted-foreground">
          Create and manage your personalized meal plans with AI assistance.
        </p>
      </div>

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
            <TabsTrigger value="saved">Saved Plans</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleOpenPreferences} className="gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </Button>
            <Button onClick={generateAIMealPlan} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate AI Plan
            </Button>
          </div>
        </div>

        <TabsContent value="weekly" className="space-y-4">
          <WeeklyPlanTab 
            currentDay={currentDay}
            days={days}
            onDayChange={setCurrentDay}
            handleMealChange={handleMealChange}
            mealPlans={mealPlans}
          />
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <SavedPlansTab />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesTab />
        </TabsContent>
      </Tabs>
      
      {/* Welcome and Setup Flow Modals */}
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
    </Layout>
  );
};

export default MealPlanning;
