
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface NutrientProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
}

const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({
  label,
  value,
  max,
  unit,
  color = "bg-primary"
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value} / {max} {unit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn("h-2", {
          "[&>div]:bg-primary": color === "bg-primary",
          "[&>div]:bg-secondary": color === "bg-secondary",
          "[&>div]:bg-accent": color === "bg-accent",
        })}
      />
    </div>
  );
};

export default NutrientProgressBar;
