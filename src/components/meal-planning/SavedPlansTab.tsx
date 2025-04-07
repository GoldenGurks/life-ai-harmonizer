
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SavedPlansTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Meal Plans</CardTitle>
        <CardDescription>
          Access your previously saved meal plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Balanced Week</CardTitle>
              <CardDescription>Created on April 3, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">A well-balanced meal plan focusing on variety and nutrition.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">View Plan</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">High Protein Plan</CardTitle>
              <CardDescription>Created on March 28, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Protein-focused meals to support workout recovery and muscle growth.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">View Plan</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedPlansTab;
