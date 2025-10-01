
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MealCountSelectorProps {
  mealCount: number;
  onMealCountChange: (count: number) => void;
  onConfirm: () => void;
}

const MAX_DISHES = 15;

/**
 * Component to select the number of meals for the weekly plan
 */
const MealCountSelector: React.FC<MealCountSelectorProps> = ({
  mealCount,
  onMealCountChange,
  onConfirm
}) => {
  const mealOptions = [3, 4, 5, 6, 7];
  const [customInput, setCustomInput] = React.useState('');

  const handleMealCountChange = (count: number) => {
    if (count > MAX_DISHES) {
      toast.warning(`Maximum ${MAX_DISHES} dishes allowed for optimal performance`);
      onMealCountChange(MAX_DISHES);
    } else {
      onMealCountChange(count);
    }
  };

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
              onValueChange={(value) => handleMealCountChange(value[0])}
              min={3}
              max={MAX_DISHES}
              step={1}
              className="w-full"
            />
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Select up to {MAX_DISHES} dishes for your weekly plan
          </p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            {mealOptions.map((count) => (
              <Button
                key={count}
                variant={mealCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => handleMealCountChange(count)}
                className="w-12 h-12"
              >
                {count}
              </Button>
            ))}
          </div>
          
          {/* Free input field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Oder gib eine eigene Anzahl ein:</label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max={MAX_DISHES}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="z.B. 10"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  const count = parseInt(customInput);
                  if (count && count >= 1 && count <= MAX_DISHES) {
                    handleMealCountChange(count);
                    setCustomInput('');
                  }
                }}
                disabled={!customInput || parseInt(customInput) < 1 || parseInt(customInput) > MAX_DISHES}
              >
                OK
              </Button>
            </div>
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
