
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define available languages
export type Language = 'en' | 'de' | 'es';

// Define translation context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, any>> = {
  en: {
    common: {
      cancel: 'Cancel',
      save: 'Save',
      continue: 'Continue',
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
    },
    weeklySetup: {
      title: 'Weekly Meal Setup',
      description: 'Configure your weekly meal plan preferences',
      dishesCount: 'Number of dishes to cook this week: {{count}}',
      includeBreakfast: 'Include breakfast suggestions',
      includeBreakfastInfo: 'Your plan will include breakfast, lunch, and dinner suggestions.',
      excludeBreakfastInfo: 'Your plan will focus on lunch and dinner options. We\'ll generate additional suggestions for you to choose from.',
      createButton: 'Create Weekly Plan',
    },
    welcomeModal: {
      title: 'Welcome to Meal Planning',
      description: 'Let\'s get started by setting up your personalized meal plan experience.',
      chooseSetupMethod: 'Choose your setup method:',
      quickSetup: 'Quick Setup',
      quickSetupDescription: 'Choose from pre-defined profiles like Healthy, Comfort Food, or Muscle Building. Perfect for getting started quickly.',
      detailedPlanning: 'Detailed Planning',
      detailedPlanningDescription: 'Complete a comprehensive interview with our AI assistant to create a highly personalized meal plan based on your specific preferences and goals.',
      selectMethodError: 'Please select a setup method to continue',
    },
    mealPlanning: {
      title: 'Meal Planning',
      subtitle: 'Create and manage your personalized meal plans with AI assistance.',
      weeklyPlan: 'Weekly Plan',
      mealDiscovery: 'Meal Discovery',
      savedPlans: 'Saved Plans',
      preferences: 'Preferences',
      generateAIPlan: 'Generate AI Plan',
      generatePlan: 'Generate Plan',
      editPlanSettings: 'Edit Plan Settings',
      clearCurrentPlan: 'Clear Current Plan',
      viewShoppingList: 'View Shopping List',
      languageSelector: 'Language',
      quickSetup: 'Quick Setup',
      detailedSetup: 'Detailed Setup',
      dishCount: 'Dishes: {{count}}',
      customCount: 'Custom amount',
      selectionComplete: 'Great! Your plan is ready.',
      openShoppingList: 'Open Shopping List',
      quickPantryCheck: 'Quick Pantry Check',
      scanPantry: 'Scan Pantry',
      presetsWeights: 'Recommendation Settings',
      simple: 'Simple',
      advanced: 'Advanced',
      resetDefaults: 'Reset to Defaults',
      nutritionalFit: 'Nutritional Fit',
      pantryMatch: 'Pantry Match',
      costScore: 'Cost Score',
      nutritionalFitTooltip: 'Prioritize macro targets and calories',
      pantryMatchTooltip: 'Prefer recipes that use ingredients you already have',
      costScoreTooltip: 'Favor budget-friendly recipes',
      breakfastType: 'breakfast',
      tinderDish: 'Recipe Training',
      aiPlanGenerated: 'AI Plan Generated',
      personalizedPlanCreated: 'Your personalized meal plan has been created',
      completeSetupFirst: 'Please complete setup first',
    },
    recipes: {
      title: 'Recipes',
      searchPlaceholder: 'Search recipes...',
      filterByCategory: 'Filter by category',
      allCategories: 'All Categories',
      difficulty: 'Difficulty',
      cookingTime: 'Cooking Time',
      servings: 'Servings',
      ingredients: 'Ingredients',
      instructions: 'Instructions',
      nutrition: 'Nutrition',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
    },
    sidebar: {
      dashboard: 'Dashboard',
      mealPlanning: 'Meal Planning',
      recipes: 'Recipes',
      nutrition: 'Nutrition',
      shopping: 'Shopping',
      pantry: 'Pantry',
    },
    shopping: {
      title: 'Pantry & Shopping',
      pantry: 'Pantry',
      shopping: 'Shopping',
      scanFridge: 'Scan Fridge',
      scanReceipt: 'Scan Receipt',
      addManually: 'Add Manually',
      itemName: 'Item name',
      quantity: 'Quantity',
      unit: 'Unit',
      removeItem: 'Remove item',
      itemRemoved: 'Item removed',
    },
    language: {
      en: 'English',
      de: 'German',
      es: 'Spanish',
    }
  },
  de: {
    common: {
      cancel: 'Abbrechen',
      save: 'Speichern',
      continue: 'Weiter',
      create: 'Erstellen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
    },
    weeklySetup: {
      title: 'Wöchentliche Mahlzeitenplanung',
      description: 'Konfigurieren Sie Ihre wöchentlichen Mahlzeitenpläne',
      dishesCount: 'Anzahl der Gerichte für diese Woche: {{count}}',
      includeBreakfast: 'Frühstücksvorschläge einbeziehen',
      includeBreakfastInfo: 'Ihr Plan wird Vorschläge für Frühstück, Mittagessen und Abendessen enthalten.',
      excludeBreakfastInfo: 'Ihr Plan konzentriert sich auf Mittag- und Abendessen. Wir generieren zusätzliche Vorschläge zur Auswahl.',
      createButton: 'Wochenplan erstellen',
    },
    welcomeModal: {
      title: 'Willkommen bei der Mahlzeitenplanung',
      description: 'Lassen Sie uns mit der Einrichtung Ihrer personalisierten Mahlzeiten beginnen.',
      chooseSetupMethod: 'Wählen Sie Ihre Einrichtungsmethode:',
      quickSetup: 'Schnelle Einrichtung',
      quickSetupDescription: 'Wählen Sie aus vordefinierten Profilen wie Gesund, Komfortnahrung oder Muskelaufbau. Perfekt für einen schnellen Start.',
      detailedPlanning: 'Detaillierte Planung',
      detailedPlanningDescription: 'Führen Sie ein umfassendes Interview mit unserem KI-Assistenten durch, um einen hochpersonalisierten Mahlzeitenplan zu erstellen.',
      selectMethodError: 'Bitte wählen Sie eine Einrichtungsmethode',
    },
    mealPlanning: {
      title: 'Mahlzeitenplanung',
      subtitle: 'Erstellen und verwalten Sie Ihre personalisierten Mahlzeitenpläne mit KI-Unterstützung.',
      weeklyPlan: 'Wochenplan',
      mealDiscovery: 'Mahlzeitenentdeckung',
      savedPlans: 'Gespeicherte Pläne',
      preferences: 'Präferenzen',
      generateAIPlan: 'KI-Plan generieren',
      generatePlan: 'Plan generieren',
      editPlanSettings: 'Planeinstellungen bearbeiten',
      clearCurrentPlan: 'Aktuellen Plan löschen',
      viewShoppingList: 'Einkaufsliste anzeigen',
      languageSelector: 'Sprache',
      quickSetup: 'Schnelleinrichtung',
      detailedSetup: 'Detaillierte Einrichtung',
      dishCount: 'Gerichte: {{count}}',
      customCount: 'Benutzerdefinierte Anzahl',
      selectionComplete: 'Großartig! Ihr Plan ist fertig.',
      openShoppingList: 'Einkaufsliste öffnen',
      quickPantryCheck: 'Schnelle Vorratsüberprüfung',
      scanPantry: 'Vorräte scannen',
      presetsWeights: 'Empfehlungseinstellungen',
      simple: 'Einfach',
      advanced: 'Erweitert',
      resetDefaults: 'Auf Standard zurücksetzen',
      nutritionalFit: 'Nährstoff-Anpassung',
      pantryMatch: 'Vorrats-Übereinstimmung',
      costScore: 'Kostenwert',
      nutritionalFitTooltip: 'Makro-Ziele und Kalorien priorisieren',
      pantryMatchTooltip: 'Rezepte bevorzugen, die vorhandene Zutaten verwenden',
      costScoreTooltip: 'Budgetfreundliche Rezepte bevorzugen',
      breakfastType: 'Frühstück',
      tinderDish: 'Rezept-Training',
      aiPlanGenerated: 'KI-Plan erstellt',
      personalizedPlanCreated: 'Ihr personalisierter Mahlzeitenplan wurde erstellt',
      completeSetupFirst: 'Bitte vervollständigen Sie zuerst die Einrichtung',
    },
    recipes: {
      title: 'Rezepte',
      searchPlaceholder: 'Rezepte suchen...',
      filterByCategory: 'Nach Kategorie filtern',
      allCategories: 'Alle Kategorien',
      difficulty: 'Schwierigkeit',
      cookingTime: 'Kochzeit',
      servings: 'Portionen',
      ingredients: 'Zutaten',
      instructions: 'Anleitung',
      nutrition: 'Nährwerte',
      addToFavorites: 'Zu Favoriten hinzufügen',
      removeFromFavorites: 'Aus Favoriten entfernen',
    },
    sidebar: {
      dashboard: 'Dashboard',
      mealPlanning: 'Mahlzeitenplanung',
      recipes: 'Rezepte',
      nutrition: 'Ernährung',
      shopping: 'Einkaufen',
      pantry: 'Vorräte',
    },
    shopping: {
      title: 'Vorräte & Einkaufen',
      pantry: 'Vorräte',
      shopping: 'Einkaufen',
      scanFridge: 'Kühlschrank scannen',
      scanReceipt: 'Kassenbon scannen',
      addManually: 'Manuell hinzufügen',
      itemName: 'Artikelname',
      quantity: 'Menge',
      unit: 'Einheit',
      removeItem: 'Artikel entfernen',
      itemRemoved: 'Artikel entfernt',
    },
    language: {
      en: 'Englisch',
      de: 'Deutsch',
      es: 'Spanisch',
    }
  },
  es: {
    common: {
      cancel: 'Cancelar',
      save: 'Guardar',
      continue: 'Continuar',
      create: 'Crear',
      edit: 'Editar',
      delete: 'Eliminar',
    },
    weeklySetup: {
      title: 'Configuración Semanal de Comidas',
      description: 'Configure sus preferencias de plan de comidas semanal',
      dishesCount: 'Número de platos para cocinar esta semana: {{count}}',
      includeBreakfast: 'Incluir sugerencias de desayuno',
      includeBreakfastInfo: 'Su plan incluirá sugerencias para desayuno, almuerzo y cena.',
      excludeBreakfastInfo: 'Su plan se centrará en opciones de almuerzo y cena. Generaremos sugerencias adicionales para que elija.',
      createButton: 'Crear Plan Semanal',
    },
    welcomeModal: {
      title: 'Bienvenido a la Planificación de Comidas',
      description: 'Comencemos configurando su experiencia personalizada de plan de comidas.',
      chooseSetupMethod: 'Elija su método de configuración:',
      quickSetup: 'Configuración Rápida',
      quickSetupDescription: 'Elija entre perfiles predefinidos como Saludable, Comida Reconfortante o Desarrollo Muscular. Perfecto para comenzar rápidamente.',
      detailedPlanning: 'Planificación Detallada',
      detailedPlanningDescription: 'Complete una entrevista completa con nuestro asistente de IA para crear un plan de comidas altamente personalizado.',
      selectMethodError: 'Por favor, seleccione un método de configuración para continuar',
    },
    mealPlanning: {
      title: 'Planificación de Comidas',
      subtitle: 'Cree y gestione sus planes de comidas personalizados con asistencia de IA.',
      weeklyPlan: 'Plan Semanal',
      mealDiscovery: 'Descubrimiento de Comidas',
      savedPlans: 'Planes Guardados',
      preferences: 'Preferencias',
      generateAIPlan: 'Generar Plan de IA',
      editPlanSettings: 'Editar Configuración del Plan',
      clearCurrentPlan: 'Borrar Plan Actual',
      viewShoppingList: 'Ver Lista de Compras',
      languageSelector: 'Idioma',
      quickSetup: 'Configuración Rápida',
      detailedSetup: 'Configuración Detallada',
      dishCount: 'Platos: {{count}}',
      customCount: 'Cantidad personalizada',
      selectionComplete: '¡Genial! Su plan está listo.',
      openShoppingList: 'Abrir Lista de Compras',
      quickPantryCheck: 'Verificación Rápida de Despensa',
      scanPantry: 'Escanear Despensa',
      presetsWeights: 'Configuraciones de Recomendación',
      simple: 'Simple',
      advanced: 'Avanzado',
      resetDefaults: 'Restablecer Predeterminados',
      nutritionalFit: 'Ajuste Nutricional',
      pantryMatch: 'Coincidencia de Despensa',
      costScore: 'Puntuación de Costo',
      nutritionalFitTooltip: 'Priorizar objetivos macro y calorías',
      pantryMatchTooltip: 'Preferir recetas que usen ingredientes que ya tiene',
      costScoreTooltip: 'Favorecer recetas económicas',
      breakfastType: 'desayuno',
    },
    shopping: {
      title: 'Despensa y Compras',
      pantry: 'Despensa',
      shopping: 'Compras',
      scanFridge: 'Escanear Nevera',
      scanReceipt: 'Escanear Recibo',
      addManually: 'Agregar Manualmente',
      itemName: 'Nombre del artículo',
      quantity: 'Cantidad',
      unit: 'Unidad',
      removeItem: 'Remover artículo',
      itemRemoved: 'Artículo removido',
    },
    language: {
      en: 'Inglés',
      de: 'Alemán',
      es: 'Español',
    }
  }
};

