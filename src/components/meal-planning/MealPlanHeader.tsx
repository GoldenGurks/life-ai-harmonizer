
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings, Wand2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface MealPlanHeaderProps {
  onGeneratePlan: () => void;
  onOpenPreferences: () => void;
  onStartWeeklyPlanning: () => void; // New prop
}

/**
 * Header component for the meal planning page
 */
const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  onGeneratePlan,
  onOpenPreferences,
  onStartWeeklyPlanning
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('mealPlanning.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('mealPlanning.subtitle')}
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={onStartWeeklyPlanning}
            className="flex items-center gap-2"
            variant="default"
          >
            <Wand2 className="h-4 w-4" />
            Wochenplan erstellen
          </Button>
          
          <Button 
            onClick={onGeneratePlan}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            {t('mealPlanning.generatePlan')}
          </Button>
          
          <Button 
            onClick={onOpenPreferences}
            variant="outline"
            size="icon"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanHeader;
