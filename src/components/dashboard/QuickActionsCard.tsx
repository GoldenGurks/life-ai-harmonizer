
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ShoppingCart, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/meal-planning')}>
          <Calendar className="h-4 w-4" />
          Plan Next Week
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/shopping')}>
          <ShoppingCart className="h-4 w-4" />
          View Shopping List
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" onClick={() => navigate('/recipes')}>
          <ChefHat className="h-4 w-4" />
          Find New Recipes
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
