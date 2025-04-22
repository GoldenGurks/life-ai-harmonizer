
import React, { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useRecipeRecommendations } from '@/hooks/useRecipeRecommendations';

/**
 * Layout component that wraps all pages with common UI elements
 * Provides consistent structure with header, sidebar, and main content area
 * Also initializes the recipe recommendation engine
 * 
 * @param {React.ReactNode} children - The page content to be rendered in the main area
 */
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Initialize recipe recommendations to ensure it's loaded globally
  const { recipes } = useRecipeRecommendations();
  
  // Log recommendation engine status on mount
  useEffect(() => {
    console.log(`Recipe recommendation engine initialized with ${recipes.length} recipes`);
  }, [recipes.length]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global header/navigation */}
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar (hidden on mobile) */}
        <Sidebar />
        {/* Main content area with proper scrolling */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile navigation bar - only shown on mobile devices */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;
