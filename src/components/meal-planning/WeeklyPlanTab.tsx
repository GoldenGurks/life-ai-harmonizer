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
import DayAssignment from './DayAssignment';

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
  
  const [availableRecipes, setAvailableRecipes] = useState<MealItem[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<MealItem[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [showDayAssignment, setShowDayAssignment] = useState(false);
  
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
      
      const newSelection = [...current, recipe];
      if (newSelection.length === 5) {
        setShowDayAssignment(true);
      }
      
      return newSelection;
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

  const handleDayAssignment = useCallback((assignments: { [key: string]: MealItem }) => {
    const newPlan: WeeklyPlan = {
      selectedRecipes,
      assignedDays: assignments,
      createdAt: new Date().toISOString()
    };

    updateProfile({
      ...profile,
      currentWeekPlan: newPlan
    });

    toast.success("Weekly meal plan saved!");
    setShowDayAssignment(false);
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

  // If no plan exists and we're not assigning days, show the recipe selection grid
  if (!profile?.currentWeekPlan && !showDayAssignment) {
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
              onShowShoppingList={() => setIsShoppingListOpen(true)}
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

  // If we're assigning days, show the day assignment view
  if (showDayAssignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assign Meals to Days</CardTitle>
          <CardDescription>
            Choose which meal you'd like to have on each day of the week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DayAssignment
            selectedRecipes={selectedRecipes}
            onAssign={handleDayAssignment}
          />
        </CardContent>
      </Card>
    );
  }

  // If plan exists, show the week overview
  return (
    <>
      <WeekOverview plan={profile.currentWeekPlan} />
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        selectedMeals={profile.currentWeekPlan.selectedRecipes}
      />
    </>
  );
};

export default WeeklyPlanTab;
