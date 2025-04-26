
import React from 'react';

interface NutrientBarProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  maxCalories?: number;
  showLegend?: boolean;
}

const NutrientBar: React.FC<NutrientBarProps> = ({
  calories,
  protein,
  carbs,
  fat,
  maxCalories = 2000, // More reasonable default for visualization
  showLegend = false
}) => {
  // Calculate percentages for the bar segments
  const caloriesPercent = Math.min(100, (calories / maxCalories) * 100);
  const proteinCalories = protein * 4;
  const carbCalories = carbs * 4;
  const fatCalories = fat * 9;
  const totalMacroCalories = proteinCalories + carbCalories + fatCalories;
  
  // Calculate proportions of each macro
  const proteinPct = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
  const carbPct = totalMacroCalories > 0 ? (carbCalories / totalMacroCalories) * 100 : 0;
  const fatPct = totalMacroCalories > 0 ? (fatCalories / totalMacroCalories) * 100 : 0;

  return (
    <div className="w-full space-y-1">
      {showLegend && (
        <div className="flex mb-2 text-xs justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 mr-1 rounded-sm"></div>
            <span>Calories</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 mr-1 rounded-sm"></div>
            <span>Protein</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 mr-1 rounded-sm"></div>
            <span>Carbs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 mr-1 rounded-sm"></div>
            <span>Fat</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>{calories}</span>
          <span>{protein}g</span>
          <span>{carbs}g</span>
          <span>{fat}g</span>
        </div>
        
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div className="bg-red-400 transition-all" style={{ width: `${proteinPct}%` }}></div>
          <div className="bg-green-400 transition-all" style={{ width: `${carbPct}%` }}></div>
          <div className="bg-yellow-400 transition-all" style={{ width: `${fatPct}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default NutrientBar;
