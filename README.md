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

## Extended Nutrition Model

### Overview
The app now includes a comprehensive nutrition calculation system that computes both macronutrients and micronutrients from the `veg_library_with_weights.ndjson` food database.

### Data Model Architecture
**Base Portions System**: All nutrition is calculated for 4 base portions, then scaled client-side when users change serving sizes. This approach enables:
- Consistent baseline calculations regardless of recipe variations
- Efficient client-side scaling without re-querying the database
- Preserved calculation accuracy across different serving sizes

**Recipe Nutrition Structure**:
```typescript
// Core macros (scaled to current servings)
nutrition: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  cost: number;
}

// Extended micronutrients (scaled to current servings)
nutritionDetails: {
  sodium_mg?: number;
  potassium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
  magnesium_mg?: number;
  vitaminC_mg?: number;
  vitaminA_ug?: number;
  vitaminK_ug?: number;
  vitaminE_mg?: number;
  folate_ug?: number;
  netCarbs_g?: number;
  sodiumToPotassiumRatio?: number;
  // Health scores
  satietyScore?: number;
  muscleScore?: number;
  cardioScore?: number;
}

// Base nutrition for 4 portions (scaling anchor)
nutritionBase: nutrition + nutritionDetails
```

### Unit Handling & Conversions
The system handles three unit types with intelligent conversion:

- **Grams (g)**: Used directly as weight measurement
- **Milliliters (ml)**: Treated as grams assuming density = 1 (appropriate for water-like items)
- **Pieces**: Converted using `averageWeightPerPiece` from food library
  - Example: 2 pieces × 150g/piece = 300g total weight
  - Defaults to 100g if `averageWeightPerPiece` is missing

**Code Comments**: Key conversion points are documented with assumptions made (e.g., ml≈g density assumption).

### Scaling System
The nutrition scaling system uses a base portions approach:

```typescript
// Calculate for base portions (4)
const nutritionBase = calculateNutritionForBase(recipe.ingredients);

// Scale to target servings
const scaledNutrition = scaleNutrition(nutritionBase, targetServings, 4);
```

**Scaling Function**:
```typescript
function scaleNutrition(baseNutrition, targetServings, basePortions = 4) {
  const scaleFactor = targetServings / basePortions;
  return scaleAllNumericValues(baseNutrition, scaleFactor);
}
```

### Derived Values & Health Scores
The system calculates several derived nutrition metrics:

**Net Carbs**: `carbs - fiber` (floored at 0)
**Sodium:Potassium Ratio**: `sodium_mg / potassium_mg` (guards against division by zero)

**Health Scores (v1 implementations)**:
- **Satiety Score**: `(protein + fiber) / calories` - indicates filling potential
- **Muscle Score**: `protein / calories` with bonus for ≥30g protein per portion
- **Cardio Score**: `(potassium/1000) - (sodium/1000)` - cardiovascular health indicator

### UI Components

**Compact Macro Row (Always Visible)**:
Shows: Calories • Protein • Carbs • Fat • Fiber • Sugar per current serving

**Collapsible Nutrition Details**:
- **Minerals**: Sodium, potassium, calcium, iron, magnesium
- **Vitamins**: A, C, E, K, folate (B9)
- **Derived Values**: Net carbs, sodium:potassium ratio
- **Health Scores**: Satiety, muscle, cardio scores

**Nutrient Badges**:
Automatic badges for recipes meeting nutritional thresholds:
- "High Protein" (≥30g per serving)
- "High Fiber" (≥8g per serving)  
- "High Vitamin C" (≥60mg per serving)
- "High Iron" (≥10mg per serving)

**Meta Information**:
- Data source: "Calculated from food library (per serving)"
- Base portions reference: "base portions = 4"
- Last calculation timestamp

### Implementation Files

**Core System**:
- `types/recipes.ts`: Extended Recipe and NutritionDetails interfaces
- `services/nutritionService.ts`: Main calculation engine with scaling functions
- `utils/ingredientUtils.ts`: Unit conversion and detailed nutrient extraction

**UI Components**:
- `components/nutrition/NutritionDetailsCollapsible.tsx`: Primary nutrition display component
- Updated `RecipeCard.tsx` and `RecipeDetailDrawer.tsx` to use new nutrition structure

**Calculation Flow**:
1. Load ingredient data from `veg_library_with_weights.ndjson`
2. Convert units to grams using `averageWeightPerPiece` when needed
3. Calculate per-gram nutrition values (library data is per 100g)
4. Sum totals across all ingredients for 4 base portions
5. Derive net carbs, ratios, and health scores
6. Store as `nutritionBase` and scale to current servings for display

### Resilience & Error Handling
- Missing nutrient data: Fields left undefined rather than defaulting to 0
- Invalid ingredients: Logged warnings with graceful fallbacks
- Unit conversion failures: Default assumptions documented with console warnings
- Missing food items: Continues calculation with available ingredients

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