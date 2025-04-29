
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface MealPlanTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

/**
 * Tab navigation component for the meal planning page
 */
const MealPlanTabs: React.FC<MealPlanTabsProps> = ({
  activeTab,
  onValueChange,
  children
}) => {
  const { t } = useLanguage();

  return (
    <Tabs defaultValue="weekly" value={activeTab} onValueChange={onValueChange} className="w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="weekly" className="uppercase flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('mealPlanning.weeklyPlan')}
          </TabsTrigger>
          <TabsTrigger value="tinder-dish" className="uppercase flex items-center gap-2">
            <List className="h-4 w-4" />
            {t('mealPlanning.mealDiscovery')}
          </TabsTrigger>
          <TabsTrigger value="saved" className="uppercase">{t('mealPlanning.savedPlans')}</TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default MealPlanTabs;
