
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, Settings, PieChart, Calendar } from 'lucide-react';

/**
 * Mobile navigation component that provides a slide-out menu
 * Contains the same navigation items as the desktop Sidebar
 * Responsive - shown on mobile and tablet, hidden on desktop
 */
const MobileNav: React.FC = () => {
  // State to manage sheet open/close
  const [open, setOpen] = useState(false);
  
  // Function to close the sheet when a navigation link is clicked
  const closeSheet = () => setOpen(false);
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Bottom navigation bar for mobile/tablet */}
      <div className="bg-background border-t flex items-center justify-around py-2 px-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`
          } 
          end
        >
          <Home size={20} />
          <span className="text-xs">Home</span>
        </NavLink>
        
        <NavLink 
          to="/recipes" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <ChefHat size={20} />
          <span className="text-xs">Recipes</span>
        </NavLink>
        
        <NavLink 
          to="/meal-planning" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <Calendar size={20} />
          <span className="text-xs">Meals</span>
        </NavLink>
        
        <NavLink 
          to="/nutrition" 
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
              isActive 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`
          }
        >
          <PieChart size={20} />
          <span className="text-xs">Stats</span>
        </NavLink>
        
        {/* More menu for additional options */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground">
              <Menu size={20} />
              <span className="text-xs">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <div className="py-4 space-y-2">
              <h2 className="text-lg font-semibold mb-4">More Options</h2>
              
              <NavLink 
                to="/settings" 
                className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors" 
                onClick={closeSheet}
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