// Function to replace parameters in translation strings
const replaceParams = (text: string, params?: Record<string, any>) => {
  if (!params) return text;
  let result = text;
  Object.keys(params).forEach(key => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), params[key].toString());
  });
  return result;
};

// Language provider component
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Get language from localStorage or use default
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    return storedLanguage || 'en';
  });

  // Save language preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string, params?: Record<string, any>): string => {
    // Split the key by dots to navigate the nested translations object
    const parts = key.split('.');
    let value: any = translations[language];
    
    // Navigate through the parts to find the translation
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        // If translation not found, try English as fallback
        if (language !== 'en') {
          let fallback = translations['en'];
          for (const fallbackPart of parts) {
            if (fallback && typeof fallback === 'object' && fallbackPart in fallback) {
              fallback = fallback[fallbackPart];
            } else {
              return key; // Return key if fallback not found
            }
          }
          value = fallback;
        } else {
          return key; // Return key if not found in any language
        }
      }
    }
    
    // Replace parameters and return the translation
    return typeof value === 'string' ? replaceParams(value, params) : key;
  };

  // Change language handler
  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    toast.success(`${translations[newLanguage].language[newLanguage]} ${translations[newLanguage].common.save.toLowerCase()}`);
  };

  // Create the context value
  const contextValue: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
