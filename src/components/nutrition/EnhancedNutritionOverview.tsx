import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';

interface NutrientData {
  name: string;
  current: number;
  target: number;
  unit: string;
  category: 'macros' | 'vitamins' | 'minerals';
  trend?: 'up' | 'down' | 'stable';
}

interface EnhancedNutritionOverviewProps {
  nutrientData: NutrientData[];
  weeklyAverage?: number;
  goalCompliance?: number;
}

/**
 * Enhanced nutrition overview with better visual hierarchy and insights
 */
const EnhancedNutritionOverview: React.FC<EnhancedNutritionOverviewProps> = ({
  nutrientData,
  weeklyAverage = 85,
  goalCompliance = 78
}) => {
  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 70) return 'bg-destructive';
    if (percentage < 90) return 'bg-warning';
    if (percentage > 110) return 'bg-warning';
    return 'bg-primary';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Target className="h-3 w-3 text-blue-500" />;
    }
  };

  const macros = nutrientData.filter(n => n.category === 'macros');
  const vitamins = nutrientData.filter(n => n.category === 'vitamins');
  const minerals = nutrientData.filter(n => n.category === 'minerals');

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wöchlicher Durchschnitt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{weeklyAverage}%</div>
            <p className="text-xs text-muted-foreground">der Ziele erreicht</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ziel-Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{goalCompliance}%</div>
            <p className="text-xs text-muted-foreground">innerhalb der Toleranz</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={goalCompliance > 80 ? 'default' : 'secondary'} className="text-sm">
              {goalCompliance > 80 ? 'Auf Kurs' : 'Verbesserbar'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Macronutrients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Makronährstoffe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {macros.map((nutrient, index) => {
            const percentage = getProgressPercentage(nutrient.current, nutrient.target);
            const isOverTarget = nutrient.current > nutrient.target;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{nutrient.name}</span>
                    {getTrendIcon(nutrient.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {nutrient.current}{nutrient.unit} / {nutrient.target}{nutrient.unit}
                    </span>
                    {isOverTarget && <AlertCircle className="h-4 w-4 text-warning" />}
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}%</span>
                    <span className={isOverTarget ? 'text-warning' : ''}>
                      {isOverTarget ? `+${nutrient.current - nutrient.target}${nutrient.unit} über Ziel` : ''}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Micronutrients */}
      {(vitamins.length > 0 || minerals.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vitamins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vitamine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vitamins.map((nutrient, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{nutrient.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={getProgressPercentage(nutrient.current, nutrient.target)} 
                        className="w-20 h-2"
                      />
                      <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                        {Math.round(getProgressPercentage(nutrient.current, nutrient.target))}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {minerals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mineralstoffe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {minerals.map((nutrient, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{nutrient.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={getProgressPercentage(nutrient.current, nutrient.target)} 
                        className="w-20 h-2"
                      />
                      <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                        {Math.round(getProgressPercentage(nutrient.current, nutrient.target))}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedNutritionOverview;