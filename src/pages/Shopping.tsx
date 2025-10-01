
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Check, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';

interface ShoppingListItem {
  name: string;
  amount: string;
  unit: string;
  inPantry: boolean;
  checked?: boolean;
}

interface SavedShoppingList {
  items: ShoppingListItem[];
  generatedAt: string;
  meals: string[];
}

const Shopping = () => {
  const { profile } = useUserProfile();
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const [sourceMeals, setSourceMeals] = useState<string[]>([]);

  // Load shopping list from localStorage on mount
  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = () => {
    const savedData = localStorage.getItem('weeklyShoppingList');
    if (savedData) {
      try {
        const parsed: SavedShoppingList = JSON.parse(savedData);
        setShoppingList(parsed.items);
        setLastGenerated(parsed.generatedAt);
        setSourceMeals(parsed.meals);
      } catch (error) {
        console.error('Failed to load shopping list:', error);
      }
    }
  };

  const syncShoppingList = () => {
    setIsAutoSyncing(true);
    loadShoppingList();
    
    setTimeout(() => {
      setIsAutoSyncing(false);
      toast.success('Einkaufsliste wurde aktualisiert!');
    }, 500);
  };

  const toggleItemChecked = (index: number) => {
    setShoppingList(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (index: number) => {
    setShoppingList(prev => prev.filter((_, i) => i !== index));
  };

  const addCustomItem = (name: string) => {
    if (name.trim()) {
      setShoppingList(prev => [...prev, {
        name: name.trim(),
        amount: '1',
        unit: 'unit',
        inPantry: false,
        checked: false
      }]);
    }
  };

  // Categorize items
  const categorizedItems = {
    produce: shoppingList.filter(item => 
      ['vegetable', 'fruit', 'produce', 'tomato', 'spinach', 'carrot', 'avocado', 'lettuce', 'onion', 'garlic'].some(keyword => 
        item.name.toLowerCase().includes(keyword)
      )
    ),
    proteins: shoppingList.filter(item => 
      ['chicken', 'beef', 'pork', 'fish', 'egg', 'tofu', 'meat', 'protein'].some(keyword => 
        item.name.toLowerCase().includes(keyword)
      )
    ),
    pantry: shoppingList.filter(item => 
      ['rice', 'pasta', 'oil', 'bean', 'flour', 'sugar', 'salt', 'spice', 'sauce'].some(keyword => 
        item.name.toLowerCase().includes(keyword)
      )
    ),
    dairy: shoppingList.filter(item => 
      ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'dairy'].some(keyword => 
        item.name.toLowerCase().includes(keyword)
      )
    ),
  };

  // Items that don't fit into categories
  const uncategorizedItems = shoppingList.filter(item => 
    !categorizedItems.produce.includes(item) &&
    !categorizedItems.proteins.includes(item) &&
    !categorizedItems.pantry.includes(item) &&
    !categorizedItems.dairy.includes(item)
  );

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Einkaufsliste</h1>
            <p className="text-muted-foreground">
              Verwalte deine Einkaufsliste basierend auf deinen Mahlzeitenplänen.
            </p>
            {lastGenerated && (
              <p className="text-sm text-muted-foreground mt-1">
                Generiert: {new Date(lastGenerated).toLocaleString('de-DE')}
                {sourceMeals.length > 0 && ` • ${sourceMeals.length} Gerichte`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {shoppingList.length > 0 && (
              <Badge variant="outline">
                {shoppingList.filter(item => !item.inPantry).length} Artikel
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncShoppingList}
              disabled={isAutoSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isAutoSyncing ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {shoppingList.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Keine Einkaufsliste</h3>
              <p className="text-muted-foreground mb-4">
                Erstelle einen Wochenplan und generiere eine Einkaufsliste aus deinen ausgewählten Gerichten.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">This Week's Shopping</h2>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShoppingList(prev => prev.map(item => ({ ...item, checked: true })))}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Produce section */}
                {(categorizedItems.produce.length > 0 || uncategorizedItems.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Produce
                        {categorizedItems.produce.length > 0 && (
                          <Badge variant="secondary" className="ml-2">{categorizedItems.produce.length}</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {categorizedItems.produce.map((item, i) => (
                          <li key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4" 
                                checked={item.checked}
                                onChange={() => toggleItemChecked(shoppingList.indexOf(item))}
                              />
                              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                {item.name}
                              </span>
                              {item.inPantry && (
                                <Badge variant="outline" className="text-xs">in pantry</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.amount} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => removeItem(shoppingList.indexOf(item))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Protein section */}
                {categorizedItems.proteins.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        Proteins
                        <Badge variant="secondary" className="ml-2">{categorizedItems.proteins.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {categorizedItems.proteins.map((item, i) => (
                          <li key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4" 
                                checked={item.checked}
                                onChange={() => toggleItemChecked(shoppingList.indexOf(item))}
                              />
                              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                {item.name}
                              </span>
                              {item.inPantry && (
                                <Badge variant="outline" className="text-xs">in pantry</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.amount} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => removeItem(shoppingList.indexOf(item))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Pantry section */}
                {categorizedItems.pantry.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                        Pantry & Grains
                        <Badge variant="secondary" className="ml-2">{categorizedItems.pantry.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {categorizedItems.pantry.map((item, i) => (
                          <li key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4" 
                                checked={item.checked}
                                onChange={() => toggleItemChecked(shoppingList.indexOf(item))}
                              />
                              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                {item.name}
                              </span>
                              {item.inPantry && (
                                <Badge variant="outline" className="text-xs">in pantry</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.amount} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => removeItem(shoppingList.indexOf(item))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Dairy section */}
                {categorizedItems.dairy.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        Dairy & Alternatives
                        <Badge variant="secondary" className="ml-2">{categorizedItems.dairy.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {categorizedItems.dairy.map((item, i) => (
                          <li key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4" 
                                checked={item.checked}
                                onChange={() => toggleItemChecked(shoppingList.indexOf(item))}
                              />
                              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                {item.name}
                              </span>
                              {item.inPantry && (
                                <Badge variant="outline" className="text-xs">in pantry</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.amount} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => removeItem(shoppingList.indexOf(item))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Uncategorized items */}
                {uncategorizedItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
                        Other Items
                        <Badge variant="secondary" className="ml-2">{uncategorizedItems.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {uncategorizedItems.map((item, i) => (
                          <li key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 flex-1">
                              <input 
                                type="checkbox" 
                                className="h-4 w-4" 
                                checked={item.checked}
                                onChange={() => toggleItemChecked(shoppingList.indexOf(item))}
                              />
                              <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                {item.name}
                              </span>
                              {item.inPantry && (
                                <Badge variant="outline" className="text-xs">in pantry</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {item.amount} {item.unit}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={() => removeItem(shoppingList.indexOf(item))}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="text-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Shopping History</h3>
            <p className="text-muted-foreground mb-4">
              Your past shopping lists will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="text-center py-16">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Shopping Templates</h3>
            <p className="text-muted-foreground mb-4">
              Create reusable shopping templates for your regular grocery runs.
            </p>
            <Button>Create Template</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Shopping;
