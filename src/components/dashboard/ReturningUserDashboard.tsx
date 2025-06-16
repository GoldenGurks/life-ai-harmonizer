
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Calendar, Target, TrendingUp, Plus, ShoppingCart, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';
import { toast } from 'sonner';
import { MealItem } from '@/types/meal-planning';
import NutrientProgressBar from './NutrientProgressBar';
import EnhancedAddMealModal from './EnhancedAddMealModal';

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
          {/* Current Week Plan */}
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    This Week's Plan
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plannedMeals.length} meals planned
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleAddMeal}>
                  <Plus className="h-4 w-4" />
                  Add Meal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currentPlan ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {days.map((day) => {
                    const breakfastMeal = getMealForDayAndType(day, 'breakfast');
                    const lunchMeal = getMealForDayAndType(day, 'lunch');
                    const dinnerMeal = getMealForDayAndType(day, 'dinner');
                    
                    return (
                      <Card key={day} className="overflow-hidden">
                        <div className="p-3 pb-2 text-center border-b">
                          <h3 className="text-sm font-medium">{day.slice(0, 3)}</h3>
                        </div>
                        <CardContent className="p-2 space-y-2">
                          {/* Breakfast */}
                          <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                            {breakfastMeal ? (
                              <>
                                {breakfastMeal.image ? (
                                  <img
                                    src={breakfastMeal.image}
                                    alt={breakfastMeal.name}
                                    className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <ChefHat className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="text-center text-white px-1">
                                    <p className="text-xs font-medium">{breakfastMeal.name}</p>
                                    <p className="text-xs">{breakfastMeal.calories} kcal</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <ChefHat className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs">Breakfast</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Lunch */}
                          <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                            {lunchMeal ? (
                              <>
                                {lunchMeal.image ? (
                                  <img
                                    src={lunchMeal.image}
                                    alt={lunchMeal.name}
                                    className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <ChefHat className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="text-center text-white px-1">
                                    <p className="text-xs font-medium">{lunchMeal.name}</p>
                                    <p className="text-xs">{lunchMeal.calories} kcal</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <ChefHat className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs">Lunch</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Dinner */}
                          <div className="h-16 bg-muted/30 rounded p-1 flex items-center justify-center relative overflow-hidden group">
                            {dinnerMeal ? (
                              <>
                                {dinnerMeal.image ? (
                                  <img
                                    src={dinnerMeal.image}
                                    alt={dinnerMeal.name}
                                    className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <ChefHat className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                  <div className="text-center text-white px-1">
                                    <p className="text-xs font-medium">{dinnerMeal.name}</p>
                                    <p className="text-xs">{dinnerMeal.calories} kcal</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <ChefHat className="h-4 w-4 mx-auto mb-1" />
                                <p className="text-xs">Dinner</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No meals planned yet</p>
                  <Button onClick={handleStartPlanning}>Start Planning</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Recipes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Trending This Week
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Recipes loved by our community
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {popularRecipes.map((recipe) => (
                  <div key={recipe.id} className="group cursor-pointer relative">
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                      {recipe.image ? (
                        <img 
                          src={recipe.image} 
                          alt={recipe.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ChefHat className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-4">
                        <h4 className="font-medium text-sm mb-2 text-center">{recipe.name}</h4>
                        <p className="text-xs mb-3">{recipe.calories} kcal</p>
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWeeklyPlan(recipe);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Plan
                        </Button>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{recipe.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{recipe.calories} kcal</p>
                    <div className="flex gap-1">
                      {recipe.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Nutrition & Quick Actions */}
        <div className="space-y-6">
          {/* Weekly Nutrition Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Calories</span>
                  <span className="text-muted-foreground">
                    {weeklyProgress.calories.current} / {weeklyProgress.calories.target}
                  </span>
                </div>
                <NutrientProgressBar 
                  label="" 
                  value={weeklyProgress.calories.current} 
                  max={weeklyProgress.calories.target} 
                  unit="kcal"
                  showLabel={false}
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Protein</span>
                  <span className="text-muted-foreground">
                    {weeklyProgress.protein.current}g / {weeklyProgress.protein.target}g
                  </span>
                </div>
                <NutrientProgressBar 
                  label="" 
                  value={weeklyProgress.protein.current} 
                  max={weeklyProgress.protein.target} 
                  unit="g"
                  color="bg-secondary"
                  showLabel={false}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Carbs</span>
                  <span className="text-muted-foreground">
                    {weeklyProgress.carbs.current}g / {weeklyProgress.carbs.target}g
                  </span>
                </div>
                <NutrientProgressBar 
                  label="" 
                  value={weeklyProgress.carbs.current} 
                  max={weeklyProgress.carbs.target} 
                  unit="g"
                  color="bg-accent"
                  showLabel={false}
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Fat</span>
                  <span className="text-muted-foreground">
                    {weeklyProgress.fat.current}g / {weeklyProgress.fat.target}g
                  </span>
                </div>
                <NutrientProgressBar 
                  label="" 
                  value={weeklyProgress.fat.current} 
                  max={weeklyProgress.fat.target} 
                  unit="g"
                  color="bg-primary"
                  showLabel={false}
                />
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Daily avg: {weeklyProgress.calories.daily} kcal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/meal-planning')}>
                <Calendar className="h-4 w-4" />
                Plan Next Week
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/shopping')}>
                <ShoppingCart className="h-4 w-4" />
                View Shopping List
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/recipes')}>
                <ChefHat className="h-4 w-4" />
                Find New Recipes
              </Button>
            </CardContent>
          </Card>
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
