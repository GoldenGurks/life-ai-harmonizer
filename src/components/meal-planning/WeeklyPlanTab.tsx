
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { MealItem, WeeklyPlan } from '@/types/meal-planning';
import { WeeklyPlanDisplay } from './useMealManager';
import { Recipe, RecipeIngredient } from '@/types/recipes';
import { toast } from 'sonner';

import RecipeSelectionGrid from './RecipeSelectionGrid';
import WeekOverview from './WeekOverview';
import ShoppingListModal from './ShoppingListModal';
import MiniPickerModal from './MiniPickerModal';
import { MealType } from './DaySlot';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { recipeData } from '@/data/recipeDatabase';

/**
 * Converts a Recipe object to a MealItem for use in the meal planner
 * @param recipe Recipe object from the database
 * @returns Converted MealItem with appropriate properties
 */
export const convertRecipeToMealItem = (recipe: Recipe): MealItem => {
  return {
    id: recipe.id,
    name: recipe.title,
    description: recipe.category,
    calories: recipe.nutrition?.calories || recipe.calories || 0,
    protein: recipe.nutrition?.protein || recipe.protein || 0,
    carbs: recipe.nutrition?.carbs || recipe.carbs || 0,
    fat: recipe.nutrition?.fat || recipe.fat || 0,
    fiber: recipe.nutrition?.fiber || recipe.fiber || 0,
    sugar: recipe.nutrition?.sugar || 0,
    type: recipe.category.toLowerCase().includes('breakfast') ? 'breakfast' : 
          recipe.category.toLowerCase().includes('dinner') ? 'dinner' : 'lunch',
    tags: recipe.tags,
    preparationTime: recipe.cookTimeMinutes || 15,
    cookingTime: recipe.cookTimeMinutes || 15,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ingredient => {
      // Handle both string ingredients and RecipeIngredient objects
      if (typeof ingredient === 'string') {
        return {
          name: ingredient,
          amount: '1',
          unit: 'portion'
        };
      } else {
        return {
          name: ingredient.name || `Ingredient ${ingredient.id}`,
          amount: ingredient.amount.toString(),
          unit: ingredient.unit
        };
      }
    }) : [],
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
  mealPlans: WeeklyPlanDisplay[];
  onClearPlan?: () => void;
}

/**
 * Main component for the weekly plan tab view
 * Handles displaying and managing the current week's meal plan
 */
