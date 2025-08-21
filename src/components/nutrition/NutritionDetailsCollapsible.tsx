import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnrichedRecipe, NutritionDetails } from '@/types/recipes';

interface NutritionDetailsCollapsibleProps {
  recipe: EnrichedRecipe;
  servings?: number;
}

/**
 * Collapsible nutrition details component that shows extended micronutrient information
 * Always displays a compact macro row, with expandable detailed nutrition section
 */
export const NutritionDetailsCollapsible: React.FC<NutritionDetailsCollapsibleProps> = ({ 
  recipe, 
  servings 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Use current servings or recipe's default servings
  const currentServings = servings || recipe.servings || 4;
  
  // Get scaled nutrition values if servings differ from recipe default
  const nutrition = recipe.nutrition;
  const nutritionDetails = recipe.nutritionDetails;
  
  // Helper function to check if a recipe has high levels of certain nutrients for badges
  const getHighNutrientBadges = () => {
    const badges = [];
    
    if (nutrition.protein >= 30) {
      badges.push(<Badge key="protein" variant="secondary" className="bg-blue-100 text-blue-800">High Protein</Badge>);
    }
    
    if (nutrition.fiber >= 8) {
      badges.push(<Badge key="fiber" variant="secondary" className="bg-green-100 text-green-800">High Fiber</Badge>);
    }
    
    if (nutritionDetails?.vitaminC_mg && nutritionDetails.vitaminC_mg >= 60) {
      badges.push(<Badge key="vitc" variant="secondary" className="bg-orange-100 text-orange-800">High Vitamin C</Badge>);
    }
    
    if (nutritionDetails?.iron_mg && nutritionDetails.iron_mg >= 10) {
      badges.push(<Badge key="iron" variant="secondary" className="bg-red-100 text-red-800">High Iron</Badge>);
    }
    
    return badges;
  };

  // Helper function to format nutrient display
  const formatNutrient = (value: number | undefined, unit: string, decimals: number = 1) => {
    if (value === undefined || value === 0) return null;
    return `${value.toFixed(decimals)}${unit}`;
  };

  return (
    <div className="w-full space-y-3">
      {/* Always visible compact macro row */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="text-sm font-bold mb-3 flex items-center justify-between">
          Nutrition Facts (per serving)
          <span className="text-xs text-muted-foreground font-normal">
            {currentServings} serving{currentServings !== 1 ? 's' : ''}
          </span>
        </h3>
        
        <div className="grid grid-cols-6 gap-2 text-xs mb-3">
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.calories}</span>
            <span className="text-muted-foreground">kcal</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.protein}g</span>
            <span className="text-muted-foreground">Protein</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.carbs}g</span>
            <span className="text-muted-foreground">Carbs</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.fat}g</span>
            <span className="text-muted-foreground">Fat</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.fiber}g</span>
            <span className="text-muted-foreground">Fiber</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-background rounded-md">
            <span className="font-medium">{nutrition.sugar}g</span>
            <span className="text-muted-foreground">Sugar</span>
          </div>
        </div>
        
        {/* High nutrient badges */}
        {getHighNutrientBadges().length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {getHighNutrientBadges()}
          </div>
        )}
        
        {/* Collapsible toggle button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? 'Hide' : 'Show'} nutrition details
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Expandable detailed nutrition section */}
      {isExpanded && nutritionDetails && (
        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary/20">
          <h4 className="text-sm font-semibold mb-3">Detailed Nutrition Information</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            {/* Minerals */}
            {(nutritionDetails.sodium_mg || nutritionDetails.potassium_mg) && (
              <div className="col-span-full">
                <h5 className="font-medium text-muted-foreground mb-2">Minerals</h5>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.sodium_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Sodium</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.sodium_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.potassium_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Potassium</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.potassium_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.calcium_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Calcium</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.calcium_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.iron_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Iron</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.iron_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.magnesium_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Magnesium</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.magnesium_mg, 'mg')}</span>
              </div>
            )}
            
            {/* Vitamins */}
            {(nutritionDetails.vitaminC_mg || nutritionDetails.vitaminA_ug || nutritionDetails.vitaminK_ug || nutritionDetails.vitaminE_mg || nutritionDetails.folate_ug) && (
              <div className="col-span-full mt-3">
                <h5 className="font-medium text-muted-foreground mb-2">Vitamins</h5>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.vitaminC_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Vitamin C</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.vitaminC_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.vitaminA_ug, 'μg') && (
              <div className="flex justify-between">
                <span>Vitamin A</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.vitaminA_ug, 'μg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.vitaminK_ug, 'μg') && (
              <div className="flex justify-between">
                <span>Vitamin K</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.vitaminK_ug, 'μg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.vitaminE_mg, 'mg') && (
              <div className="flex justify-between">
                <span>Vitamin E</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.vitaminE_mg, 'mg')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.folate_ug, 'μg') && (
              <div className="flex justify-between">
                <span>Folate (B9)</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.folate_ug, 'μg')}</span>
              </div>
            )}
            
            {/* Derived values */}
            {(nutritionDetails.netCarbs_g || nutritionDetails.sodiumToPotassiumRatio) && (
              <div className="col-span-full mt-3">
                <h5 className="font-medium text-muted-foreground mb-2">Derived Values</h5>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.netCarbs_g, 'g') && (
              <div className="flex justify-between">
                <span>Net carbs</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.netCarbs_g, 'g')}</span>
              </div>
            )}
            
            {formatNutrient(nutritionDetails.sodiumToPotassiumRatio, '', 2) && (
              <div className="flex justify-between">
                <span>Na:K ratio</span>
                <span className="font-medium">{formatNutrient(nutritionDetails.sodiumToPotassiumRatio, '', 2)}</span>
              </div>
            )}
          </div>
          
          {/* Meta information */}
          <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <p>
              Calculated from food library (per serving), base portions = {nutritionDetails.basePortions || 4}.
              {nutritionDetails.lastCalculatedAt && (
                <span className="ml-2">
                  Last updated: {new Date(nutritionDetails.lastCalculatedAt).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};