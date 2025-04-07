
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import WelcomeModal from '@/components/meal-planning/WelcomeModal';
import QuickSetupModal from '@/components/meal-planning/QuickSetupModal';
import DetailedPlanningModal from '@/components/meal-planning/DetailedPlanningModal';
import WeeklyPlanTab from '@/components/meal-planning/WeeklyPlanTab';
import SavedPlansTab from '@/components/meal-planning/SavedPlansTab';
import TemplatesTab from '@/components/meal-planning/TemplatesTab';
import { MealPlan } from '@/types/meal-planning';

const MealPlanning = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Setup flow state
  const [isNewUser, setIsNewUser] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [showDetailedPlanningModal, setShowDetailedPlanningModal] = useState(false);

  // Sample meal plans data
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([
    {
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
          type: 'breakfast',
          tags: ['high-protein', 'quick']
        },
        {
          id: '2',
          name: 'Mediterranean Salad',
          description: 'Fresh greens with feta cheese, olives, tomatoes, and olive oil dressing',
          calories: 450,
          protein: 12,
          type: 'lunch',
          tags: ['vegetarian', 'fresh']
        },
        {
          id: '3',
          name: 'Grilled Salmon with Vegetables',
          description: 'Wild-caught salmon with steamed broccoli and sweet potatoes',
          calories: 580,
          protein: 32,
          type: 'dinner',
          tags: ['high-protein', 'omega-3']
        },
        {
          id: '4',
          name: 'Apple with Almond Butter',
          description: 'Sliced apple with 2 tbsp natural almond butter',
          calories: 210,
          protein: 5,
          type: 'snack',
          tags: ['quick', 'fiber']
        }
      ]
    }
  ]);

  useEffect(() => {
    // Check if user is new (in real app, this would check user data from backend)
    if (isNewUser) {
      // Show welcome modal after a short delay to let the page render first
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  const generateAIMealPlan = () => {
    toast({
      title: "AI-Generated Plan",
      description: "Your personalized meal plan is being created based on your preferences.",
    });
    
    // This would connect to an AI API in a real implementation
    setTimeout(() => {
      toast({
        title: "Meal Plan Ready!",
        description: "Your new meal plan has been created and is ready to review.",
      });
    }, 2000);
  };

  const handleMealChange = (mealId: string) => {
    toast({
      title: "Meal Options",
      description: "Showing alternative meals based on your preferences and nutritional goals.",
    });
  };
  
  const handleSetupChoice = (choice: 'quick' | 'detailed') => {
    if (choice === 'quick') {
      setShowQuickSetupModal(true);
    } else {
      setShowDetailedPlanningModal(true);
    }
    setIsNewUser(false);
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
          <Button onClick={generateAIMealPlan} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate AI Plan
          </Button>
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
