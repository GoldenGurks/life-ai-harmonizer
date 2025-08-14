import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePantry } from '@/hooks/usePantry';
import { useLanguage } from '@/hooks/useLanguage';
import PantryScanModal from '@/components/meal-planning/PantryScanModal';
import { toast } from 'sonner';
import { 
  Camera, 
  Receipt, 
  Plus, 
  Trash2, 
  Package,
  ShoppingCart,
  Check,
  X
} from 'lucide-react';

/**
 * Combined Pantry & Shopping page component
 * Provides pantry management, AI scanning, and shopping list functionality
 */
const PantryShopping = () => {
  const { t } = useLanguage();
  const pantry = usePantry();
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanType, setScanType] = useState<'fridge' | 'receipt'>('fridge');
  
  // Sample shopping list items (in real app, this would come from meal plan)
  const [shoppingItems, setShoppingItems] = useState([
    { id: '1', name: 'Chicken breast', quantity: 2, unit: 'lbs', category: 'Protein', checked: false },
    { id: '2', name: 'Broccoli', quantity: 1, unit: 'head', category: 'Vegetables', checked: false },
    { id: '3', name: 'Brown rice', quantity: 1, unit: 'bag', category: 'Grains', checked: true },
    { id: '4', name: 'Greek yogurt', quantity: 2, unit: 'containers', category: 'Dairy', checked: false },
  ]);

  // Manual add form state
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'piece',
    category: 'Other'
  });

  const handleScanPantry = (type: 'fridge' | 'receipt') => {
    setScanType(type);
    setShowScanModal(true);
  };

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    
    pantry.addPantryItem({
      name: newItem.name,
      quantity: parseInt(newItem.quantity) || 1,
      unit: newItem.unit,
      category: newItem.category,
      expirationDate: null,
      addedAt: new Date().toISOString()
    });
    
    setNewItem({ name: '', quantity: '', unit: 'piece', category: 'Other' });
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingItems(items => items.filter(item => item.id !== id));
    toast.success(t('shopping.itemRemoved'));
  };

  // Filter shopping items to exclude those we have in pantry
  const filteredShoppingItems = shoppingItems.filter(shopItem => {
    const inPantry = pantry.pantryItems.some(pantryItem => 
      pantryItem.name.toLowerCase().includes(shopItem.name.toLowerCase())
    );
    return !inPantry;
  });

  const categories = ['Protein', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];
  const units = ['piece', 'g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb'];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('shopping.title')}</h1>
        <p className="text-muted-foreground">
          Manage your pantry inventory and shopping list with AI assistance.
        </p>
      </div>

      <Tabs defaultValue="pantry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pantry" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t('shopping.pantry')}
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            {t('shopping.shopping')}
          </TabsTrigger>
        </TabsList>

        {/* Pantry Tab */}
        <TabsContent value="pantry" className="space-y-6">
          {/* AI Scanning Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t('mealPlanning.scanPantry')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => handleScanPantry('fridge')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                  {t('shopping.scanFridge')}
                </Button>
                <Button 
                  onClick={() => handleScanPantry('receipt')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Receipt className="h-4 w-4" />
                  {t('shopping.scanReceipt')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Add Item */}
          <Card>
            <CardHeader>
              <CardTitle>{t('shopping.addManually')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="item-name">{t('shopping.itemName')}</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">{t('shopping.quantity')}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">{t('shopping.unit')}</Label>
                  <Select 
                    value={newItem.unit} 
                    onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newItem.category} 
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddItem} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pantry Items List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Pantry ({pantry.pantryItems.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {pantry.pantryItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items in pantry. Add items manually or scan your fridge/receipts.
                </p>
              ) : (
                <div className="space-y-3">
                  {pantry.pantryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{item.quantity} {item.unit}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pantry.removePantryItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shopping Tab */}
        <TabsContent value="shopping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopping List</span>
                <Badge variant="outline">
                  {filteredShoppingItems.filter(item => !item.checked).length} items needed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredShoppingItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  All items are available in your pantry! No shopping needed.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredShoppingItems.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-opacity ${
                        item.checked ? 'opacity-50 bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleShoppingItem(item.id)}
                          className={`flex items-center justify-center w-5 h-5 border-2 rounded ${
                            item.checked 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {item.checked && <Check className="h-3 w-3" />}
                        </button>
                        <div>
                          <p className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{item.quantity} {item.unit}</span>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveShoppingItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Pantry Scan Modal */}
      {showScanModal && (
        <PantryScanModal
          isOpen={showScanModal}
          onClose={() => setShowScanModal(false)}
          scanType={scanType}
          onConfirmItems={(items) => {
            items.forEach(item => {
              pantry.addPantryItem({
                name: item.name,
                quantity: item.quantity || 1,
                unit: item.unit || 'piece',
                category: 'scanned',
                expirationDate: null,
                addedAt: new Date().toISOString()
              });
            });
            setShowScanModal(false);
          }}
        />
      )}
    </Layout>
  );
};

export default PantryShopping;