import { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MealItem } from '@/types/meal-planning';

interface Props {
  weeklyNutrition: MealItem[];
}

// Memoize the entire chart component
const MemoizedChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
      <XAxis dataKey="day" className="text-muted-foreground" />
      <YAxis className="text-muted-foreground" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }}
      />
      <Legend />
      <Line type="monotone" dataKey="calories" stroke="hsl(var(--primary))" strokeWidth={2} />
      <Line type="monotone" dataKey="protein" stroke="hsl(var(--chart-2))" strokeWidth={2} />
      <Line type="monotone" dataKey="carbs" stroke="hsl(var(--chart-3))" strokeWidth={2} />
      <Line type="monotone" dataKey="fat" stroke="hsl(var(--chart-4))" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
));

MemoizedChart.displayName = 'MemoizedChart';

export const NutritionDashboard = ({ weeklyNutrition }: Props) => {
  // Memoize chart data transformation
  const chartData = useMemo(() => {
    return weeklyNutrition.map((recipe, index) => ({
      day: `Day ${index + 1}`,
      calories: recipe.calories || 0,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0,
    }));
  }, [weeklyNutrition]);

  // Memoize health score calculations
  const healthScores = useMemo(() => {
    const totals = weeklyNutrition.reduce(
      (acc, recipe) => ({
        calories: acc.calories + (recipe.calories || 0),
        protein: acc.protein + (recipe.protein || 0),
        fiber: acc.fiber + (recipe.fiber || 0),
      }),
      { calories: 0, protein: 0, fiber: 0 }
    );

    return {
      satiety: totals.calories > 0 ? ((totals.protein + totals.fiber) / totals.calories * 100).toFixed(1) : '0',
      muscle: totals.calories > 0 ? ((totals.protein / totals.calories) * 100).toFixed(1) : '0',
      balance: totals.calories > 0 ? ((totals.protein + totals.fiber) / totals.calories * 50).toFixed(1) : '0',
    };
  }, [weeklyNutrition]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Weekly Nutrition Overview</h3>
        <MemoizedChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-muted-foreground">Satiety Score</h4>
          <p className="text-2xl font-bold mt-2">{healthScores.satiety}</p>
          <p className="text-xs text-muted-foreground mt-1">Protein + Fiber / Calories</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-muted-foreground">Muscle Score</h4>
          <p className="text-2xl font-bold mt-2">{healthScores.muscle}</p>
          <p className="text-xs text-muted-foreground mt-1">Protein / Calories</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <h4 className="text-sm font-medium text-muted-foreground">Balance Score</h4>
          <p className="text-2xl font-bold mt-2">{healthScores.balance}</p>
          <p className="text-xs text-muted-foreground mt-1">Overall Nutrition Balance</p>
        </div>
      </div>
    </div>
  );
};
