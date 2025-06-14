
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
  const { recommendations } = useRecipeRecommendations();
  
  // Log recommendation engine status on mount
  useEffect(() => {
    console.log(`Recipe recommendation engine initialized with ${recommendations.length} recipes`);
  }, [recommendations.length]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global header/navigation */}
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar (hidden on mobile and tablet) */}
        <Sidebar />
        {/* Main content area with proper responsive padding and scrolling */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:px-8 lg:px-12">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile navigation bar - only shown on mobile and tablet devices */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;
