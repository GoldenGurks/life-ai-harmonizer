
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";

// Minimal, clean onboarding modal
const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Lactose-Free", "Pescatarian", "No restrictions"
];

const goalsOptions = [
  "Lose Weight", "Build Muscle", "Eat Healthier", "Meal Variety", "Save Time", "Other"
];

export default function OnboardingModal({ open }: { open: boolean }) {
  const { updateProfile } = useUserProfile();
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // mark profile as complete
    updateProfile({
      dietaryRestrictions,
      goals,
      profileComplete: true,
    });
    setTimeout(() => setLoading(false), 600);
  };

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

        <Button disabled={loading || dietaryRestrictions.length === 0 || goals.length === 0}
          onClick={handleSubmit} className="w-full font-bold bg-[#7AC143] hover:bg-[#6FA43D] mt-4 uppercase"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
