
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

  // Mock data for available recipes if recommendations are empty
  React.useEffect(() => {
    if (recommendations.length === 0 && availableRecipes.length === 0) {
      // Create mock recipes for demonstration when no real recommendations exist
      const mockRecipes: MealItem[] = [
        {
          id: 'mock-1',
          name: 'Mediterranean Salad',
          description: 'Fresh greens with feta cheese and olive oil',
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
            { name: 'Feta cheese', amount: '50', unit: 'g' }
          ],
          instructions: ['Combine all ingredients', 'Add dressing'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
          nutritionScore: 7
        },
        {
          id: 'mock-2',
          name: 'Grilled Salmon',
          description: 'Wild-caught salmon with vegetables',
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
            { name: 'Broccoli', amount: '100', unit: 'g' }
          ],
          instructions: ['Season salmon', 'Grill for about 4 minutes on each side'],
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
          nutritionScore: 9
        },
        {
          id: 'mock-3',
          name: 'Greek Yogurt & Berries',
          description: 'Protein-rich breakfast with fresh berries',
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
            { name: 'Mixed berries', amount: '100', unit: 'g' }
          ],
          instructions: ['Mix all ingredients in a bowl'],
          image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
          nutritionScore: 8
        },
        {
          id: 'mock-4',
          name: 'Avocado Toast',
          description: 'Whole grain toast with smashed avocado',
          calories: 350,
          protein: 8,
          carbs: 40,
          fat: 18,
          type: 'breakfast',
          tags: ['vegetarian', 'quick'],
          preparationTime: 10,
          cookingTime: 5,
          ingredients: [
            { name: 'Whole grain bread', amount: '2', unit: 'slices' },
            { name: 'Avocado', amount: '1', unit: 'medium' }
          ],
          instructions: ['Toast bread', 'Smash avocado and spread on toast'],
          image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
          nutritionScore: 7
        },
        {
          id: 'mock-5',
          name: 'Quinoa Bowl',
          description: 'Protein-packed bowl with vegetables',
          calories: 520,
          protein: 15,
          carbs: 70,
          fat: 18,
          type: 'lunch',
          tags: ['vegetarian', 'high-fiber'],
          preparationTime: 15,
          cookingTime: 20,
          ingredients: [
            { name: 'Quinoa', amount: '100', unit: 'g' },
            { name: 'Mixed vegetables', amount: '200', unit: 'g' }
          ],
          instructions: ['Cook quinoa', 'Sauté vegetables', 'Combine in bowl'],
          image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
          nutritionScore: 9
        },
        {
          id: 'mock-6',
          name: 'Chicken Stir Fry',
          description: 'Quick protein-rich dinner',
          calories: 450,
          protein: 35,
          carbs: 25,
          fat: 20,
          type: 'dinner',
          tags: ['high-protein', 'quick'],
          preparationTime: 15,
          cookingTime: 15,
          ingredients: [
            { name: 'Chicken breast', amount: '150', unit: 'g' },
            { name: 'Mixed vegetables', amount: '200', unit: 'g' }
          ],
          instructions: ['Slice chicken', 'Stir fry with vegetables'],
          image: 'https://images.unsplash.com/photo-1512058556646-c4da40fba323',
          nutritionScore: 8
        },
        {
          id: 'mock-7',
          name: 'Berry Smoothie Bowl',
          description: 'Refreshing breakfast bowl',
          calories: 380,
          protein: 12,
          carbs: 60,
          fat: 8,
          type: 'breakfast',
          tags: ['vegan', 'quick'],
          preparationTime: 10,
          cookingTime: 0,
          ingredients: [
            { name: 'Frozen berries', amount: '200', unit: 'g' },
            { name: 'Banana', amount: '1', unit: 'medium' }
          ],
          instructions: ['Blend all ingredients', 'Pour into bowl and add toppings'],
          image: 'https://images.unsplash.com/photo-1584277261846-c6a1672ed979',
          nutritionScore: 8
        },
        {
          id: 'mock-8',
          name: 'Lentil Curry',
          description: 'Protein and fiber rich curry',
          calories: 420,
          protein: 18,
          carbs: 60,
          fat: 10,
          type: 'dinner',
          tags: ['vegetarian', 'high-fiber'],
          preparationTime: 15,
          cookingTime: 25,
          ingredients: [
            { name: 'Red lentils', amount: '150', unit: 'g' },
            { name: 'Coconut milk', amount: '200', unit: 'ml' }
          ],
          instructions: ['Cook lentils', 'Add spices and coconut milk'],
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
          nutritionScore: 7
        },
        {
          id: 'mock-9',
          name: 'Oatmeal with Nuts',
          description: 'Hearty breakfast with nuts and fruits',
          calories: 410,
          protein: 12,
          carbs: 65,
          fat: 12,
          type: 'breakfast',
          tags: ['vegetarian', 'high-fiber'],
          preparationTime: 5,
          cookingTime: 10,
          ingredients: [
            { name: 'Rolled oats', amount: '80', unit: 'g' },
            { name: 'Mixed nuts', amount: '30', unit: 'g' }
          ],
          instructions: ['Cook oats with milk', 'Top with nuts and fruits'],
          image: 'https://images.unsplash.com/photo-16260784370964-39294faeae90',
          nutritionScore: 8
        },
        {
          id: 'mock-10',
          name: 'Tuna Salad Wrap',
          description: 'Protein-packed lunch wrap',
          calories: 380,
          protein: 28,
          carbs: 35,
          fat: 15,
          type: 'lunch',
          tags: ['high-protein', 'quick'],
          preparationTime: 10,
          cookingTime: 0,
          ingredients: [
            { name: 'Tuna', amount: '120', unit: 'g' },
            { name: 'Whole grain wrap', amount: '1', unit: 'piece' }
          ],
          instructions: ['Mix tuna with mayo and vegetables', 'Fill wrap and roll'],
          image: 'https://images.unsplash.com/photo-1511689660979-10e8c7567f5b',
          nutritionScore: 8
        }
      ];
      
      setAvailableRecipes(mockRecipes);
    }
  }, [recommendations, availableRecipes.length]);
  
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
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={() => {
          updateProfile({
            ...profile,
            currentWeekPlan: undefined
          });
          setSelectedRecipes([]);
          toast.success("Weekly plan cleared. You can now create a new plan.");
        }}
      >
        Clear Current Plan
      </Button>
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        selectedMeals={profile.currentWeekPlan.selectedRecipes}
      />
    </>
  );
};

export default WeeklyPlanTab;
