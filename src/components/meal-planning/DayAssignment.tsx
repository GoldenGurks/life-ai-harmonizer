
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MealItem } from '@/types/meal-planning';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface DayAssignmentProps {
  selectedRecipes: MealItem[];
  onAssign: (assignments: { [key: string]: MealItem }) => void;
}

const DayAssignment: React.FC<DayAssignmentProps> = ({ selectedRecipes, onAssign }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [assignments, setAssignments] = useState<{ [key: string]: MealItem }>({});

  const handleAssign = (day: string, recipe: MealItem) => {
    // Remove recipe from any other day it might be assigned to
    const newAssignments = Object.fromEntries(
      Object.entries(assignments).filter(([_, r]) => r.id !== recipe.id)
    );
    
    // Assign to new day
    newAssignments[day] = recipe;
    setAssignments(newAssignments);
  };

  const handleSave = () => {
    if (Object.keys(assignments).length !== days.length) {
      toast.error("Please assign all recipes to days");
      return;
    }
    onAssign(assignments);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {days.map((day) => (
          <Card key={day} className="overflow-hidden">
            <CardHeader className="p-4">
              <h3 className="font-medium">{day}</h3>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                {selectedRecipes.map((recipe) => (
                  <Button
                    key={recipe.id}
                    variant={assignments[day]?.id === recipe.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => handleAssign(day, recipe)}
                  >
                    {recipe.name}
                    {assignments[day]?.id === recipe.id && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={Object.keys(assignments).length !== days.length}
        >
          Save Weekly Plan
        </Button>
      </div>
    </div>
  );
};

export default DayAssignment;
