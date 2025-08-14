import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MealItem, MealIngredient } from '@/types/meal-planning';
import { Check, Package } from 'lucide-react';

interface PantryQuickCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMeals: MealItem[];
  onApplyPantryCheck: (checkedIngredients: string[]) => void;
}

/**
 * Modal for quick pantry check to reduce shopping list
 * Shows aggregated ingredients from selected recipes with checkboxes
 */
const PantryQuickCheckModal: React.FC<PantryQuickCheckModalProps> = ({
  isOpen,
  onClose,
  selectedMeals,
  onApplyPantryCheck
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // Aggregate ingredients from all selected meals
  const aggregatedIngredients = useMemo(() => {
    const ingredientMap = new Map<string, { name: string; totalAmount: number; unit: string; count: number }>();
    
    selectedMeals.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          if (existing.unit === ingredient.unit) {
            existing.totalAmount += parseFloat(ingredient.amount) || 1;
            existing.count += 1;
          } else {
            existing.count += 1;
          }
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            totalAmount: parseFloat(ingredient.amount) || 1,
            unit: ingredient.unit,
            count: 1
          });
        }
      });
    });

    return Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedMeals]);

  const handleIngredientToggle = (ingredientName: string, checked: boolean) => {
    setCheckedIngredients(prev => {
      if (checked) {
        return [...prev, ingredientName];
      } else {
        return prev.filter(name => name !== ingredientName);
      }
    });
  };

  const handleApply = () => {
    onApplyPantryCheck(checkedIngredients);
    onClose();
  };

  const handleSelectAll = () => {
    if (checkedIngredients.length === aggregatedIngredients.length) {
      setCheckedIngredients([]);
    } else {
      setCheckedIngredients(aggregatedIngredients.map(ing => ing.name));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Quick Pantry Check
          </DialogTitle>
          <DialogDescription>
            Check items you already have to reduce your shopping list
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              {checkedIngredients.length} of {aggregatedIngredients.length} items selected
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              {checkedIngredients.length === aggregatedIngredients.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <ScrollArea className="max-h-60">
            <div className="space-y-3">
              {aggregatedIngredients.map((ingredient, index) => (
                <div key={`${ingredient.name}-${index}`} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50">
                  <Checkbox
                    id={`ingredient-${index}`}
                    checked={checkedIngredients.includes(ingredient.name)}
                    onCheckedChange={(checked) => 
                      handleIngredientToggle(ingredient.name, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`ingredient-${index}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {ingredient.name}
                    </label>
                    <div className="text-xs text-muted-foreground">
                      {ingredient.totalAmount} {ingredient.unit}
                      {ingredient.count > 1 && ` (needed for ${ingredient.count} recipes)`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Apply to Shopping List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PantryQuickCheckModal;