# Smart Meal Planner

An AI-powered meal planning application built with React, TypeScript, and Tailwind CSS. Features personalized recipe recommendations, pantry management, and intelligent shopping list generation.

## Features

### Core Functionality
- **Personalized Meal Planning**: AI-driven weekly meal plan generation based on user preferences
- **Recipe Discovery**: Browse and filter thousands of recipes with advanced recommendation engine
- **Nutrition Tracking**: Monitor daily nutrition goals and macronutrient distribution
- **Smart Shopping Lists**: Auto-generated shopping lists that account for pantry inventory

### Recent Updates

## Multilingual & Pantry Updates

### A) Multilingual Support (German, English, Spanish)
- **Language Switching**: Users can switch between DE/EN/ES languages via header selector
- **Persistent Preferences**: Language choice is saved in localStorage
- **Complete Translation Coverage**: All UI strings in meal planning flows are localized
- **Translation Structure**: Uses nested key structure (e.g., `mealPlanning.title`)

#### How to Add Translations
1. Edit `src/hooks/useLanguage.tsx`
2. Add new keys to the `translations` object for all three languages
3. Use the `t()` function in components: `t('section.key', { param: value })`
4. Parameter interpolation supported: `{{paramName}}` in translation strings

### B) Weekly Dish Count - Presets + Custom
- **Preset Buttons**: Quick selection for 3, 5, or 7 dishes
- **Custom Input**: Slider for any count between 1-21 dishes
- **Selection Enforcement**: Recipe grid prevents over-selection with clear messaging
- **Unified State**: Single source of truth via `weeklySettings.dishCount`

### C) Simplified Recommendation Settings
- **Simple/Advanced Toggle**: Default simple mode shows only preset selection
- **Clear Preset Descriptions**: Each preset (Healthy/Weight Loss/Muscle Gain) explains its focus
- **Advanced Mode**: Reveals sliders with tooltips and reset functionality
- **Tooltip Help**: Each slider has explanatory tooltips for user guidance

### D) Breakfast Preservation
- **Meal Type Tagging**: Breakfast selections are marked with `mealType="breakfast"`
- **Plan Placement**: Weekly plan respects meal types and displays breakfast in appropriate slots
- **Selection Context**: Breakfast recipes maintain their identity throughout the planning flow

### E) Dashboard Routing
- **Fixed Navigation**: "Dashboard" menu item now correctly routes to `/dashboard`
- **Consistent Behavior**: All navigation paths properly direct to intended pages

### F) Shopping List Functionality
- **Remove Items**: "X" button removes items from shopping list with immediate feedback
- **Session Persistence**: Removed items stay removed during current planning session
- **Pantry Integration**: Shopping list automatically subtracts items available in pantry

### G) Pantry & Shopping Page
- **Renamed Section**: "Shopping" → "Pantry & Shopping" throughout navigation
- **Two-Tab Interface**: 
  - **Pantry Tab**: AI scanning, manual item addition, inventory management
  - **Shopping Tab**: Auto-generated list minus pantry items with check-off functionality
- **AI Scanning**: Photo upload for fridge/receipt analysis with parsed item preview
- **Manual Entry**: Form-based item addition with categories and units
- **Smart Sync**: Pantry changes automatically update shopping list calculations

#### Pantry Storage
Currently uses local state via `usePantry` hook. Items include:
- Name, quantity, unit, category
- Expiration dates and add timestamps
- Scanning source identification

#### AI Pantry Scanning
- **Backend Integration**: Uses Supabase Edge Function `parse-pantry`
- **Supported Formats**: Receipt photos and fridge images
- **Item Extraction**: AI parses item names, quantities, and units
- **User Confirmation**: Parsed items can be edited before adding to pantry
- **Error Handling**: Graceful fallbacks and user feedback for scan failures

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context + Custom Hooks
- **UI Components**: Shadcn/ui component library
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI Integration**: OpenAI API for recipe analysis and pantry scanning
- **Build Tool**: Vite
- **Deployment**: Lovable platform

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables for Supabase and OpenAI
4. Start development server: `npm run dev`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── meal-planning/  # Meal planning specific components
│   ├── recipes/        # Recipe browsing and display
│   ├── nutrition/      # Nutrition tracking components
│   └── ui/            # Base UI components (shadcn)
├── hooks/             # Custom React hooks
├── services/          # API and business logic
├── types/             # TypeScript type definitions
├── data/              # Static data and mock data
└── pages/             # Route components
```

## Contributing

1. Follow the existing code style and component patterns
2. Add translations for any new user-facing strings
3. Test multilingual functionality across all supported languages
4. Update this README for any architectural changes

## License

MIT License - see LICENSE file for details