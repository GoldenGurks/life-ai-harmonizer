
import React from 'react';

interface NutrientProgressBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: string;
  showLabel?: boolean;
}

/**
 * Progress bar component for displaying nutrient values
 * Supports custom colors and optional label display
 */
const NutrientProgressBar: React.FC<NutrientProgressBarProps> = ({ 
  label, 
  value, 
  max, 
  unit, 
  color = "bg-primary",
  showLabel = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">
            {value} / {max} {unit}
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default NutrientProgressBar;
