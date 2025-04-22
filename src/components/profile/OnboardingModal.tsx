
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";

// Dietary options that users can select from
const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Lactose-Free", "Pescatarian", "No restrictions"
];

// Goal options that users can select from
const goalsOptions = [
  "Lose Weight", "Build Muscle", "Eat Healthier", "Meal Variety", "Save Time", "Other"
];

/**
 * Onboarding modal component that appears when a new user first visits the application
 * Collects dietary preferences and goals to personalize the user experience
 * 
 * @param {boolean} open - Controls visibility of the modal
 */
export default function OnboardingModal({ open }: { open: boolean }) {
  // Access user profile context
  const { profile, updateProfile } = useUserProfile();
  
  // State for selected dietary restrictions and goals
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize selections from profile if available
  useEffect(() => {
    if (profile?.dietaryRestrictions) {
      setDietaryRestrictions(profile.dietaryRestrictions);
    }
    if (profile?.goals) {
      setGoals(profile.goals);
    }
  }, [profile]);

  /**
   * Handles form submission and updates the user profile
   */
  const handleSubmit = () => {
    // Validate that at least one selection is made in each category
    if (dietaryRestrictions.length === 0 || goals.length === 0) {
      toast.error("Please select at least one option from each category");
      return;
    }
    
    setLoading(true);
    
    // Update the user profile with selected preferences
    updateProfile({
      dietaryRestrictions,
      goals,
      profileComplete: true,
    });
    
    toast.success("Your preferences have been saved!");
    
    // Add a small delay to show the loading state and success message
    setTimeout(() => setLoading(false), 600);
  };

  /**
   * Toggles a value in an array (adds if not present, removes if present)
   * 
   * @param array - The current array of selected values
   * @param setter - State setter function
   * @param value - Value to toggle
   */
  const toggleValue = (array: string[], setter: (x: string[]) => void, value: string) => {
    setter(array.includes(value) ? array.filter((v) => v !== value) : [...array, value]);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase">Welcome to Meal Planning!</DialogTitle>
          <DialogDescription>
            Let&rsquo;s set up your dietary preferences and goals.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="mb-3">
            <div className="font-semibold text-gray-800">Dietary Restrictions</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {dietaryOptions.map(opt => (
                <Button
                  key={opt}
                  variant={dietaryRestrictions.includes(opt) ? "default" : "outline"}
                  onClick={() => toggleValue(dietaryRestrictions, setDietaryRestrictions, opt)}
                  className="rounded-full px-3 text-sm"
                  style={dietaryRestrictions.includes(opt) ? { backgroundColor: "#7AC143", color: "#fff" } : {}}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className="font-semibold text-gray-800">Your Goals</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {goalsOptions.map(opt => (
                <Button
                  key={opt}
                  variant={goals.includes(opt) ? "default" : "outline"}
                  onClick={() => toggleValue(goals, setGoals, opt)}
                  className="rounded-full px-3 text-sm"
                  style={goals.includes(opt) ? { backgroundColor: "#F5A623", color: "#fff" } : {}}
                >
                  {opt}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full font-bold bg-[#7AC143] hover:bg-[#6FA43D] mt-4 uppercase"
          disabled={loading || (dietaryRestrictions.length === 0 || goals.length === 0)}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
