
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, MessageCircle, Sparkles } from 'lucide-react';

interface DetailedPlanningModalProps {
  open: boolean;
  onClose: () => void;
}

const DetailedPlanningModal: React.FC<DetailedPlanningModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  
  // Form state
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = () => {
    toast({
      title: "Interview Completed",
      description: "Our AI is analyzing your preferences to create a personalized meal plan.",
    });
    
    setTimeout(() => {
      toast({
        title: "Meal Plan Ready",
        description: "Your customized meal plan has been created successfully!",
      });
      onClose();
    }, 2000);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Dietary Preferences</h2>
            <RadioGroup value={dietaryPreference} onValueChange={setDietaryPreference} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="omnivore" id="omnivore" />
                <Label htmlFor="omnivore">Omnivore (Meat & Plants)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vegetarian" id="vegetarian" />
                <Label htmlFor="vegetarian">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vegan" id="vegan" />
                <Label htmlFor="vegan">Vegan</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pescatarian" id="pescatarian" />
                <Label htmlFor="pescatarian">Pescatarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="keto" id="keto" />
                <Label htmlFor="keto">Keto</Label>
              </div>
            </RadioGroup>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Fitness Goals</h2>
            <RadioGroup value={fitnessGoal} onValueChange={setFitnessGoal} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight-loss" id="weight-loss" />
                <Label htmlFor="weight-loss">Weight Loss</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                <Label htmlFor="muscle-gain">Muscle Gain</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance">Maintenance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="performance" id="performance" />
                <Label htmlFor="performance">Athletic Performance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General Health</Label>
              </div>
            </RadioGroup>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Food Allergies or Intolerances</h2>
            <p className="text-sm text-muted-foreground mb-2">Select all that apply:</p>
            <div className="space-y-2">
              {['Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish'].map((allergy) => (
                <div key={allergy} className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={allergy.toLowerCase()} 
                    className="w-4 h-4 mr-2 rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <Label htmlFor={allergy.toLowerCase()}>{allergy}</Label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Cooking Experience & Time</h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="experience">Cooking Experience</Label>
                <select 
                  id="experience"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="time">Average Time Available for Cooking (minutes/day)</Label>
                <Input 
                  id="time" 
                  type="number" 
                  placeholder="30" 
                  className="mt-1" 
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Detailed Meal Planning</DialogTitle>
            <DialogDescription>
              Let's create a personalized plan just for you. Step {step} of {totalSteps}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {renderStep()}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={() => setIsAiDrawerOpen(true)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Ask AI
            </Button>
            
            <Button onClick={handleNext} className="gap-2">
              {step < totalSteps ? 'Next' : 'Complete'} 
              {step < totalSteps && <ChevronRight className="h-4 w-4" />}
              {step === totalSteps && <Sparkles className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Drawer open={isAiDrawerOpen} onOpenChange={setIsAiDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Assistant
              </DrawerTitle>
              <DrawerDescription>
                Ask me any questions about your meal planning process.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2 font-medium">AI Assistant</p>
                <p className="text-sm">
                  Hi there! I can help you with your meal planning questions. For example:
                </p>
                <ul className="list-disc text-sm ml-5 mt-2 space-y-1">
                  <li>What kinds of meals work best for my fitness goals?</li>
                  <li>How can I accommodate my food allergies?</li>
                  <li>What substitutions would you suggest for ingredients I dislike?</li>
                </ul>
              </div>
              
              <div className="relative">
                <Input
                  placeholder="Type your question here..."
                  className="pr-20"
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1 h-7"
                >
                  Send
                </Button>
              </div>
            </div>
            <div className="p-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setIsAiDrawerOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DetailedPlanningModal;
