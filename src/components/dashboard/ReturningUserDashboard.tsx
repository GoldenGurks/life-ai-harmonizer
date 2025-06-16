
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Calendar, Target, TrendingUp, Plus, ShoppingCart } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { convertRecipeToMealItem } from '@/components/meal-planning/WeeklyPlanTab';
import NutrientProgressBar from './NutrientProgressBar';

/**
 * Enhanced dashboard for returning users showing their weekly plan,
 * nutrition progress, and popular recipes to add to favorites
 */
const ReturningUserDashboard: React.FC = () => {
  const { profile } = useUserProfile();
  const { recommendations } = useRecipeRecommendations({ count: 6 });

  // Get current week's plan
  const currentPlan = profile?.currentWeekPlan;
  const plannedMeals = currentPlan?.selectedRecipes || [];

  // Calculate this week's nutrition progress (mock data for now)
  const weeklyProgress = {
    calories: { current: 8750, target: 14000, daily: 1250 },
    protein: { current: 315, target: 560, daily: 45 },
    carbs: { current: 840, target: 1400, daily: 120 },
    fat: { current: 210, target: 455, daily: 30 }
  };

  // Popular recipes (trending among users)
  const popularRecipes = recommendations.slice(0, 3).map(convertRecipeToMealItem);

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  This Week's Plan
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {plannedMeals.length} meals planned
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Meal
              </Button>
            </CardHeader>
            <CardContent>
              {plannedMeals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {plannedMeals.slice(0, 4).map((meal, index) => (
                    <div key={meal.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{meal.name}</p>
                        <p className="text-xs text-muted-foreground">{meal.calories} kcal</p>
                      </div>
                    </div>
                  ))}
                  {plannedMeals.length > 4 && (
                    <div className="flex items-center justify-center p-3 bg-muted/20 rounded-lg border-2 border-dashed">
                      <p className="text-sm text-muted-foreground">
                        +{plannedMeals.length - 4} more meals
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-3">No meals planned yet</p>
                  <Button>Start Planning</Button>
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
                  <div key={recipe.id} className="group cursor-pointer">
                    <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
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
              <Button className="w-full justify-start gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                Plan Next Week
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <ShoppingCart className="h-4 w-4" />
                View Shopping List
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <ChefHat className="h-4 w-4" />
                Find New Recipes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturningUserDashboard;
