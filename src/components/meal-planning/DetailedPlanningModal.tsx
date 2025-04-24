import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, MessageCircle, Sparkles, Send } from 'lucide-react';
import FoodPreferenceSlider from './FoodPreferenceSlider';
import { UserPreferences } from '@/types/meal-planning';
import { useMealPreferences } from '@/hooks/useMealPreferences';
import { toast } from 'sonner';
import { PresetWeightsSection } from './PresetWeightsSection';
import { RecommendationWeights } from '@/types/recipes';

interface DetailedPlanningModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Detailed planning modal component that guides users through a comprehensive
 * preference setup process for creating personalized meal plans
 */
const DetailedPlanningModal: React.FC<DetailedPlanningModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const { preferences, completeSetup } = useMealPreferences();
  const [aiMessage, setAiMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<Partial<UserPreferences>>({
    dietaryPreference: preferences.dietaryPreference || 'omnivore',
    fitnessGoal: preferences.fitnessGoal || 'maintenance',
    allergies: preferences.allergies || [],
    intolerances: preferences.intolerances || [],
    cookingExperience: preferences.cookingExperience || 'intermediate',
    cookingTime: preferences.cookingTime || 30,
    likedFoods: preferences.likedFoods || [],
    dislikedFoods: preferences.dislikedFoods || [],
  });
  
  const totalSteps = 5;
  
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
    
    // Save the collected preferences
    completeSetup(formData);
    
    setTimeout(() => {
      toast({
        title: "Meal Plan Ready",
        description: "Your customized meal plan has been created successfully!",
      });
      onClose();
    }, 2000);
  };

  const handleFormChange = (field: keyof UserPreferences, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFoodPreference = (dishId: string, liked: boolean) => {
    if (liked) {
      const updatedLiked = formData.likedFoods?.includes(dishId) ? 
        formData.likedFoods : 
        [...(formData.likedFoods || []), dishId];
        
      setFormData(prev => ({ 
        ...prev, 
        likedFoods: updatedLiked,
        dislikedFoods: prev.dislikedFoods?.filter(id => id !== dishId) || []
      }));
    } else {
      const updatedDisliked = formData.dislikedFoods?.includes(dishId) ?
        formData.dislikedFoods :
        [...(formData.dislikedFoods || []), dishId];
        
      setFormData(prev => ({ 
        ...prev, 
        dislikedFoods: updatedDisliked,
        likedFoods: prev.likedFoods?.filter(id => id !== dishId) || []
      }));
    }
  };

  const handleAllergiesChange = (allergy: string, checked: boolean) => {
    const updatedAllergies = checked
      ? [...(formData.allergies || []), allergy]
      : (formData.allergies || []).filter(item => item !== allergy);
    
    setFormData(prev => ({ ...prev, allergies: updatedAllergies }));
  };
  
  const handleSendAiMessage = () => {
    if (!aiMessage.trim()) return;
    
    // Show AI response (in a real app, this would call an API)
    const mockResponses = [
      "Based on your goals, I recommend focusing on protein-rich meals with balanced carbs.",
      "For your fitness goals, I suggest meal prepping on weekends to save time during the week.",
      "With your dietary restrictions, you might enjoy exploring Mediterranean cuisine options.",
      "Given your cooking experience, I can suggest some intermediate recipes that take about 30 minutes.",
    ];
    
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // Add user message and AI response to the conversation
    const aiConversation = document.getElementById('ai-conversation');
    if (aiConversation) {
      const userMessageEl = document.createElement('div');
      userMessageEl.className = 'bg-muted/30 rounded-lg p-3 mb-3 ml-auto max-w-[80%] text-sm';
      userMessageEl.textContent = aiMessage;
      
      const aiResponseEl = document.createElement('div');
      aiResponseEl.className = 'bg-muted/50 rounded-lg p-3 mb-3 max-w-[80%] text-sm';
      
      // Simulate AI thinking with a typing effect
      let i = 0;
      const typingEffect = setInterval(() => {
        if (i === 0) {
          aiResponseEl.textContent = "Thinking";
        } else if (i < 4) {
          aiResponseEl.textContent += ".";
        } else {
          clearInterval(typingEffect);
          aiResponseEl.textContent = randomResponse;
        }
        i++;
      }, 300);
      
      aiConversation.appendChild(userMessageEl);
      aiConversation.appendChild(aiResponseEl);
      aiConversation.scrollTop = aiConversation.scrollHeight;
    }
    
    // Clear the input
    setAiMessage('');
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Dietary Preferences</h2>
            <RadioGroup 
              value={formData.dietaryPreference} 
              onValueChange={(value) => handleFormChange('dietaryPreference', value)} 
              className="space-y-2"
            >
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
            <RadioGroup 
              value={formData.fitnessGoal} 
              onValueChange={(value) => handleFormChange('fitnessGoal', value)}
              className="space-y-2"
            >
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
                    checked={(formData.allergies || []).includes(allergy)}
                    onChange={(e) => handleAllergiesChange(allergy, e.target.checked)}
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
                  value={formData.cookingExperience}
                  onChange={(e) => handleFormChange('cookingExperience', e.target.value)}
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
                  value={formData.cookingTime || ''}
                  onChange={(e) => handleFormChange('cookingTime', parseInt(e.target.value))}
                  className="mt-1" 
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Recipe Recommendation Preferences</h2>
            <PresetWeightsSection
              onWeightsChange={(weights, preset) => {
                handleFormChange('recommendationWeights', weights);
                handleFormChange('recommendationPreset', preset);
              }}
              initialPreset={formData.recommendationPreset || 'Healthy'}
            />
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
              <div id="ai-conversation" className="bg-background rounded-lg p-4 mb-4 h-[200px] overflow-y-auto space-y-2">
                <div className="bg-muted/50 rounded-lg p-3 max-w-[80%] text-sm">
                  <p className="font-medium mb-1">AI Assistant</p>
                  <p>
                    Hi there! I can help you with your meal planning questions. For example:
                  </p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>What kinds of meals work best for my fitness goals?</li>
                    <li>How can I accommodate my food allergies?</li>
                    <li>What substitutions would you suggest for ingredients I dislike?</li>
                  </ul>
                </div>
              </div>
              
              <div className="relative mb-4">
                <Input
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  placeholder="Type your question here..."
                  className="pr-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAiMessage();
                  }}
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1 h-7 px-3"
                  onClick={handleSendAiMessage}
                  disabled={!aiMessage.trim()}
                >
                  <Send className="h-4 w-4" />
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
