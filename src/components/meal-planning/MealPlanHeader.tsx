
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings, Wand2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserProfile } from '@/hooks/useUserProfile';

interface MealPlanHeaderProps {
  onGeneratePlan: () => void;
  onOpenPreferences: () => void;
  onStartWeeklyPlanning: () => void;
}

/**
 * Header component for the meal planning page - fully responsive
 */
const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  onGeneratePlan,
  onOpenPreferences,
  onStartWeeklyPlanning
}) => {
  const { t } = useLanguage();
  const { profile } = useUserProfile();
  
  // Check if user has an existing weekly plan
  const hasExistingPlan = profile?.currentWeekPlan?.selectedRecipes?.length > 0;

  return (
    <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('mealPlanning.title')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {t('mealPlanning.subtitle')}
          </p>
        </div>
        
        {/* Button group with responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button 
            onClick={onStartWeeklyPlanning}
            className="flex items-center justify-center gap-2 text-sm"
            variant="default"
          >
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">
              {hasExistingPlan ? 'Neuen Wochenplan erstellen' : 'Wochenplan erstellen'}
            </span>
            <span className="sm:hidden">
              {hasExistingPlan ? 'Neuer Plan' : 'Wochenplan'}
            </span>
          </Button>
          
          <Button 
            onClick={onGeneratePlan}
            variant="outline"
            className="flex items-center justify-center gap-2 text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t('mealPlanning.generatePlan')}</span>
            <span className="sm:hidden">Plan</span>
          </Button>
          
          <Button 
            onClick={onOpenPreferences}
            variant="outline"
            size="icon"
            className="lg:w-auto lg:px-3"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden lg:inline lg:ml-2">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanHeader;
