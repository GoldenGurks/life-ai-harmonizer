
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ShoppingCart } from 'lucide-react';
import { MealItem } from '@/types/meal-planning';
import { usePantry } from '@/hooks/usePantry';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMeals: MealItem[];
}

interface ShoppingItem {
  name: string;
  amount: string;
  unit: string;
  inPantry: boolean;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ isOpen, onClose, selectedMeals }) => {
  const { pantryItems } = usePantry();
  
  // Extract all ingredients from selected meals
  const allIngredients = selectedMeals.flatMap(meal => meal.ingredients);
  
  // Create a map to consolidate duplicate ingredients
  const ingredientMap = new Map<string, ShoppingItem>();
  
  allIngredients.forEach(ingredient => {
    const key = ingredient.name.toLowerCase();
    if (ingredientMap.has(key)) {
      // If ingredient already exists, update amount if possible
      const existing = ingredientMap.get(key)!;
      if (existing.unit === ingredient.unit) {
        const existingAmount = parseFloat(existing.amount) || 0;
        const newAmount = parseFloat(ingredient.amount) || 0;
        existing.amount = (existingAmount + newAmount).toString();
      }
    } else {
      // Check if the ingredient is in the pantry
      const inPantry = pantryItems.some(
        item => item.name.toLowerCase() === key
      );
      
      ingredientMap.set(key, {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        inPantry
      });
    }
  });
  
  // Convert map to array and sort
  const shoppingList = Array.from(ingredientMap.values())
    .sort((a, b) => {
      // Sort by pantry status first, then alphabetically
      if (a.inPantry && !b.inPantry) return 1;
      if (!a.inPantry && b.inPantry) return -1;
      return a.name.localeCompare(b.name);
    });
  
  // Count items that need to be purchased (not in pantry)
  const itemsToShop = shoppingList.filter(item => !item.inPantry).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shopping List
          </DialogTitle>
          <DialogDescription>
            {itemsToShop} items to purchase for your weekly meal plan
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-80 mt-4">
          <div className="space-y-4">
            {shoppingList.length > 0 ? (
              <div className="space-y-2">
                {shoppingList.map((item, index) => (
                  <div 
                    key={`${item.name}-${index}`} 
                    className={`flex justify-between items-center p-2 rounded-md ${item.inPantry ? 'bg-muted/30' : 'bg-background'}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.inPantry && (
                        <span className="text-green-500 flex-shrink-0">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                      <span className={item.inPantry ? 'text-muted-foreground' : ''}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount} {item.unit}
                      {item.inPantry && " (in pantry)"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No ingredients needed for this meal plan
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => alert("Shopping list saved!")}>
            Save List
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingListModal;
