
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';
import { toast } from 'sonner';
import { MealItem } from '@/types/meal-planning';
import EnhancedAddMealModal from './EnhancedAddMealModal';
import WeeklyPlanCard from './WeeklyPlanCard';
import TrendingRecipesCard from './TrendingRecipesCard';
import WeeklyProgressCard from './WeeklyProgressCard';
import QuickActionsCard from './QuickActionsCard';

/**
 * Enhanced dashboard for returning users showing their weekly plan,
 * nutrition progress, and popular recipes to add to favorites
 */
const ReturningUserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { recommendations } = useRecipeRecommendations({ count: 6 });
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);

  // Get current week's plan
  const currentPlan = profile?.currentWeekPlan;
  const plannedMeals = currentPlan?.selectedRecipes || [];
  const assignedDays = currentPlan?.assignedDays || {};

  // Calculate this week's nutrition progress (mock data for now)
  const weeklyProgress = {
    calories: { current: 8750, target: 14000, daily: 1250 },
    protein: { current: 315, target: 560, daily: 45 },
    carbs: { current: 840, target: 1400, daily: 120 },
    fat: { current: 210, target: 455, daily: 30 }
  };

  // Popular recipes (trending among users)
  const popularRecipes = recommendations.slice(0, 3).map(convertRecipeToMealItem);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleStartPlanning = () => {
    navigate('/meal-planning');
  };

  const handleAddMeal = () => {
    if (!currentPlan) {
      // No plan exists, navigate to meal planning
      navigate('/meal-planning');
    } else {
      // Plan exists, open modal
      setIsAddMealModalOpen(true);
    }
  };

  const handleMealSelect = (meal: MealItem, day: string, mealType: string) => {
    if (!currentPlan || !profile) return;

    // Create a deep copy of the current plan
    const updatedPlan = { 
      ...currentPlan,
      assignedDays: { ...currentPlan.assignedDays }
    };

    // Initialize the day if it doesn't exist
    if (!updatedPlan.assignedDays[day]) {
      updatedPlan.assignedDays[day] = {};
    }

    // Create a deep copy of the day's meals
    updatedPlan.assignedDays[day] = {
      ...updatedPlan.assignedDays[day],
      [mealType]: meal
    };

    // Add to selected recipes if not already there
    if (!updatedPlan.selectedRecipes.some(r => r.id === meal.id)) {
      updatedPlan.selectedRecipes = [...updatedPlan.selectedRecipes, meal];
    }

    updateProfile({
      ...profile,
      currentWeekPlan: updatedPlan
    });

    toast.success(`${meal.name} added to ${day}'s ${mealType}`);
  };

  const handleAddToWeeklyPlan = (recipe: MealItem) => {
    if (!currentPlan || !profile) {
      // Create a new plan with this recipe
      const newPlan = {
        selectedRecipes: [recipe],
        assignedDays: {
          Monday: { lunch: recipe }
        },
        createdAt: new Date().toISOString()
      };

      updateProfile({
        ...profile,
        currentWeekPlan: newPlan
      });

      toast.success(`${recipe.name} added to your weekly plan`);
    } else {
      // Add to existing plan
      handleMealSelect(recipe, 'Monday', 'lunch');
    }
  };

  const getMealForDayAndType = (day: string, mealType: string) => {
    return assignedDays[day]?.[mealType];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome back! 
        </h1>
        <p className="text-muted-foreground">
          Here's your weekly plan and nutrition progress
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Weekly Plan */}
        <div className="lg:col-span-2 space-y-6">
          <WeeklyPlanCard
            currentPlan={currentPlan}
            plannedMeals={plannedMeals}
            days={days}
            onAddMeal={handleAddMeal}
            getMealForDayAndType={getMealForDayAndType}
            onStartPlanning={handleStartPlanning}
          />

          <TrendingRecipesCard
            popularRecipes={popularRecipes}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
          />
        </div>

        {/* Right Column - Nutrition & Quick Actions */}
        <div className="space-y-6">
          <WeeklyProgressCard weeklyProgress={weeklyProgress} />
          <QuickActionsCard />
        </div>
      </div>

      <EnhancedAddMealModal
        isOpen={isAddMealModalOpen}
        onClose={() => setIsAddMealModalOpen(false)}
        onMealSelect={handleMealSelect}
      />
    </div>
  );
};

export default ReturningUserDashboard;
