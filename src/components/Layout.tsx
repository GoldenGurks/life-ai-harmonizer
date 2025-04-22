
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

/**
 * Layout component that wraps all pages with common UI elements
 * Provides consistent structure with header, sidebar, and main content area
 * 
 * @param {React.ReactNode} children - The page content to be rendered in the main area
 */
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global header/navigation */}
      <Header />
      <div className="flex flex-1">
        {/* Desktop sidebar (hidden on mobile) */}
        <Sidebar />
        {/* Main content area */}
        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
