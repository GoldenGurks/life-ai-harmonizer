
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NutrientProgressBar from '@/components/dashboard/NutrientProgressBar';
import { NutrientGoal } from '@/types/meal-planning';

interface NutritionOverviewProps {
  nutrientGoals: NutrientGoal[];
}

const NutritionOverview: React.FC<NutritionOverviewProps> = ({ nutrientGoals }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Nutrition Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nutrientGoals.map((goal, idx) => (
          <NutrientProgressBar
            key={idx}
            label={goal.name}
            value={goal.current}
            max={goal.target}
            unit={goal.unit}
            color={idx === 0 ? "bg-primary" : idx === 1 ? "bg-secondary" : idx === 2 ? "bg-accent" : "bg-primary"}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default NutritionOverview;
