import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Check, ShoppingCart, Package, RefreshCcw, Printer, Share2, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { PantryItem, ShoppingList } from '@/types/meal-planning';

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

const samplePantryItems: PantryItem[] = [
  { id: '1', name: 'Pasta', category: 'Grains', amount: 500, unit: 'g', expirationDate: '2026-01-15' },
  { id: '2', name: 'Canned tomatoes', category: 'Vegetables', amount: 400, unit: 'g', expirationDate: '2026-06-20' },
  { id: '3', name: 'Rice', category: 'Grains', amount: 1000, unit: 'g', expirationDate: '2027-03-10' },
  { id: '4', name: 'Greek yogurt', category: 'Dairy', amount: 500, unit: 'g', expirationDate: '2025-04-25' },
  { id: '5', name: 'Quinoa', category: 'Grains', amount: 250, unit: 'g', expirationDate: '2026-12-05' },
];

const Shopping = () => {
  const [shoppingItems, setShoppingItems] = useState(sampleShoppingList.items);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [pantryItems, setPantryItems] = useState(samplePantryItems);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  const toggleItemCheck = (id: string) => {
    setShoppingItems(shoppingItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
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
  
  const generateFromMealPlan = () => {
    toast.success('Shopping list updated from your meal plan');
  };
  
  const updateFromPantry = () => {
    toast.info('Shopping list updated based on your pantry items');
  };
  
  const clearCheckedItems = () => {
    setShoppingItems(shoppingItems.filter(item => !item.checked));
    toast.success('Checked items removed from list');
  };
  
  const shareList = () => {
    toast.success('Shopping list shared successfully');
  };
  
  const generatePDF = () => {
    toast.success('Shopping list PDF generated and ready for download');
  };
  
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
            </div>
            
            <div>
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
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Fruits">Fruits</SelectItem>
                          <SelectItem value="Proteins">Proteins</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                          <SelectItem value="Pantry">Pantry</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pantry">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Pantry</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCcw className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search pantry items..." className="mb-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pantryItems.map(item => (
                      <div key={item.id} className="p-4 border rounded-md">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{item.name}</h3>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.amount} {item.unit}</p>
                        {item.expirationDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Expires: {new Date(item.expirationDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add to Pantry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Item Name</label>
                      <Input placeholder="Enter item name" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Amount</label>
                        <Input type="number" placeholder="Amount" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Unit</label>
                        <Select defaultValue="g">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="g">grams (g)</SelectItem>
                            <SelectItem value="kg">kilograms (kg)</SelectItem>
                            <SelectItem value="ml">milliliters (ml)</SelectItem>
                            <SelectItem value="L">liters (L)</SelectItem>
                            <SelectItem value="item">item(s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select defaultValue="Other">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Fruits">Fruits</SelectItem>
                          <SelectItem value="Proteins">Proteins</SelectItem>
                          <SelectItem value="Dairy">Dairy</SelectItem>
                          <SelectItem value="Grains">Grains</SelectItem>
                          <SelectItem value="Pantry">Pantry</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiration Date</label>
                      <Input type="date" className="mt-1" />
                    </div>
                    <Button className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add to Pantry
                    </Button>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-sm mb-3">Pantry Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Items</span>
                        <span className="font-medium">{pantryItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categories</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expiring Soon</span>
                        <span className="font-medium text-orange-500">1</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Shopping;
