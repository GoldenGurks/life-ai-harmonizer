
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, Settings, PieChart, Calendar, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

/**
 * Sidebar component that provides navigation throughout the application
 * Responsive - hidden on mobile/tablet, visible on desktop
 */
const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <aside className="hidden lg:block w-56 xl:w-64 border-r h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex flex-col h-full">
        <nav className="space-y-1">
          {/* Home/Dashboard navigation link */}
          <NavLink to="/dashboard" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Home size={18} />
            <span className="text-sm">Dashboard</span>
          </NavLink>
          
          {/* Nutrition section header */}
          <div className="mt-6 mb-2 px-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nutrition
            </h3>
          </div>
          
          {/* Recipe browsing navigation */}
          <NavLink to="/recipes" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <ChefHat size={18} />
            <span className="text-sm">Recipes</span>
          </NavLink>
          
          {/* Meal planning navigation */}
          <NavLink to="/meal-planning" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Calendar size={18} />
            <span className="text-sm">Meal Planning</span>
          </NavLink>
          
          {/* Nutrition analytics navigation */}
          <NavLink to="/nutrition" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <PieChart size={18} />
            <span className="text-sm">Nutrition Analytics</span>
          </NavLink>
          
          {/* Shopping & Pantry navigation */}
          <NavLink to="/shopping" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <ShoppingCart size={18} />
            <span className="text-sm">{t('shopping.title')}</span>
          </NavLink>
        </nav>
        
        {/* Settings link at the bottom of sidebar */}
        <div className="mt-auto">
          <NavLink to="/settings" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
