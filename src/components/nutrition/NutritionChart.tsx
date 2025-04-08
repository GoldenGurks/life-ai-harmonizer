
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NutrientData } from '@/types/meal-planning';

interface NutritionChartProps {
  data: NutrientData[];
  showAllNutrients?: boolean;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ data, showAllNutrients = false }) => {
  // Chart colors
  const config = {
    calories: { 
      label: "Calories",
      theme: {
        light: "#9b87f5",
        dark: "#9b87f5"
      }
    },
    protein: { 
      label: "Protein",
      theme: {
        light: "#33C3F0",
        dark: "#33C3F0"
      }
    },
    carbs: { 
      label: "Carbs",
      theme: {
        light: "#F97316",
        dark: "#F97316"
      }
    },
    fat: { 
      label: "Fat",
      theme: {
        light: "#10B981",
        dark: "#10B981"
      }
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{showAllNutrients ? 'Nutrition Trends' : 'Calorie Intake'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={config}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" />
              {showAllNutrients && (
                <YAxis yAxisId="right" orientation="right" />
              )}
              <ChartTooltip
                content={({ active, payload }) => (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload} 
                  />
                )}
              />
              <Legend />
              {!showAllNutrients ? (
                <Bar dataKey="calories" fill="var(--color-calories)" yAxisId="left" barSize={30} />
              ) : (
                <>
                  <Line type="monotone" dataKey="calories" stroke="var(--color-calories)" yAxisId="left" />
                  <Line type="monotone" dataKey="protein" stroke="var(--color-protein)" yAxisId="right" />
                  <Line type="monotone" dataKey="carbs" stroke="var(--color-carbs)" yAxisId="right" />
                  <Line type="monotone" dataKey="fat" stroke="var(--color-fat)" yAxisId="right" />
                </>
              )}
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;
