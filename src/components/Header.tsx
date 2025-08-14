
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Search, Bell, Menu, Utensils, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { Recipe } from '@/types/recipes';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/meal-planning/LanguageSelector';

/**
 * Application header component that appears on all pages
 * Contains navigation, search, and user-related actions
 * Demonstrates personalized recipe recommendations
 */
const Header: React.FC = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Access user profile information
  const { profile } = useUserProfile();
  // Access recipe recommendations
  const { recommendations, markAsViewed, getTopN } = useRecipeRecommendations();
  // Toast notifications
  const { toast } = useToast();
  // State to track if recommendations dropdown is open
  const [showRecommendations, setShowRecommendations] = useState(false);
  // State for mobile search
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  // State to store current recommendations
  const [displayRecommendations, setDisplayRecommendations] = useState<Recipe[]>([]);
  
  /**
   * Handles navigation to user profile/settings
   */
  const handleUserProfileClick = () => {
    navigate('/meal-planning');
  };
  
  /**
   * Shows personalized recipe recommendations
   */
  const handleShowRecommendations = () => {
    // Get top 3 personalized recommendations
    const topRecommendations = getTopN(3);
    setDisplayRecommendations(topRecommendations);
    setShowRecommendations(true);
    
    toast({
      title: "Personalized Recommendations",
      description: "Here are some recipes you might like based on your preferences",
    });
  };
  
  /**
   * Navigates to a recipe and marks it as viewed
   */
  const handleRecipeClick = (recipe: Recipe) => {
    // Mark recipe as viewed for recommendation engine feedback loop
    markAsViewed(recipe.id);
    
    // In a real app, this would navigate to the recipe page
    toast({
      title: `Selected: ${recipe.title}`,
      description: `This would navigate to the recipe details page`,
    });
    
    // Close recommendations
    setShowRecommendations(false);
  };
  
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6 md:px-8">
        {/* App logo - responsive sizing */}
        <div className="flex items-center gap-2">
          <h1 
            onClick={() => navigate('/')} 
            className="font-bold text-lg sm:text-xl cursor-pointer"
          >
            <span className="gradient-text">Life</span>AI
          </h1>
        </div>
        
        {/* Desktop search bar (hidden on mobile and tablet) */}
        <div className="hidden lg:flex items-center flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ask your AI assistant..."
              className="w-full rounded-full pl-10 pr-4 py-2 bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* User actions - responsive sizing and layout */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language selector */}
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          
          {/* Mobile search toggle */}
          <Button 
            size="icon" 
            variant="ghost" 
            className="lg:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
          
          {/* Recipe recommendations */}
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleShowRecommendations}
              aria-label="Show recipe recommendations"
            >
              <Utensils className="h-4 w-4" />
            </Button>
            
            {/* Recommendations dropdown - responsive positioning */}
            {showRecommendations && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white shadow-lg rounded-md overflow-hidden z-50 max-h-96">
                <div className="p-3 border-b">
                  <h3 className="font-medium text-sm sm:text-base">Recommended for You</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recommendations.map(recipe => (
                    <div 
                      key={recipe.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{recipe.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {recipe.calories} cal · {recipe.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <Button 
                    variant="link" 
                    className="w-full text-center text-sm" 
                    onClick={() => navigate('/recipes')}
                  >
                    See all recipes
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button size="icon" variant="ghost">
            <Bell className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleUserProfileClick}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Mobile search bar */}
      {showMobileSearch && (
        <div className="lg:hidden border-t px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ask your AI assistant..."
              className="w-full rounded-full pl-10 pr-4 py-2 bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
