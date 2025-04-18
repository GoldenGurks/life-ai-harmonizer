
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingList } from '@/types/meal-planning';

interface AddItemSectionProps {
  shoppingItems: ShoppingList['items'];
  setShoppingItems: React.Dispatch<React.SetStateAction<ShoppingList['items']>>;
  sortedCategories: string[];
}

const AddItemSection = ({ shoppingItems, setShoppingItems, sortedCategories }: AddItemSectionProps) => {
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemCategory, setNewItemCategory] = React.useState('');

  const addItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCategory || 'Other',
      amount: 1,
      unit: 'item',
      inPantry: false,
      checked: false
    };
    
    setShoppingItems([...shoppingItems, newItem]);
    setNewItemName('');
    setNewItemCategory('');
    toast.success(`${newItemName} added to shopping list`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Item Name</label>
            <Input 
              placeholder="Enter item name" 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select onValueChange={setNewItemCategory} defaultValue={newItemCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {['Vegetables', 'Fruits', 'Proteins', 'Dairy', 'Grains', 'Pantry', 'Other'].map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addItem} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add to List
          </Button>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium text-sm mb-3">Shopping List Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Items</span>
              <span className="font-medium">{shoppingItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categories</span>
              <span className="font-medium">{sortedCategories.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">From Meal Plan</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Items in Pantry</span>
              <span className="font-medium">{shoppingItems.filter(i => i.inPantry).length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddItemSection;
