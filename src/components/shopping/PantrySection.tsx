
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, PlusCircle } from 'lucide-react';
import { PantryItem } from '@/types/meal-planning';

interface PantrySectionProps {
  pantryItems: PantryItem[];
}

const PantrySection = ({ pantryItems }: PantrySectionProps) => {
  return (
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
                    {['Vegetables', 'Fruits', 'Proteins', 'Dairy', 'Grains', 'Pantry', 'Other'].map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
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
  );
};

export default PantrySection;
