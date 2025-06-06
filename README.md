
# NutriPlan - Meal Planning Application

A comprehensive React-based meal planning application that helps users organize meals, track nutrition, manage shopping lists, and receive personalized recipe recommendations.

## Features

### 🍽️ Personalized Meal Planning
- Weekly meal planning with drag-and-drop interface
- AI-assisted meal recommendations based on preferences
- Author style-based recipe suggestions
- Customizable recommendation weights
- Multiple planning modes (quick setup, detailed planning)

### 📸 Photo-to-Recipe Import
- **SmartPlate Integration**: Upload food photos to automatically extract recipes
- **AI-Powered Analysis**: Uses GPT-4 Vision to identify ingredients, measurements, and cooking instructions
- **Seamless Library Integration**: Imported recipes are immediately available in your recipe collection
- **Smart Data Mapping**: Converts extracted data into our structured Recipe format with proper ingredient typing

#### How Photo-to-Recipe Works:
1. **Upload Photo**: Click "Upload Photo" in the Import Recipe flow
2. **SmartPlate Analysis**: Image is sent to our SmartPlate GPT endpoint for processing
3. **Recipe Extraction**: AI analyzes the photo and returns structured JSON with:
   - Recipe title and estimated servings
   - Ingredient list with precise measurements
   - Step-by-step cooking instructions
   - Difficulty level and cooking time
4. **Library Integration**: Extracted recipe is converted to our Recipe type and added to your collection
5. **Immediate Access**: Recipe appears in your library and can be used in meal planning

**API Integration**: The feature uses OpenAI's GPT-4 Vision model through our SmartPlate prompt engineering for optimal recipe extraction accuracy.

### 📊 Nutrition Tracking
- Comprehensive macronutrient tracking
- Visual nutrition charts and progress indicators
- Personalized nutritional goals
- Daily and weekly nutrition summaries

### 🛒 Shopping & Pantry Management
- Automated shopping list generation
- Pantry inventory tracking with expiration dates
- Smart ingredient suggestions based on planned meals
- Category-based organization

### 👤 User Profile Management
- Dietary preferences and restrictions
- Fitness goals tracking
- Food preferences (likes/dislikes)
- Cooking experience and time availability settings

## Nutrition Calculation

- Each `RecipeIngredient` uses its `id` to look up a `FoodItem` in `veg_library_with_weights.ndjson`.
- `averageWeightPerPiece` converts "piece" units to grams for accurate nutrition calculation.
- We compute `weightInGrams` for every ingredient, then multiply by per-gram nutrients & cost from the FoodItem.
- Sum all ingredients, then divide by `recipe.servings` (default 4) for per-serving macros + cost.
- All changes are commented directly in `ingredientUtils.ts` and `nutritionService.ts`.
- We assume 1 ml = 1 g if unit === 'ml' for liquid ingredients.

### Manual Testing

To verify nutrition calculations work correctly:

1. Open browser console
2. Check any recipe's `recipe.nutrition.calories` value
3. Verify it matches: `sum(ingredientWeightInGrams × FoodItem.caloriesPer100g / 100) ÷ 4`
4. Similarly verify `nutrition.cost` using `FoodItem.costPer100g`

Example test recipe: "Mediterranean Quinoa Bowl" should show calculated nutrition values in the meal planning interface.

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Context API with custom hooks
- **UI Components**: Shadcn UI with Tailwind CSS
- **Data Visualization**: Recharts for nutrition charts
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Motion library for smooth transitions
- **Notifications**: Sonner toast notifications
- **AI Integration**: OpenAI GPT-4 Vision for photo-to-recipe extraction

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components from shadcn
│   ├── profile/         # User profile related components
│   ├── meal-planning/   # Meal planning specific components
│   ├── nutrition/       # Nutrition tracking components
│   ├── recipes/         # Recipe-related components including PhotoImportModal
│   └── shopping/        # Shopping list and pantry components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Route-based page components
├── services/            # Business logic and API services including photoImportService
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── data/                # Static data and mock databases
└── lib/                 # Third-party library wrappers
```

## Core Services

### Photo Import Service

The `photoImportService.ts` handles communication with our SmartPlate GPT:

- **Image Analysis**: Converts uploaded images to base64 and sends to GPT-4 Vision
- **Recipe Extraction**: Uses specialized prompts to extract structured recipe data
- **Error Handling**: Provides user-friendly error messages for failed analyses
- **Data Transformation**: Maps SmartPlate response to our Recipe type system

Key functions:
- `analyzeRecipePhoto(file: File)`: Main analysis function
- `setApiKey(key: string)`: Stores OpenAI API key locally
- `getApiKey()`: Retrieves stored API key

### Recommendation Engine

The application features a sophisticated recommendation engine that considers:

- User dietary preferences
- Fitness goals and nutritional targets
- Food likes and dislikes
- Pantry contents
- Previously viewed recipes
- Cooking skill and available time

The recommendation system uses customizable weights for different factors:

- Nutritional value
- Ingredient similarity
- Pantry usage optimization
- Recipe variety

### LLM Integration

For cold-start scenarios or author-style specifications, the system can leverage LLM-based suggestions to:

- Generate recipes in specific culinary styles
- Provide cooking tips based on user preferences
- Suggest meal combinations that match nutritional goals
- Extract recipes from food photos using SmartPlate GPT

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Access the application:
Open [http://localhost:5173](http://localhost:5173) in your browser.

4. (Optional) Set up photo import:
   - Get an OpenAI API key from https://platform.openai.com/
   - In the app, go to Recipes → Upload Photo and enter your API key
   - The key is stored locally for future use

## Development Guidelines

### Code Organization
- Focused, small components (~50-100 lines)
- Clear separation of concerns
- Custom hooks for reusable logic
- Context providers for global state

### Styling
- Tailwind CSS for styling
- Consistent design system via shadcn/ui
- Responsive layouts for all screen sizes

### Testing
- Component testing with React Testing Library
- Service unit tests
- End-to-end testing with Playwright

## Key Features Implementation

### Photo-to-Recipe Workflow:
1. User clicks "Upload Photo" in recipe import flow
2. PhotoImportModal opens with file selection
3. User selects food image and enters API key (if needed)
4. Image is sent to SmartPlate GPT via photoImportService
5. AI extracts recipe data and returns structured JSON
6. Data is transformed into Recipe format with proper typing
7. Recipe is added to library and user is notified
8. New recipe appears immediately in recipe collection

### Meal Planning Workflow:
1. User completes preference profile
2. System generates personalized recommendations
3. User selects recipes for the week
4. Recipes are assigned to specific days
5. Shopping list is automatically generated

### Recommendation System:
- Initial recommendations based on user profile
- Feedback loop through likes/dislikes
- Adjustable recommendation weights
- Author-style based recommendations

### Nutrition Tracking:
- Automatic calculation of nutritional values from ingredient database
- Visual representation of macro/micronutrients
- Goal tracking with daily/weekly summaries
- Nutritional balance insights

## Removed Legacy Fields

- Removed legacy `recipe.calories`, `recipe.protein`, etc. Now use `recipe.nutrition.*` for all nutrition data.

## License

This project is MIT licensed.
