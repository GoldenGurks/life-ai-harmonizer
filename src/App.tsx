
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import MealPlanning from "./pages/MealPlanning";
import Nutrition from "./pages/Nutrition";
import Shopping from "./pages/Shopping";
import NotFound from "./pages/NotFound";

import { UserProfileProvider } from "@/context/UserProfileContext";
import OnboardingModal from "@/components/profile/OnboardingModal";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  const [ready, setReady] = React.useState(false);
  const [showOnboard, setShowOnboard] = React.useState(false);

  React.useEffect(() => {
    // Delay 1 render until localStorage can be checked
    setTimeout(() => {
      const stored = localStorage.getItem("userProfile");
      if (!stored) setShowOnboard(true);
      else if (JSON.parse(stored).profileComplete !== true) setShowOnboard(true);
    }, 0);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <UserProfileProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OnboardingModal open={showOnboard} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/meal-planning" element={<MealPlanning />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProfileProvider>
  );
};

export default App;
