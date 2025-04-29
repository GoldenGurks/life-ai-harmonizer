
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { useLanguage } from '@/hooks/useLanguage';

interface WeeklySetupModalProps {
  open: boolean;
  onClose: () => void;
  onSetup: (settings: WeeklySetupSettings) => void;
  initialSettings?: WeeklySetupSettings;
}

export interface WeeklySetupSettings {
  dishCount: number;
  includeBreakfast: boolean;
}

/**
 * Modal component for setting up weekly meal planning preferences
 * Allows users to select the number of dishes and whether to include breakfasts
 */
const WeeklySetupModal: React.FC<WeeklySetupModalProps> = ({
  open,
  onClose,
  onSetup,
  initialSettings
}) => {
  const { updateWeeklyMealCount } = useMealPreferences();
  const [dishCount, setDishCount] = useState(initialSettings?.dishCount || 7);
  const [includeBreakfast, setIncludeBreakfast] = useState(initialSettings?.includeBreakfast ?? true);
  const { t } = useLanguage();

  // Update state when initialSettings change
  useEffect(() => {
    if (initialSettings) {
      setDishCount(initialSettings.dishCount);
      setIncludeBreakfast(initialSettings.includeBreakfast);
    }
  }, [initialSettings]);

  const handleSave = () => {
    // Update the weekly meal count in our preferences hook
    updateWeeklyMealCount(dishCount);
    
    // Call the original setup handler
    onSetup({
      dishCount,
      includeBreakfast
    });
    
    // Explicitly call onClose to ensure the modal closes
    onClose();
  };

  // Handle the Cancel button click
  const handleCancel = () => {
    onClose();
  };

  // Handle dialog state change (when clicking outside or X button)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('weeklySetup.title')}</DialogTitle>
          <DialogDescription>
            {t('weeklySetup.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="dish-count" className="text-base font-medium">
                {t('weeklySetup.dishesCount', { count: dishCount })}
              </Label>
              <div className="flex items-center pt-2">
                <span className="text-sm text-muted-foreground mr-2">3</span>
                <Slider
                  id="dish-count"
                  min={3}
                  max={14}
                  step={1}
                  value={[dishCount]}
                  onValueChange={(value) => setDishCount(value[0])}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground ml-2">14</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="include-breakfast" className="text-base font-medium">
                {t('weeklySetup.includeBreakfast')}
              </Label>
              <div className="flex items-center">
                <Switch
                  id="include-breakfast"
                  checked={includeBreakfast}
                  onCheckedChange={setIncludeBreakfast}
                />
              </div>
            </div>
            
            <div className="rounded-md bg-muted p-3 mt-4">
              {includeBreakfast ? (
                <p className="text-sm text-muted-foreground">
                  {t('weeklySetup.includeBreakfastInfo')}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('weeklySetup.excludeBreakfastInfo')}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>{t('common.cancel')}</Button>
          <Button onClick={handleSave}>{t('weeklySetup.createButton')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklySetupModal;
