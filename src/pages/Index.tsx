
import React from 'react';
import Layout from '@/components/Layout';
import FeatureCard from '@/components/dashboard/FeatureCard';
import AISuggestionCard from '@/components/dashboard/AISuggestionCard';
import { ChefHat, PieChart, Calendar, Bookmark, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NutrientProgressBar from '@/components/dashboard/NutrientProgressBar';

/**
 * Home/Dashboard page component
 * Serves as the main landing page and overview of the application
 * Displays AI suggestions, nutrition summary, and quick navigation to features
 */
const Index = () => {
  return (
    <Layout>
      {/* Page header with welcome message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to MealMate</h1>
        <p className="text-muted-foreground">
          Your AI-powered nutrition assistant is ready to help you plan meals and achieve your health goals.
        </p>
      </div>

      {/* AI Suggestions section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
        <div className="grid gap-4">
          <AISuggestionCard
            title="Today's Meal Plan"
            suggestion="Based on your preferences, I've created a Mediterranean-inspired meal plan for today that fits your nutritional goals."
          />
          <AISuggestionCard
            title="Featured Recipe"
            suggestion="Try this protein-rich Quinoa Bowl with seasonal vegetables that aligns with your dietary preferences."
          />
        </div>
      </div>

      {/* Main content grid - Features and Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left column - Feature navigation cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Meal Planning</h2>
          <div className="grid gap-4">
            <FeatureCard
              title="Recipe Collection"
              description="Save and organize recipes from social media and the web."
              icon={<Bookmark className="h-5 w-5 text-primary" />}
              to="/recipes"
              color="bg-primary/10"
            />
            <FeatureCard
              title="Meal Planning"
              description="Get AI-generated meal plans based on your preferences."
              icon={<Calendar className="h-5 w-5 text-secondary" />}
              to="/meal-planning"
              color="bg-secondary/10"
            />
            <FeatureCard
              title="Shopping List"
              description="Generate shopping lists from your meal plans automatically."
              icon={<ShoppingCart className="h-5 w-5 text-accent" />}
              to="/shopping"
              color="bg-accent/10"
            />
          </div>
        </div>

        {/* Right column - Nutrition summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Today's Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Nutrition progress bars */}
              <NutrientProgressBar label="Calories" value={1250} max={2000} unit="kcal" />
              <NutrientProgressBar label="Protein" value={45} max={80} unit="g" color="bg-secondary" />
              <NutrientProgressBar label="Carbs" value={120} max={200} unit="g" color="bg-accent" />
              <NutrientProgressBar label="Fat" value={30} max={65} unit="g" color="bg-primary" />
              <NutrientProgressBar label="Fiber" value={12} max={25} unit="g" color="bg-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom section - Cards with additional information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Suggested meals card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-primary" />
              Suggested Meals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">Breakfast</p>
            <p className="text-sm text-muted-foreground">Greek yogurt with honey and berries</p>
            <p className="text-sm font-medium mt-4">Lunch</p>
            <p className="text-sm text-muted-foreground">Quinoa salad with roasted vegetables</p>
            <p className="text-sm font-medium mt-4">Dinner</p>
            <p className="text-sm text-muted-foreground">Grilled salmon with asparagus</p>
          </CardContent>
        </Card>

        {/* Weekly progress card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary" />
              Weekly Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">Planned meals:</p>
            <p className="text-sm text-muted-foreground">15/21 (71%)</p>
            <p className="text-sm font-medium mt-4">Protein goal:</p>
            <p className="text-sm text-muted-foreground">On track (avg. 76g/day)</p>
            <p className="text-sm font-medium mt-4">Vegetable servings:</p>
            <p className="text-sm text-muted-foreground">4.2/day (goal: 5)</p>
          </CardContent>
        </Card>

        {/* Shopping list summary card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-accent" />
              Shopping List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Your weekly shopping list is ready:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-5">
              <li>Fresh vegetables (8 items)</li>
              <li>Proteins (3 items)</li>
              <li>Dairy products (2 items)</li>
              <li>Pantry staples (5 items)</li>
            </ul>
            <button className="w-full text-sm text-primary mt-4 flex items-center justify-center">
              View complete list →
            </button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
