
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowLeft, Clock, ChefHat, ImageOff, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { cn } from '@/lib/utils';
import { recipeData } from '@/data/recipeDatabase';
import { convertRecipeToMealItem } from './WeeklyPlanTab';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface RecipeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealCount: number;
  onConfirmSelection: (selectedRecipes: MealItem[]) => void;
}

/**
 * Modal for selecting recipes with meal type filtering
 */
const RecipeSelectionModal: React.FC<RecipeSelectionModalProps> = ({
  isOpen,
  onClose,
  mealCount,
  onConfirmSelection
}) => {
  const [selectedRecipes, setSelectedRecipes] = useState<MealItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'breakfast' | 'other'>('other');
  const [availableRecipes, setAvailableRecipes] = useState<MealItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredRecipe, setHoveredRecipe] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const RECIPES_PER_PAGE = 8;

  // Convert recipe database to meal items on mount
  useEffect(() => {
    const recipes = recipeData.map(convertRecipeToMealItem);
    setAvailableRecipes(recipes);
  }, []);
  
  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeFilter]);

  // Filter recipes based on active filter
  const filteredRecipes = availableRecipes.filter(recipe => {
    if (activeFilter === 'breakfast') {
      return recipe.type === 'breakfast';
    }
    return recipe.type === 'lunch' || recipe.type === 'dinner';
  });
  
  // Paginate recipes
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
  const paginatedRecipes = filteredRecipes.slice(
    currentPage * RECIPES_PER_PAGE,
    (currentPage + 1) * RECIPES_PER_PAGE
  );

  const handleRecipeToggle = (recipe: MealItem) => {
    const isSelected = selectedRecipes.some(r => r.id === recipe.id);
    
    if (isSelected) {
      setSelectedRecipes(prev => prev.filter(r => r.id !== recipe.id));
    } else {
      if (selectedRecipes.length >= mealCount) return;
      setSelectedRecipes(prev => [...prev, recipe]);
    }
  };

  const handleConfirm = () => {
    if (selectedRecipes.length === mealCount) {
      onConfirmSelection(selectedRecipes);
      onClose();
    }
  };

  const getDifficulty = (recipe: MealItem) => {
    const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);
    if (totalTime <= 20) return 'Einfach';
    if (totalTime <= 40) return 'Mittel';
    return 'Schwer';
  };

  const RecipeCard = ({ recipe }: { recipe: MealItem }) => {
    const isSelected = selectedRecipes.some(r => r.id === recipe.id);
    const isDisabled = !isSelected && selectedRecipes.length >= mealCount;
    const difficulty = getDifficulty(recipe);
    const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);
    const mainIngredients = recipe.ingredients?.slice(0, 5).map(ing => ing.name).join(', ') || 'No ingredients listed';

    const cardContent = (
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg overflow-hidden group",
          isSelected && "ring-2 ring-primary",
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !isDisabled && handleRecipeToggle(recipe)}
        onMouseEnter={() => !isMobile && setHoveredRecipe(recipe.id)}
        onMouseLeave={() => !isMobile && setHoveredRecipe(null)}
      >
        <div className="relative h-48 w-full">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageOff className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-2 right-2 flex gap-1">
            <Badge variant="secondary" className="bg-black/60 text-white text-xs backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {totalTime}m
            </Badge>
          </div>

          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/60 text-white text-xs backdrop-blur-sm">
              <ChefHat className="h-3 w-3 mr-1" />
              {difficulty}
            </Badge>
          </div>

          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-primary text-primary-foreground rounded-full p-3">
                <Check className="h-6 w-6" />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-semibold text-base text-white leading-tight mb-1 drop-shadow-lg">
              {recipe.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-primary/80 text-white text-xs backdrop-blur-sm">
                {recipe.calories} kcal
              </Badge>
              <Badge variant="secondary" className="bg-secondary/80 text-white text-xs backdrop-blur-sm">
                {recipe.protein}g protein
              </Badge>
            </div>
          </div>

          {/* Ingredients overlay on hover (desktop) */}
          {!isMobile && hoveredRecipe === recipe.id && (
            <div className="absolute inset-0 bg-black/90 p-4 flex flex-col justify-center animate-fade-in">
              <h4 className="text-white font-semibold mb-2 text-sm">Main Ingredients:</h4>
              <p className="text-white/90 text-xs leading-relaxed">{mainIngredients}</p>
            </div>
          )}

          {/* Info icon for mobile */}
          {isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="absolute bottom-2 right-2 bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{mainIngredients}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Card>
    );

    return cardContent;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center gap-3 pb-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-xl">Wähle {mealCount} Gerichte</DialogTitle>
          <Badge variant="outline" className="ml-auto text-base px-3 py-1">
            {selectedRecipes.length} / {mealCount} gewählt
          </Badge>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeFilter === 'breakfast' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('breakfast')}
              className="flex-1"
            >
              Frühstück
            </Button>
            <Button
              variant={activeFilter === 'other' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('other')}
              className="flex-1"
            >
              Lunch & Dinner
            </Button>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[400px]">
            {paginatedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end pt-4 border-t shrink-0">
            <Button
              onClick={handleConfirm}
              disabled={selectedRecipes.length !== mealCount}
              size="lg"
            >
              Plan generieren ({selectedRecipes.length}/{mealCount})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSelectionModal;
