
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { WeeklyPlan } from '@/types/meal-planning';

interface WeekOverviewProps {
  plan: WeeklyPlan;
}

const WeekOverview: React.FC<WeekOverviewProps> = ({ plan }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Meal Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Meal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day) => (
              <TableRow key={day}>
                <TableCell className="font-medium">{day}</TableCell>
                <TableCell>{plan.assignedDays[day]?.name || 'No meal assigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WeekOverview;
