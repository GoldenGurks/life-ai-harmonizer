
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Zap, Clipboard, ChevronRight } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onSetupChoice: (choice: 'quick' | 'detailed') => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, onSetupChoice }) => {
  const [selectedOption, setSelectedOption] = React.useState<'quick' | 'detailed'>('quick');

  const handleContinue = () => {
    onSetupChoice(selectedOption);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Meal Planning</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Let's get started by setting up your personalized meal plan experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-3">Choose your setup method:</h3>
          
          <RadioGroup value={selectedOption} onValueChange={(value: any) => setSelectedOption(value)} className="space-y-4">
            <div className="flex items-start space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedOption('quick')}>
              <RadioGroupItem value="quick" id="quick" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-amber-500" />
                  <Label htmlFor="quick" className="text-lg font-medium cursor-pointer">Quick Setup</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  Choose from pre-defined profiles like Healthy, Comfort Food, or Muscle Building. Perfect for getting started quickly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedOption('detailed')}>
              <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center">
                  <Clipboard className="h-4 w-4 mr-2 text-blue-500" />
                  <Label htmlFor="detailed" className="text-lg font-medium cursor-pointer">Detailed Planning</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1 ml-6">
                  Complete a comprehensive interview with our AI assistant to create a highly personalized meal plan based on your specific preferences and goals.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleContinue} className="gap-2">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
