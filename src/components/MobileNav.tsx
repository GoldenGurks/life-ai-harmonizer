
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, Settings, PieChart, Calendar } from 'lucide-react';

/**
 * Mobile navigation component that provides a slide-out menu
 * Contains the same navigation items as the desktop Sidebar
 */
const MobileNav: React.FC = () => {
  // State to manage sheet open/close
  const [open, setOpen] = useState(false);
  
  // Function to close the sheet when a navigation link is clicked
  const closeSheet = () => setOpen(false);
  
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="py-4 flex flex-col h-full">
            {/* App logo/name */}
            <h1 className="font-bold text-xl mb-6 px-1">
              <span className="gradient-text">Life</span>AI
            </h1>
            
            <nav className="space-y-1">
              {/* Home/Dashboard navigation */}
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
                end
              >
                <Home size={18} />
                <span>Dashboard</span>
              </NavLink>
              
              {/* Nutrition section header */}
              <div className="mt-6 mb-2 px-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nutrition
                </h3>
              </div>
              
              {/* Recipe browsing navigation */}
              <NavLink 
                to="/recipes" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <ChefHat size={18} />
                <span>Recipes</span>
              </NavLink>
              
              {/* Meal planning navigation */}
              <NavLink 
                to="/meal-planning" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <Calendar size={18} />
                <span>Meal Planning</span>
              </NavLink>
              
              {/* Nutrition analytics navigation */}
              <NavLink 
                to="/nutrition" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <PieChart size={18} />
                <span>Nutrition Analytics</span>
              </NavLink>
              
              {/* Settings link */}
              <div className="mt-6">
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                  onClick={closeSheet}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </NavLink>
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
