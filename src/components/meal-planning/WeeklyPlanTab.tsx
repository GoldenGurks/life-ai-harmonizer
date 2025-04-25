
import React, { useState, useCallback } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Heart } from 'lucide-react';
import { useUIPreferences } from '@/context/UIPreferencesContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChefHat, Utensils, Info, Coffee, ShoppingCart } from 'lucide-react';
import { MealItem, WeeklyPlan } from '@/types/meal-planning';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import MealCard from './MealCard';
import DaySelector from './DaySelector';
import RecipeSelectionGrid from './RecipeSelectionGrid';
import WeekOverview from './WeekOverview';
import ShoppingListModal from './ShoppingListModal';
import { toast } from 'sonner';
import { Recipe } from '@/types/recipes';

const convertRecipeToMealItem = (recipe: Recipe): MealItem => {
  return {
    id: recipe.id,
    name: recipe.title,
    description: recipe.category,
    calories: recipe.calories,
    protein: recipe.protein,
    carbs: recipe.carbs,
    fat: recipe.fat,
    fiber: recipe.fiber || 0,
    sugar: recipe.sugar || 0,
    type: recipe.category.toLowerCase() as any,
    tags: recipe.tags,
    preparationTime: recipe.cookTimeMinutes || 15,
    cookingTime: recipe.cookTimeMinutes || 15,
    ingredients: recipe.ingredients.map(ingredient => ({
      name: ingredient,
      amount: '1',
      unit: 'portion'
    })),
    instructions: recipe.instructions || ['Prepare according to preference'],
    image: recipe.image,
    nutritionScore: recipe.nutrientScore
  };
};

interface WeeklyPlanTabProps {
  currentDay: string;
  days: string[];
  onDayChange: (day: string) => void;
  handleMealChange: (mealId: string) => void;
  mealPlans: {
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
  }[];
}

