
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, GraduationCap, Settings, PieChart, Calendar } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:block w-64 border-r h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex flex-col h-full">
        <nav className="space-y-1">
          <NavLink to="/" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          } end>
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <div className="mt-6 mb-2 px-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nutrition
            </h3>
          </div>
          
          <NavLink to="/recipes" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <ChefHat size={18} />
            <span>Recipes</span>
          </NavLink>
          
          <NavLink to="/meal-planning" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Calendar size={18} />
            <span>Meal Planning</span>
          </NavLink>
          
          <NavLink to="/nutrition" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <PieChart size={18} />
            <span>Nutrition Analytics</span>
          </NavLink>
          
          <div className="mt-6 mb-2 px-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning
            </h3>
          </div>
          
          <NavLink to="/flashcards" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <GraduationCap size={18} />
            <span>Flashcards</span>
          </NavLink>
          
          <NavLink to="/study-plan" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Calendar size={18} />
            <span>Study Plan</span>
          </NavLink>
        </nav>
        
        <div className="mt-auto">
          <NavLink to="/settings" className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''}`
          }>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
