
import React from 'react';

interface NutrientBarProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  maxCalories?: number;
}

const NutrientBar: React.FC<NutrientBarProps> = ({
  calories,
  protein,
  carbs,
  fat,
  maxCalories = 1000 // Reasonable default for visualization
}) => {
  const total = calories;
  const scale = maxCalories / 100;
  
  const segments = [
    { name: 'Calories', value: calories / scale, color: 'bg-blue-400' },
    { name: 'Protein', value: (protein * 4) / scale, color: 'bg-red-400' },
    { name: 'Carbs', value: (carbs * 4) / scale, color: 'bg-green-400' },
    { name: 'Fat', value: (fat * 9) / scale, color: 'bg-yellow-400' }
  ];

  return (
    <div className="w-full space-y-1">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        {segments.map((segment, index) => (
          <div
            key={segment.name}
            className={`${segment.color} transition-all`}
            style={{ width: `${segment.value}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        {segments.map((segment) => (
          <span key={segment.name}>{segment.name}</span>
        ))}
      </div>
    </div>
  );
};

export default NutrientBar;