const WeeklyPlanTab: React.FC<WeeklyPlanTabProps> = ({
  currentDay,
  days,
  onDayChange,
  handleMealChange,
  mealPlans
}) => {
  const { ui, setUI } = useUIPreferences();
  const { profile, updateProfile } = useUserProfile();
  const { recommendations, getTopN } = useRecipeRecommendations({ count: 20 });
  
  // State for recipe selection
  const [availableRecipes, setAvailableRecipes] = useState<MealItem[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<MealItem[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  
  // Initialize available recipes from recommendations
  React.useEffect(() => {
    if (recommendations.length > 0 && availableRecipes.length === 0) {
      const initialRecipes = getTopN(10).map(convertRecipeToMealItem);
      setAvailableRecipes(initialRecipes);
    }
  }, [recommendations, getTopN, availableRecipes.length]);
  
  // Handle recipe selection
  const handleRecipeSelect = useCallback((recipe: MealItem) => {
    setSelectedRecipes(current => {
      const isSelected = current.some(r => r.id === recipe.id);
      
      if (isSelected) {
        return current.filter(r => r.id !== recipe.id);
      }
      
      if (current.length >= 5) {
        toast.error("You can only select 5 recipes");
        return current;
      }
      
      return [...current, recipe];
    });
  }, []);
  
  // Handle recipe dislike/replacement
  const handleDislikeRecipe = useCallback((recipeId: string) => {
    // Remove the disliked recipe
    setAvailableRecipes(current => current.filter(r => r.id !== recipeId));
    
    // Remove from selected recipes if it was selected
    setSelectedRecipes(current => current.filter(r => r.id !== recipeId));
    
    // Get a new recipe to replace the disliked one
    const dislikedIndex = recommendations.findIndex(r => r.id === recipeId);
    
    if (dislikedIndex !== -1) {
      // Find a recipe that's not already in available recipes
      const remainingRecommendations = recommendations.filter(r => 
        !availableRecipes.some(ar => ar.id === r.id) || r.id === recipeId
      );
      
      if (remainingRecommendations.length > 0) {
        // Add a new recipe to replace the disliked one
        const newRecipe = convertRecipeToMealItem(remainingRecommendations[0]);
        setAvailableRecipes(current => [...current, newRecipe]);
        toast.success("Recipe replaced with a new suggestion");
      } else {
        toast.info("No more recipe alternatives available");
      }
    }
  }, [availableRecipes, recommendations]);

  // Handle saving the weekly plan
  const handleSavePlan = useCallback(() => {
    if (selectedRecipes.length !== 5) {
      toast.error("Please select exactly 5 recipes");
      return;
    }

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const assignedDays: { [key: string]: MealItem } = {};
    
    selectedRecipes.forEach((recipe, index) => {
      assignedDays[weekdays[index]] = recipe;
    });

    const newPlan: WeeklyPlan = {
      selectedRecipes,
      assignedDays,
      createdAt: new Date().toISOString()
    };

    updateProfile({
      ...profile,
      currentWeekPlan: newPlan
    });

    toast.success("Weekly meal plan saved!");
    
    // Show shopping list after saving the plan
    setIsShoppingListOpen(true);
  }, [selectedRecipes, profile, updateProfile]);

  // Filter meal plans based on UI preferences
  const filteredMealPlans = mealPlans.map(plan => ({
    ...plan,
    meals: ui.onlyLikedRecipes 
      ? plan.meals.filter(meal => profile?.likedMeals?.includes(meal.id))
      : plan.meals
  }));
  
  // Helper functions for meal type handling
  const getIconForMealType = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <ChefHat className="h-5 w-5 text-primary mr-2" />;
      case 'lunch':
        return <Utensils className="h-5 w-5 text-secondary mr-2" />;
      case 'dinner':
        return <Utensils className="h-5 w-5 text-accent mr-2" />;
      case 'snack':
      case 'dessert':
        return <Coffee className="h-5 w-5 text-primary mr-2" />;
      default:
        return null;
    }
  };

  const getMealTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper functions to get meals by type
  const getBreakfastMeals = () => filteredMealPlans.find(plan => plan.day === currentDay)?.meals.filter(meal => meal.type === 'breakfast') || [];
  const getLunchMeals = () => filteredMealPlans.find(plan => plan.day === currentDay)?.meals.filter(meal => meal.type === 'lunch') || [];
  const getDinnerMeals = () => filteredMealPlans.find(plan => plan.day === currentDay)?.meals.filter(meal => meal.type === 'dinner') || [];
  const getSnackMeals = () => filteredMealPlans.find(plan => plan.day === currentDay)?.meals.filter(meal => meal.type === 'snack' || meal.type === 'dessert') || [];

  const currentTotalNutrition = filteredMealPlans.find(plan => plan.day === currentDay)?.totalNutrition;

  // If no plan exists, show the recipe selection grid
  if (!profile?.currentWeekPlan) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Create Your Weekly Plan</CardTitle>
            <CardDescription>
              Select 5 recipes to create your weekly meal plan. Dislike any recipe to see a new suggestion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecipeSelectionGrid
              recipes={availableRecipes}
              selectedRecipes={selectedRecipes}
              onRecipeSelect={handleRecipeSelect}
              onSavePlan={handleSavePlan}
              onDislikeRecipe={handleDislikeRecipe}
            />
          </CardContent>
        </Card>
        
        <ShoppingListModal 
          isOpen={isShoppingListOpen}
          onClose={() => setIsShoppingListOpen(false)}
          selectedMeals={selectedRecipes}
        />
      </>
    );
  }

  // If plan exists, show the week overview and existing functionality
  return (
    <>
      <WeekOverview plan={profile.currentWeekPlan} />
      <div className="mt-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Weekly Schedule</CardTitle>
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsShoppingListOpen(true)}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Shopping List
                </Button>
                <Toggle 
                  pressed={ui.onlyLikedRecipes} 
                  onPressedChange={(pressed) => setUI({ onlyLikedRecipes: pressed })}
                  aria-label="Toggle liked recipes only"
                  className="gap-2"
                >
                  <Heart className={ui.onlyLikedRecipes ? "h-4 w-4 text-red-500 fill-red-500" : "h-4 w-4"} />
                  Liked Only
                </Toggle>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" /> 
                  April 7-13, 2025
                </Button>
              </div>
            </div>
            <CardDescription>
              View and modify your weekly meal plan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DaySelector 
              days={days} 
              currentDay={currentDay} 
              onDayChange={onDayChange} 
            />

            {currentTotalNutrition && (
              <div className="grid grid-cols-4 gap-2 mt-4 mb-6 p-3 bg-muted/20 rounded-md">
                <div className="text-center">
                  <div className="text-sm font-medium">{currentTotalNutrition.calories}</div>
                  <div className="text-xs text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{currentTotalNutrition.protein}g</div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{currentTotalNutrition.carbs}g</div>
                  <div className="text-xs text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{currentTotalNutrition.fat}g</div>
                  <div className="text-xs text-muted-foreground">Fat</div>
                </div>
              </div>
            )}

            {getBreakfastMeals().length > 0 && (
              <div className="space-y-6 mb-8">
                <h3 className="font-medium flex items-center">
                  <ChefHat className="h-5 w-5 text-primary mr-2" />
                  Breakfast
                </h3>
                {getBreakfastMeals().map((meal) => (
                  <MealCard
                    key={meal.id}
                    title={getMealTitle(meal.type)}
                    icon={getIconForMealType(meal.type)}
                    name={meal.name}
                    description={meal.description}
                    calories={meal.calories}
                    protein={meal.protein}
                    carbs={meal.carbs}
                    fat={meal.fat}
                    fiber={meal.fiber}
                    sugar={meal.sugar}
                    tags={meal.tags}
                    ingredients={meal.ingredients}
                    onMealChange={() => handleMealChange(meal.id)}
                  />
                ))}
              </div>
            )}

            <div className="space-y-6 mb-8">
              <h3 className="font-medium flex items-center">
                <Utensils className="h-5 w-5 text-secondary mr-2" />
                Lunch
              </h3>
              {getLunchMeals().map((meal) => (
                <MealCard
                  key={meal.id}
                  title={getMealTitle(meal.type)}
                  icon={getIconForMealType(meal.type)}
                  name={meal.name}
                  description={meal.description}
                  calories={meal.calories}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fat={meal.fat}
                  fiber={meal.fiber}
                  sugar={meal.sugar}
                  tags={meal.tags}
                  ingredients={meal.ingredients}
                  onMealChange={() => handleMealChange(meal.id)}
                />
              ))}
            </div>

            <div className="space-y-6 mb-8">
              <h3 className="font-medium flex items-center">
                <Utensils className="h-5 w-5 text-accent mr-2" />
                Dinner
              </h3>
              {getDinnerMeals().map((meal) => (
                <MealCard
                  key={meal.id}
                  title={getMealTitle(meal.type)}
                  icon={getIconForMealType(meal.type)}
                  name={meal.name}
                  description={meal.description}
                  calories={meal.calories}
                  protein={meal.protein}
                  carbs={meal.carbs}
                  fat={meal.fat}
                  fiber={meal.fiber}
                  sugar={meal.sugar}
                  tags={meal.tags}
                  ingredients={meal.ingredients}
                  onMealChange={() => handleMealChange(meal.id)}
                />
              ))}
            </div>

            {getSnackMeals().length > 0 && (
              <div className="space-y-6">
                <h3 className="font-medium flex items-center">
                  <Coffee className="h-5 w-5 text-primary mr-2" />
                  Snacks & Desserts
                </h3>
                {getSnackMeals().map((meal) => (
                  <MealCard
                    key={meal.id}
                    title={getMealTitle(meal.type)}
                    icon={getIconForMealType(meal.type)}
                    name={meal.name}
                    description={meal.description}
                    calories={meal.calories}
                    protein={meal.protein}
                    carbs={meal.carbs}
                    fat={meal.fat}
                    fiber={meal.fiber}
                    sugar={meal.sugar}
                    tags={meal.tags}
                    ingredients={meal.ingredients}
                    onMealChange={() => handleMealChange(meal.id)}
                  />
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">Save Plan</Button>
              <Button>
                <Info className="h-4 w-4 mr-2" />
                View Nutrition Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        selectedMeals={profile.currentWeekPlan.selectedRecipes}
      />
    </>
  );
};

export default WeeklyPlanTab;
