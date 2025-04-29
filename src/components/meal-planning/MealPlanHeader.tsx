
import React from 'react';
import { RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from './LanguageSelector';

interface MealPlanHeaderProps {
  onGeneratePlan: () => void;
  onOpenPreferences: () => void;
}

/**
 * Header component for the meal planning page
 * Contains title, subtitle, and action buttons
 */
const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  onGeneratePlan,
  onOpenPreferences
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 uppercase">{t('mealPlanning.title')}</h1>
      <p className="text-muted-foreground">
        {t('mealPlanning.subtitle')}
      </p>
      <div className="flex justify-end gap-2 flex-wrap mt-4">
        <LanguageSelector />
        <Button variant="outline" onClick={onOpenPreferences} className="gap-2">
          <Settings className="h-4 w-4" />
          {t('mealPlanning.preferences')}
        </Button>
        <Button onClick={onGeneratePlan} className="gap-2 bg-primary hover:bg-primary/90">
          <RefreshCw className="h-4 w-4" />
          {t('mealPlanning.generateAIPlan')}
        </Button>
      </div>
    </div>
  );
};

export default MealPlanHeader;
