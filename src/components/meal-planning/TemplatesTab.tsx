
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TemplatesTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Meal Plan Templates</CardTitle>
            <CardDescription>
              Create and use templates to speed up meal planning.
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Healthy Balance</CardTitle>
              <CardDescription>System Template</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">A nutritionally balanced plan that provides variety and adequate nutrients.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">High Protein</CardTitle>
              <CardDescription>System Template</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Focuses on protein-rich foods to support muscle growth and recovery.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vegetarian</CardTitle>
              <CardDescription>System Template</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Plant-based meals rich in nutrients and variety without meat.</p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">Use Template</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplatesTab;
