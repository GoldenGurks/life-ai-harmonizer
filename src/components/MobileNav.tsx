
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, GraduationCap, Settings, PieChart, Calendar } from 'lucide-react';

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  
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
            <h1 className="font-bold text-xl mb-6 px-1">
              <span className="gradient-text">Life</span>AI
            </h1>
            
            <nav className="space-y-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
                end
              >
                <Home size={18} />
                <span>Dashboard</span>
              </NavLink>
              
              <div className="mt-6 mb-2 px-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Nutrition
                </h3>
              </div>
              
              <NavLink 
                to="/recipes" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <ChefHat size={18} />
                <span>Recipes</span>
              </NavLink>
              
              <NavLink 
                to="/meal-planning" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <Calendar size={18} />
                <span>Meal Planning</span>
              </NavLink>
              
              <NavLink 
                to="/nutrition" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <PieChart size={18} />
                <span>Nutrition Analytics</span>
              </NavLink>
              
              <div className="mt-6 mb-2 px-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Learning
                </h3>
              </div>
              
              <NavLink 
                to="/flashcards" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <GraduationCap size={18} />
                <span>Flashcards</span>
              </NavLink>
              
              <NavLink 
                to="/study-plan" 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} 
                onClick={closeSheet}
              >
                <Calendar size={18} />
                <span>Study Plan</span>
              </NavLink>
              
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
