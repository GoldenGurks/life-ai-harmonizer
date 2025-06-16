
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import NutrientProgressBar from './NutrientProgressBar';

interface WeeklyProgressData {
  calories: { current: number; target: number; daily: number };
  protein: { current: number; target: number; daily: number };
  carbs: { current: number; target: number; daily: number };
  fat: { current: number; target: number; daily: number };
}

interface WeeklyProgressCardProps {
  weeklyProgress: WeeklyProgressData;
}

const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({ weeklyProgress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Calories</span>
            <span className="text-muted-foreground">
              {weeklyProgress.calories.current} / {weeklyProgress.calories.target}
            </span>
          </div>
          <NutrientProgressBar 
            label="" 
            value={weeklyProgress.calories.current} 
            max={weeklyProgress.calories.target} 
            unit="kcal"
            showLabel={false}
          />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Protein</span>
            <span className="text-muted-foreground">
              {weeklyProgress.protein.current}g / {weeklyProgress.protein.target}g
            </span>
          </div>
          <NutrientProgressBar 
            label="" 
            value={weeklyProgress.protein.current} 
            max={weeklyProgress.protein.target} 
            unit="g"
            color="bg-secondary"
            showLabel={false}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Carbs</span>
            <span className="text-muted-foreground">
              {weeklyProgress.carbs.current}g / {weeklyProgress.carbs.target}g
            </span>
          </div>
          <NutrientProgressBar 
            label="" 
            value={weeklyProgress.carbs.current} 
            max={weeklyProgress.carbs.target} 
            unit="g"
            color="bg-accent"
            showLabel={false}
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Fat</span>
            <span className="text-muted-foreground">
              {weeklyProgress.fat.current}g / {weeklyProgress.fat.target}g
            </span>
          </div>
          <NutrientProgressBar 
            label="" 
            value={weeklyProgress.fat.current} 
            max={weeklyProgress.fat.target} 
            unit="g"
            color="bg-primary"
            showLabel={false}
          />
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Daily avg: {weeklyProgress.calories.daily} kcal
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressCard;
