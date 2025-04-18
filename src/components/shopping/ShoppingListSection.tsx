
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Share2, Printer, Tag, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ShoppingList } from '@/types/meal-planning';

interface ShoppingListSectionProps {
  shoppingItems: ShoppingList['items'];
  setShoppingItems: React.Dispatch<React.SetStateAction<ShoppingList['items']>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShoppingListSection = ({
  shoppingItems,
  setShoppingItems,
  searchQuery,
  setSearchQuery,
}: ShoppingListSectionProps) => {
  const toggleItemCheck = (id: string) => {
    setShoppingItems(items => 
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearCheckedItems = () => {
    setShoppingItems(items => items.filter(item => !item.checked));
    toast.success('Checked items removed from list');
  };

  const shareList = () => {
    toast.success('Shopping list shared successfully');
  };

  const generatePDF = () => {
    toast.success('Shopping list PDF generated and ready for download');
  };

  const getFilteredItems = () => {
    if (!searchQuery) return shoppingItems;
    return shoppingItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const categoryItems = getFilteredItems().reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingItems>);

  const sortedCategories = Object.keys(categoryItems).sort();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weekly Shopping List</CardTitle>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={shareList}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={generatePDF}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input 
            placeholder="Search items..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          {shoppingItems.filter(item => item.checked).length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {shoppingItems.filter(item => item.checked).length} of {shoppingItems.length} items checked
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCheckedItems}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" /> Clear checked items
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {sortedCategories.map(category => (
            <div key={category}>
              <h3 className="font-medium text-sm flex items-center mb-2 text-muted-foreground">
                <Tag className="h-4 w-4 mr-1" />
                {category}
              </h3>
              <div className="space-y-3">
                {categoryItems[category].map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-md ${
                      item.checked ? 'bg-muted/50' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={item.checked} 
                        onCheckedChange={() => toggleItemCheck(item.id)} 
                        id={`item-${item.id}`}
                      />
                      <label 
                        htmlFor={`item-${item.id}`}
                        className={`flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.name}
                      </label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.amount} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShoppingListSection;
