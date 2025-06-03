
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface PlanSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPlan: () => void;
}

/**
 * Success modal shown after plan generation
 */
const PlanSuccessModal: React.FC<PlanSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewPlan
}) => {
  const handleViewPlan = () => {
    onViewPlan();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle>Dein Plan ist fertig!</DialogTitle>
          <DialogDescription className="text-center">
            Dein Wochenplan wurde erstellt und die Rezepte wurden zufällig verteilt. 
            Du kannst sie jetzt in der Wochenübersicht verschieben.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-2 mt-4">
          <Button onClick={handleViewPlan} className="w-full">
            Plan anzeigen
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanSuccessModal;
