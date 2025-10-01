
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Check, Utensils, ChefHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MealItem } from '@/types/meal-planning';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { recipeData } from '@/data/recipeDatabase';
import { convertRecipeToMealItem } from './WeeklyPlanTab';

interface TinderDishTabProps {
  suggestions: MealItem[];
  onAccept: (meal: MealItem) => void;
  onReject: (meal: MealItem) => void;
}

const TinderDishTab: React.FC<TinderDishTabProps> = ({ 
  suggestions,
  onAccept,
  onReject
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alternatives, setAlternatives] = useState<MealItem[]>([]);
  const [animation, setAnimation] = useState<'right' | 'left' | null>(null);
  const [showingAlternatives, setShowingAlternatives] = useState(false);
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [allSuggestions, setAllSuggestions] = useState<MealItem[]>([]);
  const [shownRecipeIds, setShownRecipeIds] = useState<Set<string>>(new Set());
  const { addLikedFood, addDislikedFood } = useMealPreferences();

  // Initialize suggestions from props or recipe database
  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      // Filter out already shown recipes
      const unshownSuggestions = suggestions.filter(s => !shownRecipeIds.has(s.id));
      setAllSuggestions(unshownSuggestions);
    } else {
      // Use entire recipe database (not just slice)
      const allRecipes = recipeData.map(convertRecipeToMealItem);
      const unshownRecipes = allRecipes.filter(r => !shownRecipeIds.has(r.id));
      setAllSuggestions(unshownRecipes);
    }
  }, [suggestions, shownRecipeIds]);

  const currentMeal = showingAlternatives 
    ? alternatives[alternativeIndex]
    : allSuggestions[currentIndex];

  const handleSwipeRight = () => {
    if (!currentMeal) return;
    
    if (showingAlternatives) {
      // Accept alternative
      setAnimation('right');
      setTimeout(() => {
        const alternative = alternatives[alternativeIndex];
        onAccept(alternative);
        // Store preference in permanent storage
        addLikedFood(alternative.id);
        // Mark as shown
        setShownRecipeIds(prev => new Set(prev).add(alternative.id));
        
        setShowingAlternatives(false);
        setAlternatives([]);
        setAnimation(null);
        nextMeal();
      }, 500);
    } else {
      setAnimation('right');
      setTimeout(() => {
        const meal = allSuggestions[currentIndex];
        onAccept(meal);
        // Store preference in permanent storage
        addLikedFood(meal.id);
        // Mark as shown
        setShownRecipeIds(prev => new Set(prev).add(meal.id));
        
        setAnimation(null);
        nextMeal();
      }, 500);
    }
    toast.success("Added to your meal plan!");
  };

  const handleSwipeLeft = () => {
    if (!currentMeal) return;
    
    if (showingAlternatives) {
      // Also track dislike for the alternative
      addDislikedFood(alternatives[alternativeIndex].id);
      // Mark as shown
      setShownRecipeIds(prev => new Set(prev).add(alternatives[alternativeIndex].id));
      
      // Move to next alternative or back to suggestions
      if (alternativeIndex < alternatives.length - 1) {
        setAlternativeIndex(alternativeIndex + 1);
      } else {
        setShowingAlternatives(false);
        setAlternatives([]);
        toast.info("Returning to suggestions");
      }
    } else {
      // Show alternatives for this meal
      setAnimation('left');
      
      // Track dislike for original suggestion
      const currentRecipe = allSuggestions[currentIndex];
      addDislikedFood(currentRecipe.id);
      onReject(currentRecipe);
      // Mark as shown
      setShownRecipeIds(prev => new Set(prev).add(currentRecipe.id));
      
      setTimeout(() => {
        // Generate alternatives (normally would come from API)
        const newAlternatives = generateAlternatives(currentRecipe);
        setAlternatives(newAlternatives);
        setShowingAlternatives(true);
        setAlternativeIndex(0);
        setAnimation(null);
        
        toast.info("Showing alternatives");
      }, 500);
    }
  };

  const nextMeal = () => {
    if (currentIndex < allSuggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("You've gone through all available recipes!");
    }
  };

  // This would normally come from an API or service
  const generateAlternatives = (meal: MealItem): MealItem[] => {
    // Find similar recipes from the database that haven't been shown
    const similarRecipes = recipeData.filter(recipe => 
      recipe.id !== meal.id && 
      !shownRecipeIds.has(recipe.id) &&
      (recipe.tags.some(tag => meal.tags.includes(tag)) ||
       recipe.category === meal.description)
    ).slice(0, 2);

    return similarRecipes.map(convertRecipeToMealItem);
  };

  if (!currentMeal || allSuggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tinder Dish</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <p className="text-muted-foreground text-center">
            Loading meal suggestions...
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return <ChefHat className="h-5 w-5 text-primary mr-2" />;
      case 'lunch':
      case 'dinner':
        return <Utensils className="h-5 w-5 text-secondary mr-2" />;
      default:
        return <Utensils className="h-5 w-5 text-accent mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-xl uppercase flex items-center justify-between">
          <span>Tinder Dish</span>
          {showingAlternatives && (
            <Badge variant="outline" className="font-normal normal-case">
              Alternative {alternativeIndex + 1}/{alternatives.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-[500px] flex flex-col items-center">
        <div 
          className={cn(
            "tinder-dish-card w-full max-w-md mx-auto", 
            animation === 'right' && "animate-card-swipe-right",
            animation === 'left' && "animate-card-swipe-left"
          )}
        >
          {/* Meal Image */}
          <div className="relative h-64 bg-muted overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
            {currentMeal.image ? (
              <img 
                src={currentMeal.image} 
                alt={currentMeal.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                {getMealTypeIcon(currentMeal.type)}
                <span>No image available</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 z-20">
              <Badge className="bg-primary text-white mb-2 uppercase">
                {currentMeal.type}
              </Badge>
              <h3 className="text-xl font-bold text-white">{currentMeal.name}</h3>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-gray-700 mb-4">{currentMeal.description}</p>
            
            {/* Nutrition info */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded text-center">
                <span className="block text-sm font-semibold">{currentMeal.calories}</span>
                <span className="text-xs text-muted-foreground">calories</span>
              </div>
              <div className="bg-secondary/10 p-2 rounded text-center">
                <span className="block text-sm font-semibold">{currentMeal.protein}g</span>
                <span className="text-xs text-muted-foreground">protein</span>
              </div>
              <div className="bg-accent/10 p-2 rounded text-center">
                <span className="block text-sm font-semibold">{currentMeal.carbs || 0}g</span>
                <span className="text-xs text-muted-foreground">carbs</span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMeal.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Cook time */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Prep: {currentMeal.preparationTime} min</span>
              <span>Cook: {currentMeal.cookingTime} min</span>
            </div>
          </div>
        </div>
        
        {/* Swipe controls */}
        <div className="flex justify-center space-x-8 mt-8">
          <Button 
            onClick={handleSwipeLeft}
            variant="outline" 
            size="lg"
            className="h-16 w-16 rounded-full bg-white border-red-500 text-red-500 hover:bg-red-50"
          >
            <X className="h-8 w-8" />
          </Button>
          <Button 
            onClick={handleSwipeRight}
            variant="outline"
            size="lg"
            className="h-16 w-16 rounded-full bg-white border-green-500 text-green-500 hover:bg-green-50"
          >
            <Check className="h-8 w-8" />
          </Button>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between w-full mt-6">
          <Button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            variant="ghost"
            disabled={showingAlternatives || currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground self-center">
            {currentIndex + 1} / {allSuggestions.length}
          </span>
          <Button
            onClick={nextMeal}
            variant="ghost"
            disabled={showingAlternatives || currentIndex === allSuggestions.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TinderDishTab;
