
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingList } from '@/types/meal-planning';
import ShoppingListSection from '@/components/shopping/ShoppingListSection';
import AddItemSection from '@/components/shopping/AddItemSection';
import PantrySection from '@/components/shopping/PantrySection';
import { usePantry } from '@/hooks/usePantry';

const sampleShoppingList: ShoppingList = {
  id: '1',
  name: 'Weekly Shopping List',
  createdAt: '2025-04-15T10:00:00Z',
  lastUpdated: '2025-04-17T15:30:00Z',
  items: [
    { id: '1', name: 'Chicken breast', category: 'Proteins', amount: 500, unit: 'g', inPantry: false, checked: false },
    { id: '2', name: 'Spinach', category: 'Vegetables', amount: 200, unit: 'g', inPantry: false, checked: false },
    { id: '3', name: 'Greek yogurt', category: 'Dairy', amount: 500, unit: 'g', inPantry: true, checked: false },
    { id: '4', name: 'Quinoa', category: 'Grains', amount: 250, unit: 'g', inPantry: true, checked: false },
    { id: '5', name: 'Sweet potatoes', category: 'Vegetables', amount: 750, unit: 'g', inPantry: false, checked: false },
    { id: '6', name: 'Olive oil', category: 'Pantry', amount: 1, unit: 'bottle', inPantry: false, checked: false },
    { id: '7', name: 'Almonds', category: 'Nuts & Seeds', amount: 200, unit: 'g', inPantry: false, checked: false },
    { id: '8', name: 'Almond milk', category: 'Dairy Alternatives', amount: 1, unit: 'L', inPantry: false, checked: false },
  ]
};

const Shopping = () => {
  const [shoppingItems, setShoppingItems] = useState(sampleShoppingList.items);
  const [searchQuery, setSearchQuery] = useState('');
  const pantry = usePantry();
  
  const generateFromMealPlan = () => {
    toast.success('Shopping list updated from your meal plan');
  };
  
  const updateFromPantry = () => {
    toast.info('Shopping list updated based on your pantry items');
  };
  
  const categoryItems = shoppingItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingItems>);
  
  const sortedCategories = Object.keys(categoryItems).sort();
  
  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={updateFromPantry}>
            <Package className="h-4 w-4 mr-2" />
            Update from Pantry
          </Button>
          <Button onClick={generateFromMealPlan}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Generate from Meal Plan
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="shopping" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
          <TabsTrigger value="pantry">Pantry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shopping">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ShoppingListSection
                shoppingItems={shoppingItems}
                setShoppingItems={setShoppingItems}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <div>
              <AddItemSection
                shoppingItems={shoppingItems}
                setShoppingItems={setShoppingItems}
                sortedCategories={sortedCategories}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pantry">
          <PantrySection pantry={pantry} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Shopping;
