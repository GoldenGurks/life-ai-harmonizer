
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const Shopping = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping List</h1>
        <p className="text-muted-foreground">
          Manage your grocery list based on your meal plans.
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">This Week's Shopping</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Mark All
              </Button>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Generate from Meal Plan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produce section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Produce
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Spinach (2 bunches)', 'Tomatoes (4)', 'Carrots (1 bag)', 'Avocados (2)'].map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4" />
                        <span>{item}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                    </li>
                  ))}
                  <li>
                    <form className="flex mt-2">
                      <Input placeholder="Add item..." className="text-sm h-8" />
                      <Button type="submit" size="sm" className="ml-2 h-8">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Protein section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  Proteins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Chicken breast (1 lb)', 'Ground beef (1 lb)', 'Eggs (1 dozen)', 'Tofu (1 block)'].map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4" />
                        <span>{item}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                    </li>
                  ))}
                  <li>
                    <form className="flex mt-2">
                      <Input placeholder="Add item..." className="text-sm h-8" />
                      <Button type="submit" size="sm" className="ml-2 h-8">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Pantry section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                  Pantry & Grains
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Rice (2 lb bag)', 'Pasta (1 pack)', 'Olive oil (1 bottle)', 'Canned beans (2 cans)'].map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4" />
                        <span>{item}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                    </li>
                  ))}
                  <li>
                    <form className="flex mt-2">
                      <Input placeholder="Add item..." className="text-sm h-8" />
                      <Button type="submit" size="sm" className="ml-2 h-8">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Dairy section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  Dairy & Alternatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {['Milk (1 carton)', 'Greek yogurt (1 tub)', 'Cheese (8 oz)', 'Almond milk (1 carton)'].map((item, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4" />
                        <span>{item}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">×</Button>
                    </li>
                  ))}
                  <li>
                    <form className="flex mt-2">
                      <Input placeholder="Add item..." className="text-sm h-8" />
                      <Button type="submit" size="sm" className="ml-2 h-8">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </form>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
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
