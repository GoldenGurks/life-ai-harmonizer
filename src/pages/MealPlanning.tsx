
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChefHat, Utensils, Apple, Plus, Info, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface MealItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
}

interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
}

const MealPlanning = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentDay, setCurrentDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Sample meal plans data
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([
    {
      id: '1',
      name: 'Balanced Week',
      day: 'Monday',
      meals: [
        {
          id: '1',
          name: 'Greek Yogurt with Berries',
          description: 'Protein-rich Greek yogurt topped with fresh berries and honey',
          calories: 320,
          protein: 18,
          type: 'breakfast',
          tags: ['high-protein', 'quick']
        },
        {
          id: '2',
          name: 'Mediterranean Salad',
          description: 'Fresh greens with feta cheese, olives, tomatoes, and olive oil dressing',
          calories: 450,
          protein: 12,
          type: 'lunch',
          tags: ['vegetarian', 'fresh']
        },
        {
          id: '3',
          name: 'Grilled Salmon with Vegetables',
          description: 'Wild-caught salmon with steamed broccoli and sweet potatoes',
          calories: 580,
          protein: 32,
          type: 'dinner',
          tags: ['high-protein', 'omega-3']
        },
        {
          id: '4',
          name: 'Apple with Almond Butter',
          description: 'Sliced apple with 2 tbsp natural almond butter',
          calories: 210,
          protein: 5,
          type: 'snack',
          tags: ['quick', 'fiber']
        }
      ]
    }
  ]);

  const generateAIMealPlan = () => {
    toast({
      title: "AI-Generated Plan",
      description: "Your personalized meal plan is being created based on your preferences.",
    });
    
    // This would connect to an AI API in a real implementation
    setTimeout(() => {
      toast({
        title: "Meal Plan Ready!",
        description: "Your new meal plan has been created and is ready to review.",
      });
    }, 2000);
  };

  const handleMealChange = (mealId: string) => {
    toast({
      title: "Meal Options",
      description: "Showing alternative meals based on your preferences and nutritional goals.",
    });
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meal Planning</h1>
        <p className="text-muted-foreground">
          Create and manage your personalized meal plans with AI assistance.
        </p>
      </div>

      <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Plan</TabsTrigger>
            <TabsTrigger value="saved">Saved Plans</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          <Button onClick={generateAIMealPlan} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate AI Plan
          </Button>
        </div>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" /> 
                    April 7-13, 2025
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and modify your weekly meal plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                {days.map(day => (
                  <Button
                    key={day}
                    variant={currentDay === day ? "default" : "outline"}
                    onClick={() => setCurrentDay(day)}
                    className="px-4"
                  >
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>

              <div className="space-y-6">
                {/* Breakfast */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
                    <div className="flex items-center">
                      <ChefHat className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-lg">Breakfast</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMealChange('breakfast')}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-base">Greek Yogurt with Berries</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Protein-rich Greek yogurt topped with fresh berries and honey
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">320 kcal</Badge>
                        <Badge variant="outline" className="text-xs">18g protein</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">high-protein</Badge>
                        <Badge variant="secondary" className="text-xs">quick</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lunch */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-secondary mr-2" />
                      <CardTitle className="text-lg">Lunch</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMealChange('lunch')}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-base">Mediterranean Salad</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Fresh greens with feta cheese, olives, tomatoes, and olive oil dressing
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">450 kcal</Badge>
                        <Badge variant="outline" className="text-xs">12g protein</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">vegetarian</Badge>
                        <Badge variant="secondary" className="text-xs">fresh</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dinner */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-accent mr-2" />
                      <CardTitle className="text-lg">Dinner</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMealChange('dinner')}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-base">Grilled Salmon with Vegetables</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Wild-caught salmon with steamed broccoli and sweet potatoes
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">580 kcal</Badge>
                        <Badge variant="outline" className="text-xs">32g protein</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">high-protein</Badge>
                        <Badge variant="secondary" className="text-xs">omega-3</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Snack */}
                <Card>
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
                    <div className="flex items-center">
                      <Apple className="h-5 w-5 text-primary mr-2" />
                      <CardTitle className="text-lg">Snack</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMealChange('snack')}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-base">Apple with Almond Butter</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Sliced apple with 2 tbsp natural almond butter
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">210 kcal</Badge>
                        <Badge variant="outline" className="text-xs">5g protein</Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Badge variant="secondary" className="text-xs">quick</Badge>
                        <Badge variant="secondary" className="text-xs">fiber</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="mr-2">Save Plan</Button>
                <Button>
                  <Info className="h-4 w-4 mr-2" />
                  View Nutrition Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Meal Plans</CardTitle>
              <CardDescription>
                Access your previously saved meal plans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Balanced Week</CardTitle>
                    <CardDescription>Created on April 3, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A well-balanced meal plan focusing on variety and nutrition.</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">View Plan</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">High Protein Plan</CardTitle>
                    <CardDescription>Created on March 28, 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Protein-focused meals to support workout recovery and muscle growth.</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">View Plan</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Meal Plan Templates</CardTitle>
                  <CardDescription>
                    Create and use templates to speed up meal planning.
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-2 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Healthy Balance</CardTitle>
                    <CardDescription>System Template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">A nutritionally balanced plan that provides variety and adequate nutrients.</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">High Protein</CardTitle>
                    <CardDescription>System Template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Focuses on protein-rich foods to support muscle growth and recovery.</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Vegetarian</CardTitle>
                    <CardDescription>System Template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Plant-based meals rich in nutrients and variety without meat.</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default MealPlanning;