const WeeklyPlanTab: React.FC<WeeklyPlanTabProps> = ({
  currentDay,
  days,
  onDayChange,
  handleMealChange,
  mealPlans
}) => {
  // Hooks for user profile and recipe recommendations
  const { profile, updateProfile } = useUserProfile();
  const { recommendations, getTopN } = useRecipeRecommendations({ count: 20 });
  const { weeklySettings } = useMealPreferences();
  
  // State for recipe management
  const [availableRecipes, setAvailableRecipes] = useState<MealItem[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<MealItem[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [dislikedRecipeIds, setDislikedRecipeIds] = useState<string[]>([]);
  
  // Get mealCount from weekly settings
  const mealCount = weeklySettings.dishCount;
  
  // State for the mini picker modal
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<MealType>('lunch');
  const [currentPickerDay, setCurrentPickerDay] = useState<string>('');
  
  // Initialize available recipes from recommendations
  useEffect(() => {
    if (recommendations.length > 0 && availableRecipes.length === 0) {
      const initialRecipes = getTopN(10)
        .filter(recipe => !dislikedRecipeIds.includes(recipe.id))
        .map(convertRecipeToMealItem);
      setAvailableRecipes(initialRecipes);
    }
  }, [recommendations, getTopN, availableRecipes.length, dislikedRecipeIds]);

  // Create mock data when recommendations are empty
  useEffect(() => {
    if (recommendations.length === 0 && availableRecipes.length === 0) {
      // Using mock data for demonstration
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
          image: 'https://images.unsplash.com/photo-1528207776546-c4da40fba323',
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
          image: 'https://images.unsplash.com/photo-1511690656646-c4342bb7c2f2',
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
      
      const filteredMockRecipes = mockRecipes.filter(recipe => !dislikedRecipeIds.includes(recipe.id));
      setAvailableRecipes(filteredMockRecipes);
    }
  }, [recommendations, availableRecipes.length, dislikedRecipeIds]);
  
  // Handle recipe selection
  const handleRecipeSelect = useCallback((recipe: MealItem) => {
    setSelectedRecipes(current => {
      const isSelected = current.some(r => r.id === recipe.id);
      
      if (isSelected) {
        return current.filter(r => r.id !== recipe.id);
      }
      
      if (current.length >= mealCount) {
        toast.error(`You can only select ${mealCount} recipes`);
        return current;
      }
      
      return [...current, recipe];
    });
  }, [mealCount]);
  
  // Enhanced recipe dislike/replacement handler
  const handleDislikeRecipe = useCallback((recipeId: string) => {
    // Add to disliked list
    setDislikedRecipeIds(current => [...current, recipeId]);
    
    // Remove the disliked recipe from available recipes
    setAvailableRecipes(current => current.filter(r => r.id !== recipeId));
    
    // Remove from selected recipes if it was selected
    setSelectedRecipes(current => current.filter(r => r.id !== recipeId));
    
    // Find a replacement recipe from the full recipe database
    const allAvailableRecipes = [...recommendations, ...recipeData];
    const replacementCandidates = allAvailableRecipes.filter(recipe => 
      !dislikedRecipeIds.includes(recipe.id) && 
      recipe.id !== recipeId &&
      !availableRecipes.some(ar => ar.id === recipe.id)
    );
    
    if (replacementCandidates.length > 0) {
      // Pick a random replacement to add variety
      const randomIndex = Math.floor(Math.random() * Math.min(3, replacementCandidates.length));
      const newRecipe = convertRecipeToMealItem(replacementCandidates[randomIndex]);
      
      setAvailableRecipes(current => [...current, newRecipe]);
      toast.success("Recipe replaced with a new suggestion!");
    } else {
      toast.info("No more recipe alternatives available at the moment.");
    }
  }, [availableRecipes, recommendations, dislikedRecipeIds]);

  // Handle saving the weekly plan
  const handleSavePlan = useCallback(() => {
    if (selectedRecipes.length !== mealCount) {
      toast.error(`Please select exactly ${mealCount} recipes`);
      return;
    }

    // Create an empty weekly plan structure
    const assignedDays: { [day: string]: { [key: string]: MealItem | undefined } } = {};
    
    // Initialize the structure for all days
    days.forEach(day => {
      assignedDays[day] = {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined
      };
    });

    // Get the days we need based on the number of recipes selected
    const daysNeeded = days.slice(0, mealCount);
    
    // Assign recipes to lunch slots by default
    selectedRecipes.forEach((recipe, index) => {
      if (index < daysNeeded.length) {
        const day = daysNeeded[index];
        assignedDays[day].lunch = recipe;
      }
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
  }, [selectedRecipes, mealCount, days, profile, updateProfile]);

  /**
   * Handles opening the meal picker modal for a specific day and meal type
   * @param day The day to add the meal to
   * @param mealType The type of meal (breakfast, lunch, dinner)
   */
  const handleAddMeal = useCallback((day: string, mealType: MealType) => {
    setCurrentPickerDay(day);
    setCurrentMealType(mealType);
    setIsPickerOpen(true);
  }, []);

  /**
   * Handles selecting a recipe from the mini picker and updating the meal plan
   * @param recipe The recipe selected from the picker
   */
  const handleSelectFromPicker = useCallback((recipe: MealItem) => {
    if (!profile?.currentWeekPlan) return;
    
    // Create a deep copy of the current plan
    const updatedPlan = { 
      ...profile.currentWeekPlan,
      assignedDays: { ...profile.currentWeekPlan.assignedDays }
    };
    
    // Initialize the day if it doesn't exist
    if (!updatedPlan.assignedDays[currentPickerDay]) {
      updatedPlan.assignedDays[currentPickerDay] = {};
    }
    
    // Create a deep copy of the day's meals
    updatedPlan.assignedDays[currentPickerDay] = {
      ...updatedPlan.assignedDays[currentPickerDay],
      [currentMealType]: recipe
    };
    
    // Make sure the recipe is in the selectedRecipes array
    if (!updatedPlan.selectedRecipes.some(r => r.id === recipe.id)) {
      updatedPlan.selectedRecipes = [...updatedPlan.selectedRecipes, recipe];
    }
    
    updateProfile({
      ...profile,
      currentWeekPlan: updatedPlan
    });
    
    toast.success(`${recipe.name} added to ${currentPickerDay}'s ${currentMealType}`);
  }, [profile, updateProfile, currentPickerDay, currentMealType]);

  // Handle updating the weekly plan when meals are moved via drag and drop
  const handleUpdatePlan = useCallback((updatedPlan: WeeklyPlan) => {
    if (!profile) return;
    
    updateProfile({
      ...profile,
      currentWeekPlan: updatedPlan
    });
    
    toast.success("Meal moved successfully");
  }, [profile, updateProfile]);

  // If no plan exists, show the recipe selection grid
  if (!profile?.currentWeekPlan) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Create Your Weekly Plan</CardTitle>
            <CardDescription>
              Select {mealCount} recipes to create your weekly meal plan. 
              Dislike any recipe to see a new suggestion from our recipe library.
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
              maxMeals={mealCount}
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

  // If plan exists, show the week overview
  return (
    <>
      <WeekOverview 
        plan={profile.currentWeekPlan} 
        onAddMeal={handleAddMeal}
        onUpdatePlan={handleUpdatePlan}
      />
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            updateProfile({
              ...profile,
              currentWeekPlan: undefined
            });
            setSelectedRecipes([]);
            setDislikedRecipeIds([]);
            toast.success("Weekly plan cleared. You can now create a new plan.");
          }}
        >
          Clear Current Plan
        </Button>
        
        <Button 
          onClick={() => setIsShoppingListOpen(true)}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          View Shopping List
        </Button>
      </div>
      
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        selectedMeals={profile.currentWeekPlan.selectedRecipes}
      />

      <MiniPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        mealType={currentMealType}
        availableRecipes={availableRecipes.length > 0 ? availableRecipes : recommendations.map(convertRecipeToMealItem)}
        onSelectRecipe={handleSelectFromPicker}
      />
    </>
  );
};

export default WeeklyPlanTab;
