
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Search, Bell, Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';

/**
 * Application header component that appears on all pages
 * Contains navigation, search, and user-related actions
 */
const Header: React.FC = () => {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Access user profile information
  const { profile } = useUserProfile();
  
  /**
   * Handles navigation to user profile/settings
   */
  const handleUserProfileClick = () => {
    navigate('/meal-planning');
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
        
        {/* User actions (notifications, profile) */}
        <div className="flex items-center gap-2">
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
