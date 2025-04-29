
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Zap, Clipboard, ChevronRight } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onSetupChoice: (choice: 'quick' | 'detailed') => void;
}

/**
 * Welcome modal for meal planning that allows users to choose between 
 * quick setup or detailed planning
 */
const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, onSetupChoice }) => {
  const [selectedOption, setSelectedOption] = useState<'quick' | 'detailed'>('quick');
  const { isProfileComplete } = useUserProfile();
  const { t } = useLanguage();

  // Handle dialog state change (when clicking outside or X button)
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleContinue = () => {
    if (!selectedOption) {
      toast.error(t('welcomeModal.selectMethodError'));
      return;
    }
    
    onSetupChoice(selectedOption);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('welcomeModal.title')}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            {t('welcomeModal.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-3">{t('welcomeModal.chooseSetupMethod')}</h3>
          
          <RadioGroup value={selectedOption} onValueChange={(value: any) => setSelectedOption(value)} className="space-y-4">
            <div 
              className="flex items-start space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer" 
              onClick={() => setSelectedOption('quick')}
            >
              <RadioGroupItem value="quick" id="quick" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-amber-500" />
                  <Label htmlFor="quick" className="text-lg font-medium cursor-pointer">{t('welcomeModal.quickSetup')}</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  {t('welcomeModal.quickSetupDescription')}
                </p>
              </div>
            </div>
            
            <div 
              className="flex items-start space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer" 
              onClick={() => setSelectedOption('detailed')}
            >
              <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center">
                  <Clipboard className="h-4 w-4 mr-2 text-blue-500" />
                  <Label htmlFor="detailed" className="text-lg font-medium cursor-pointer">{t('welcomeModal.detailedPlanning')}</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  {t('welcomeModal.detailedPlanningDescription')}
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleContinue} className="gap-2">
            {t('common.continue')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
