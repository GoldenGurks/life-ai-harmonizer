
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

interface MealCardProps {
  title: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  calories: number;
  protein: number;
  tags: string[];
  onMealChange: (mealType: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  icon,
  name,
  description,
  calories,
  protein,
  tags,
  onMealChange,
}) => {
  return (
    <Card>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
        <div className="flex items-center">
          {icon}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onMealChange(title.toLowerCase())}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-medium text-base">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1">
          {description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex space-x-2">
            <Badge variant="outline" className="text-xs">{calories} kcal</Badge>
            <Badge variant="outline" className="text-xs">{protein}g protein</Badge>
          </div>
          <div className="flex space-x-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
