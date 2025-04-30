
# NutriPlan - Meal Planning Application

A comprehensive React-based meal planning application that helps users organize meals, track nutrition, manage shopping lists, and receive personalized recipe recommendations.

## Features

### 🍽️ Personalized Meal Planning
- Weekly meal planning with drag-and-drop interface
- AI-assisted meal recommendations based on preferences
- Author style-based recipe suggestions
- Customizable recommendation weights
- Multiple planning modes (quick setup, detailed planning)

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

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: React Context API with custom hooks
- **UI Components**: Shadcn UI with Tailwind CSS
- **Data Visualization**: Recharts for nutrition charts
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Motion library for smooth transitions
- **Notifications**: Sonner toast notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base UI components from shadcn
│   ├── profile/         # User profile related components
│   ├── meal-planning/   # Meal planning specific components
│   ├── nutrition/       # Nutrition tracking components
│   └── shopping/        # Shopping list and pantry components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Route-based page components
├── services/            # Business logic and API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── data/                # Static data and mock databases
└── lib/                 # Third-party library wrappers
```

## Core Services

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
- Automatic calculation of nutritional values
- Visual representation of macro/micronutrients
- Goal tracking with daily/weekly summaries
- Nutritional balance insights

## License

This project is MIT licensed.
