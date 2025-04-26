
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';
import { WeeklyPlan } from '@/types/meal-planning';

interface WeekOverviewProps {
  plan: WeeklyPlan;
}

const WeekOverview: React.FC<WeekOverviewProps> = ({ plan }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {days.map((day) => {
        const meal = plan.assignedDays[day];
        
        return (
          <Card key={day} className="overflow-hidden">
            <div className="p-3 pb-2 text-center border-b">
              <h3 className="text-sm font-medium">{day}</h3>
            </div>
            <CardContent className="p-3">
              {meal ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    {meal.image ? (
                      <img 
                        src={meal.image} 
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium line-clamp-1 text-center">{meal.name}</p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-4">No meal assigned</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WeekOverview;
