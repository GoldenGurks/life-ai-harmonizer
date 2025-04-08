
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import NutrientProgressBar from '@/components/dashboard/NutrientProgressBar';
import NutritionOverview from '@/components/nutrition/NutritionOverview';
import NutritionChart from '@/components/nutrition/NutritionChart';
import MacroDistribution from '@/components/nutrition/MacroDistribution';
import RecommendationCard from '@/components/nutrition/RecommendationCard';

const Nutrition = () => {
  // Sample data - in a real app, this would come from an API or state management
  const dailyNutrients = [
    { day: 'Monday', calories: 1850, protein: 95, carbs: 180, fat: 62 },
    { day: 'Tuesday', calories: 1920, protein: 105, carbs: 165, fat: 70 },
    { day: 'Wednesday', calories: 2100, protein: 110, carbs: 210, fat: 65 },
    { day: 'Thursday', calories: 1750, protein: 90, carbs: 155, fat: 60 },
    { day: 'Friday', calories: 2050, protein: 115, carbs: 190, fat: 75 },
    { day: 'Saturday', calories: 2200, protein: 100, carbs: 220, fat: 80 },
    { day: 'Sunday', calories: 1900, protein: 95, carbs: 175, fat: 68 },
  ];

  const nutrientGoals = [
    { name: 'Calories', current: 1950, target: 2000, unit: 'kcal' },
    { name: 'Protein', current: 100, target: 120, unit: 'g' },
    { name: 'Carbs', current: 185, target: 200, unit: 'g' },
    { name: 'Fat', current: 68, target: 65, unit: 'g' },
    { name: 'Fiber', current: 22, target: 30, unit: 'g' },
    { name: 'Sugar', current: 45, target: 36, unit: 'g' },
  ];

  const recommendations = [
    {
      id: '1',
      title: 'Increase Protein Intake',
      description: 'You\'re consistently below your protein target. Consider adding more lean meats, eggs, or plant-based proteins to your meals.',
      category: 'macros',
    },
    {
      id: '2',
      title: 'Reduce Sugar Consumption',
      description: 'Your sugar intake is above the recommended limit. Try replacing sugary snacks with fruits or nuts.',
      category: 'nutrients',
    },
    {
      id: '3',
      title: 'Add More Fiber',
      description: 'Increasing your fiber intake can improve digestion and help maintain steady energy levels throughout the day.',
      category: 'nutrients',
    },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nutrition Analytics</h1>
        <p className="text-muted-foreground">
          Track, analyze, and optimize your nutrition habits with AI-powered insights.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="macros">Macronutrients</TabsTrigger>
            <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NutritionOverview nutrientGoals={nutrientGoals.slice(0, 4)} />
            <div className="md:col-span-2">
              <NutritionChart data={dailyNutrients} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MacroDistribution />
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} {...rec} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="macros" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nutrientGoals.slice(1, 4).map((goal, idx) => (
                  <NutrientProgressBar
                    key={idx}
                    label={goal.name}
                    value={goal.current}
                    max={goal.target}
                    unit={goal.unit}
                    color={idx === 0 ? "bg-secondary" : idx === 1 ? "bg-accent" : "bg-primary"}
                  />
                ))}
              </CardContent>
            </Card>
            <MacroDistribution />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Macronutrient Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead className="text-right">Protein</TableHead>
                    <TableHead className="text-right">Carbs</TableHead>
                    <TableHead className="text-right">Fat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyNutrients.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell>{day.day}</TableCell>
                      <TableCell className="text-right">{day.protein}g</TableCell>
                      <TableCell className="text-right">{day.carbs}g</TableCell>
                      <TableCell className="text-right">{day.fat}g</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <NutritionChart data={dailyNutrients} showAllNutrients={true} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Averages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nutrientGoals.map((goal, idx) => (
                  <NutrientProgressBar
                    key={idx}
                    label={goal.name}
                    value={goal.current}
                    max={goal.target}
                    unit={goal.unit}
                    color={idx % 3 === 0 ? "bg-primary" : idx % 3 === 1 ? "bg-secondary" : "bg-accent"}
                  />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} {...rec} />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Nutrition;
