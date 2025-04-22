
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Search, Bell, Menu, Utensils } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';
import { Recipe } from '@/types/recipes';
import { useToast } from '@/hooks/use-toast';

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
  const { getTopN, markRecipeViewed } = useRecipeRecommendations();
  // Toast notifications
  const { toast } = useToast();
  // State to track if recommendations dropdown is open
  const [showRecommendations, setShowRecommendations] = useState(false);
  // State to store current recommendations
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  
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
    setRecommendations(topRecommendations);
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
    markRecipeViewed(recipe.id);
    
    // In a real app, this would navigate to the recipe page
    toast({
      title: `Selected: ${recipe.title}`,
      description: `This would navigate to the recipe details page`,
    });
    
    // Close recommendations
    setShowRecommendations(false);
  };
  
  return (
    <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* App logo and mobile menu */}
        <div className="flex items-center gap-2">
          <Menu className="h-5 w-5 md:hidden" />
          <h1 
            onClick={() => navigate('/')} 
            className="font-bold text-xl cursor-pointer"
          >
            <span className="gradient-text">Life</span>AI
          </h1>
        </div>
        
        {/* Search bar (hidden on mobile) */}
        <div className="hidden md:flex items-center flex-1 mx-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ask your AI assistant..."
              className="w-full rounded-full pl-10 pr-4 py-2 bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* User actions (notifications, recommendations, profile) */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleShowRecommendations}
              aria-label="Show recipe recommendations"
            >
              <Utensils className="h-5 w-5" />
            </Button>
            
            {/* Recommendations dropdown */}
            {showRecommendations && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50">
                <div className="p-2 border-b">
                  <h3 className="font-medium">Recommended for You</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {recommendations.map(recipe => (
                    <div 
                      key={recipe.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => handleRecipeClick(recipe)}
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                        <img 
                          src={recipe.image} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{recipe.title}</div>
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
                    className="w-full text-center" 
                    onClick={() => navigate('/recipes')}
                  >
                    See all recipes
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleUserProfileClick}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
