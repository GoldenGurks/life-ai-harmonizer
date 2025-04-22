
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
import React, { useState } from "react";

/**
 * Create a QueryClient instance for React Query
 * This enables efficient data fetching and caching
 */
const queryClient = new QueryClient();

/**
 * Main App component that sets up providers and routing
 * Handles onboarding modal display based on user profile state
 */
const App = () => {
  // State to track if the app is ready to render (after localStorage check)
  const [ready, setReady] = useState(false);
  // State to track if onboarding modal should be shown
  const [showOnboard, setShowOnboard] = React.useState(false);

  React.useEffect(() => {
    // Delay 1 render until localStorage can be checked
    // This prevents hydration issues with SSR/static rendering
    setTimeout(() => {
      // Check if user profile exists in localStorage
      const stored = localStorage.getItem("userProfile");
      // Show onboarding if profile doesn't exist or is not complete
      if (!stored) setShowOnboard(true);
      else if (JSON.parse(stored).profileComplete !== true) setShowOnboard(true);
    }, 0);
    setReady(true);
  }, []);

  // Don't render until ready check completes
  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <UserProfileProvider>
        <TooltipProvider>
          {/* Toast notifications for user feedback */}
          <Toaster />
          <Sonner />
          {/* Onboarding modal for first-time users */}
          <OnboardingModal open={showOnboard} />
          <BrowserRouter>
            <Routes>
              {/* Main application routes */}
              <Route path="/" element={<Index />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/meal-planning" element={<MealPlanning />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/shopping" element={<Shopping />} />
              {/* Fallback for non-existent routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProfileProvider>
    </QueryClientProvider>
  );
};

export default App;
