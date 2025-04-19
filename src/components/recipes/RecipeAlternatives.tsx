
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Recipe } from '@/types/recipes';
import { findRecipeById } from '@/data/recipeDatabase';

interface RecipeAlternativesProps {
  recipeId: string;
  onSelectAlternative: (recipe: Recipe) => void;
}

const RecipeAlternatives: React.FC<RecipeAlternativesProps> = ({ recipeId, onSelectAlternative }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const recipe = findRecipeById(recipeId);
  const alternativeIds = recipe?.alternativeIds || [];
  const alternatives = alternativeIds
    .map(id => findRecipeById(id))
    .filter((r): r is Recipe => !!r);
  
  if (alternatives.length === 0) {
    return <p className="text-sm text-muted-foreground">No alternatives available</p>;
  }
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? alternatives.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev === alternatives.length - 1 ? 0 : prev + 1));
  };
  
  const currentAlternative = alternatives[currentIndex];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Alternative Recipes</h3>
      <p className="text-sm text-muted-foreground">Don't like this recipe? Try these alternatives:</p>
      
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="overflow-hidden px-8">
          <div
            key={currentAlternative.id}
            className="border rounded-lg overflow-hidden transition-all duration-300 transform"
          >
            <div 
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentAlternative.image})` }}
            />
            <div className="p-4">
              <h4 className="font-medium">{currentAlternative.title}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{currentAlternative.time}</span>
                  <span className="mx-1">•</span>
                  <span>{currentAlternative.calories} kcal</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectAlternative(currentAlternative)}
                >
                  Switch to this
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex justify-center space-x-1">
        {alternatives.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 w-1.5 rounded-full ${idx === currentIndex ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeAlternatives;
