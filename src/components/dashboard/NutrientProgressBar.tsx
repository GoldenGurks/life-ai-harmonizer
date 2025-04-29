
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface NutrientProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
  isCost?: boolean;
}

const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({
  label,
  value,
  max,
  unit,
  color = "bg-primary",
  isCost = false
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  // Format cost values to show currency symbol
  const formattedValue = isCost ? 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value) : 
    `${value} ${unit}`;
  
  const formattedMax = isCost ? 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(max) : 
    `${max} ${unit}`;
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {isCost ? formattedValue : `${value} / ${max} ${unit}`}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={cn("h-2", {
          "[&>div]:bg-primary": color === "bg-primary",
          "[&>div]:bg-secondary": color === "bg-secondary",
          "[&>div]:bg-accent": color === "bg-accent",
          "[&>div]:bg-green-500": color === "bg-green-500",
          "[&>div]:bg-amber-500": color === "bg-amber-500",
          "[&>div]:bg-blue-500": color === "bg-blue-500",
        })}
      />
    </div>
  );
};

export default NutrientProgressBar;
