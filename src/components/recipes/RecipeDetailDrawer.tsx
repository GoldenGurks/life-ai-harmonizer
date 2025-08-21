
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Tag, Bookmark } from 'lucide-react';
import { motion } from '@/lib/motion';
import { EnrichedRecipe } from '@/types/recipes';
import { getIngredientAsString } from '@/utils/ingredientUtils';
import { recipeData } from '@/data/recipeDatabase';
import { NutritionDetailsCollapsible } from '@/components/nutrition/NutritionDetailsCollapsible';

interface RecipeDetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRecipe: EnrichedRecipe | null;
  onSaveRecipe: (id: string) => void;
  onAlternativeClick: (recipe: EnrichedRecipe) => void;
}

const RecipeDetailDrawer: React.FC<RecipeDetailDrawerProps> = ({
  isOpen,
  onOpenChange,
  selectedRecipe,
  onSaveRecipe,
  onAlternativeClick
}) => {
  if (!selectedRecipe) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>{selectedRecipe.title}</DrawerTitle>
            <DrawerDescription>
              {selectedRecipe.tags.join(" • ")}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 overflow-y-auto max-h-[calc(90vh-12rem)]">
            <div className="space-y-6">
              <div 
                className="w-full h-64 md:h-80 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${selectedRecipe.image})` }}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium mt-1">{selectedRecipe.time}</span>
                    <span className="text-xs text-muted-foreground">Prep time</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Flame className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium mt-1">{selectedRecipe.nutrition?.calories || selectedRecipe.calories || 0}</span>
                    <span className="text-xs text-muted-foreground">Calories</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Tag className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium mt-1">{selectedRecipe.difficulty}</span>
                    <span className="text-xs text-muted-foreground">Difficulty</span>
                  </div>
                </div>
                
                <Button 
                  variant={selectedRecipe.saved ? "default" : "outline"} 
                  size="sm"
                  onClick={() => onSaveRecipe(selectedRecipe.id)}
                  className="gap-2"
                >
                  {selectedRecipe.saved ? (
                    <>
                      <Bookmark className="h-4 w-4 fill-current" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Save Recipe
                    </>
                  )}
                </Button>
              </div>
              
              {/* Enhanced nutrition section with collapsible details */}
              <NutritionDetailsCollapsible recipe={selectedRecipe} />
              
              <div>
                <h3 className="text-lg font-bold mb-3">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{getIngredientAsString(ingredient)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-3">Alternative Recipes</h3>
                <p className="text-sm text-muted-foreground mb-4">Don't like this recipe? Try these alternatives:</p>
                
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {selectedRecipe.alternativeIds?.map(id => {
                    const altRecipe = recipeData.find(r => r.id === id);
                    if (!altRecipe) return null;
                    
                    return (
                      <motion.div 
                        key={id}
                        className="min-w-[220px] rounded-lg overflow-hidden border cursor-pointer"
                        onClick={() => onAlternativeClick(altRecipe as EnrichedRecipe)}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div 
                          className="h-28 bg-cover bg-center"
                          style={{ backgroundImage: `url(${altRecipe.image})` }}
                        />
                        <div className="p-3">
                          <h4 className="font-medium text-sm line-clamp-1">{altRecipe.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {altRecipe.time}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">Add to Meal Plan</Button>
              <Button className="flex-1">Add to Shopping List</Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RecipeDetailDrawer;
