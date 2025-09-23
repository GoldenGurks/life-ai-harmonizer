
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
 * Tab navigation component for the meal planning page - fully responsive
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
        <TabsList className="h-auto flex-wrap w-full sm:w-auto">
          <TabsTrigger value="weekly" className="uppercase flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('mealPlanning.weeklyPlan')}</span>
            <span className="sm:hidden">Weekly</span>
          </TabsTrigger>
          <TabsTrigger value="tinder" className="uppercase flex items-center gap-2 text-xs sm:text-sm px-2 sm:px-4">
            <List className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('mealPlanning.tinderDish')}</span>
            <span className="sm:hidden">Training</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="uppercase text-xs sm:text-sm px-2 sm:px-4">
            <span className="hidden sm:inline">{t('mealPlanning.savedPlans')}</span>
            <span className="sm:hidden">Saved</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};

export default MealPlanTabs;
