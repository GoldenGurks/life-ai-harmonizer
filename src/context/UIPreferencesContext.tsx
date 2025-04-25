
import React, { createContext, useContext, useState } from "react";

export interface UIPreferences {
  onlyLikedRecipes: boolean;
}

const defaultPreferences: UIPreferences = {
  onlyLikedRecipes: false,
};

interface UIPreferencesContextValue {
  ui: UIPreferences;
  setUI: (updates: Partial<UIPreferences>) => void;
}

const UIPreferencesContext = createContext<UIPreferencesContextValue | undefined>(undefined);

export const UIPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ui, setUIState] = useState<UIPreferences>(defaultPreferences);

  const setUI = (updates: Partial<UIPreferences>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  return (
    <UIPreferencesContext.Provider value={{ ui, setUI }}>
      {children}
    </UIPreferencesContext.Provider>
  );
};

export const useUIPreferences = () => {
  const context = useContext(UIPreferencesContext);
  if (!context) {
    throw new Error("useUIPreferences must be used within a UIPreferencesProvider");
  }
  return context;
};
