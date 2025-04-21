
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Coffee, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMealPreferences } from '@/hooks/useMealPreferences';

interface QuickSetupModalProps {
  open: boolean;
  onClose: () => void;
}

const QuickSetupModal: React.FC<QuickSetupModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const { completeSetup, setQuickSetupProfile } = useMealPreferences();
  
  const handleProfileSelect = (profile: string) => {
    // Store the quick setup profile selection
    setQuickSetupProfile(profile);
    
    // Set appropriate preferences based on profile
    let profilePreferences = {};
    
    switch (profile) {
      case 'Healthy Balance':
        profilePreferences = {
          dietaryPreference: 'omnivore',
          fitnessGoal: 'general',
          mealSizePreference: 'medium',
          mealFrequency: 3,
          preferLeftovers: false
        };
        break;
        
      case 'Comfort Food':
        profilePreferences = {
          dietaryPreference: 'omnivore',
          fitnessGoal: 'maintenance',
          mealSizePreference: 'large',
          mealFrequency: 3,
          preferLeftovers: true
        };
        break;
        
      case 'Muscle Building':
        profilePreferences = {
          dietaryPreference: 'omnivore',
          fitnessGoal: 'muscle-gain',
          mealSizePreference: 'large',
          mealFrequency: 5,
          preferLeftovers: false,
          proteinTarget: 180
        };
        break;
    }
    
    // Complete the setup with these preferences
    completeSetup(profilePreferences);
    
    toast({
      title: "Profile Selected",
      description: `You've selected the ${profile} profile. Your meal plan is being created.`,
    });
    
    setTimeout(() => {
      toast({
        title: "Meal Plan Ready",
        description: "Your personalized meal plan has been created successfully!",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Your Profile</DialogTitle>
          <DialogDescription>
            Choose a pre-defined profile to quickly set up your meal plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 border-2 hover:border-primary transition-all"
            onClick={() => handleProfileSelect('Healthy Balance')}
          >
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-base mb-2">Healthy Balance</h3>
            <p className="text-xs text-muted-foreground">
              Balanced nutrients with a focus on whole foods and moderate portions.
            </p>
          </Card>
          
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 border-2 hover:border-primary transition-all"
            onClick={() => handleProfileSelect('Comfort Food')}
          >
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Coffee className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-medium text-base mb-2">Comfort Food</h3>
            <p className="text-xs text-muted-foreground">
              Familiar, satisfying meals with smart, healthier ingredient swaps.
            </p>
          </Card>
          
          <Card 
            className="p-4 flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 border-2 hover:border-primary transition-all"
            onClick={() => handleProfileSelect('Muscle Building')}
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Dumbbell className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-base mb-2">Muscle Building</h3>
            <p className="text-xs text-muted-foreground">
              High protein foods with proper timing and nutrient split for gains.
            </p>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSetupModal;
