
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlanTypeToggleProps {
  planType: 'daily' | 'weekly';
  onChange: (type: 'daily' | 'weekly') => void;
}

const PlanTypeToggle: React.FC<PlanTypeToggleProps> = ({ planType, onChange }) => {
  return (
    <div className="flex items-center space-x-2 mb-6 bg-muted/50 p-1 rounded-lg w-fit">
      <Button
        variant={planType === 'daily' ? 'default' : 'ghost'}
        size="sm"
        className="px-4"
        onClick={() => onChange('daily')}
      >
        Daily Plan
      </Button>
      <Button
        variant={planType === 'weekly' ? 'default' : 'ghost'}
        size="sm" 
        className="px-4"
        onClick={() => onChange('weekly')}
      >
        Weekly Plan
      </Button>
    </div>
  );
};

export default PlanTypeToggle;
