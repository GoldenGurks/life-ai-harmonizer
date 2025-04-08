
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MacroDistribution = () => {
  const [view, setView] = useState('actual');
  
  // Sample data - in a real app, this would come from an API or state management
  const actualData = [
    { name: 'Protein', value: 105, color: '#33C3F0' },
    { name: 'Carbs', value: 185, color: '#F97316' },
    { name: 'Fat', value: 68, color: '#10B981' },
  ];
  
  const recommendedData = [
    { name: 'Protein', value: 120, color: '#33C3F0' },
    { name: 'Carbs', value: 200, color: '#F97316' },
    { name: 'Fat', value: 65, color: '#10B981' },
  ];
  
  const config = {
    'Protein': { 
      label: "Protein",
      theme: {
        light: "#33C3F0",
        dark: "#33C3F0"
      }
    },
    'Carbs': { 
      label: "Carbs",
      theme: {
        light: "#F97316",
        dark: "#F97316"
      }
    },
    'Fat': { 
      label: "Fat",
      theme: {
        light: "#10B981",
        dark: "#10B981"
      }
    }
  };

  const currentData = view === 'actual' ? actualData : recommendedData;
  
  const calculatePercentage = (value: number) => {
    const total = currentData.reduce((sum, entry) => sum + entry.value, 0);
    return Math.round((value / total) * 100);
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Macronutrient Distribution</CardTitle>
          <Tabs value={view} onValueChange={setView} className="w-[220px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="actual">Actual</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] flex justify-center">
          <ChartContainer config={config}>
            <PieChart>
              <ChartTooltip
                content={({ active, payload }) => (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload}
                    formatter={(value) => `${value}g (${calculatePercentage(Number(value))}%)`}
                  />
                )}
              />
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${calculatePercentage(value)}%`}
                labelLine={false}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`var(--color-${entry.name})`} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MacroDistribution;
