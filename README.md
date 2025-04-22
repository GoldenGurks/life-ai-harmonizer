
# Meal Planning Application

A React-based meal planning application that helps users organize their meals, track nutrition, and manage shopping lists.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components from shadcn
│   ├── profile/       # User profile related components
│   └── meal-planning/ # Meal planning specific components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Route-based page components
├── services/          # Business logic and API services
└── types/             # TypeScript type definitions
```

## Core Features

### User Profile Management (`/context/UserProfileContext.tsx`)
- Handles user preferences storage and retrieval
- Manages dietary restrictions, goals, and meal preferences
- Provides functions for updating and resetting profiles
- Persists data in localStorage (backend-ready)

### Meal Planning (`/pages/MealPlanning.tsx`)
- Weekly meal planning interface
- AI-assisted meal suggestions
- Meal preference tracking (liked/disliked)
- Drag-and-drop meal organization

### Nutrition Tracking (`/pages/Nutrition.tsx`)
- Macronutrient tracking
- Nutritional goals management
- Visual progress indicators

### Shopping Management (`/pages/Shopping.tsx`)
- Shopping list creation
- Pantry inventory tracking
- Smart ingredient suggestions

## Key Hooks

- `useUserProfile`: Access and modify user profile data
- `useMealPreferences`: Handle meal-specific preferences
- `usePantry`: Manage pantry inventory

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

### Code Quality
- TypeScript for type safety
- ESLint + Prettier for consistent formatting
- Component-based architecture with clear separation of concerns

### Testing
- Unit tests for business logic
- Component tests with React Testing Library
- E2E tests with Playwright

### State Management
- React Context for global state
- Local state for component-specific data
- Persisted state in localStorage

## Contributing

1. Follow the established project structure
2. Keep components small and focused
3. Document complex logic with inline comments
4. Write tests for new features
5. Use TypeScript strictly - no `any` types

## Key Interfaces

```typescript
// User Profile Types
interface UserPreferences {
  dietaryRestrictions: string[];
  goals: string[];
  likedMeals: string[];
  dislikedMeals: string[];
  pantry: string[];
  profileComplete: boolean;
}

// Meal Planning Types
interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
  totalNutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}
```

## Code Style

- Consistent naming conventions:
  - Components: PascalCase
  - Functions: camelCase
  - Files: component files match component names
- Clear component hierarchy
- Single responsibility principle
- Proper TypeScript usage

## Performance Considerations

- Lazy loading for routes
- Memoization where beneficial
- Efficient state management
- Optimized re-renders

## Next Steps

1. Implement backend integration
2. Add user authentication
3. Enable social sharing
4. Add meal history tracking
5. Implement advanced nutrition analytics

## License

This project is MIT licensed.
