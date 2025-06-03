
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface MealCountSelectorProps {
  mealCount: number;
  onMealCountChange: (count: number) => void;
  onConfirm: () => void;
}

/**
 * Component to select the number of meals for the weekly plan
 */
const MealCountSelector: React.FC<MealCountSelectorProps> = ({
  mealCount,
  onMealCountChange,
  onConfirm
}) => {
  const mealOptions = [3, 4, 5, 6, 7];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Anzahl der Gerichte wählen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {mealCount} Gerichte
            </Badge>
          </div>
          
          <div className="px-4">
            <Slider
              value={[mealCount]}
              onValueChange={(value) => onMealCountChange(value[0])}
              min={3}
              max={7}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {mealOptions.map((count) => (
              <Button
                key={count}
                variant={mealCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => onMealCountChange(count)}
                className="w-12 h-12"
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
        
        <Button onClick={onConfirm} className="w-full" size="lg">
          Weiter zur Auswahl
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCountSelector;
