
import React from 'react';
import Layout from '@/components/Layout';
import FeatureCard from '@/components/dashboard/FeatureCard';
import AISuggestionCard from '@/components/dashboard/AISuggestionCard';
import { ChefHat, GraduationCap, PieChart, Calendar, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NutrientProgressBar from '@/components/dashboard/NutrientProgressBar';

const Index = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Your AI-powered lifestyle assistant is ready to help you with nutrition and learning.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
        <div className="grid gap-4">
          <AISuggestionCard
            title="Today's Meal Plan"
            suggestion="Based on your preferences, I've created a Mediterranean-inspired meal plan for today that fits your nutritional goals."
          />
          <AISuggestionCard
            title="Study Recommendation"
            suggestion="Ready to continue your Spanish learning? I've prepared 15 new flashcards based on your recent progress."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Nutrition</h2>
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
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Learning</h2>
          <div className="grid gap-4">
            <FeatureCard
              title="Flashcards"
              description="Create and study with customizable flashcards."
              icon={<GraduationCap className="h-5 w-5 text-accent" />}
              to="/flashcards"
              color="bg-accent/10"
            />
            <FeatureCard
              title="Study Plan"
              description="Follow personalized learning paths with AI guidance."
              icon={<Calendar className="h-5 w-5 text-primary" />}
              to="/study-plan"
              color="bg-primary/10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Today's Nutrition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NutrientProgressBar label="Calories" value={1250} max={2000} unit="kcal" />
              <NutrientProgressBar label="Protein" value={45} max={80} unit="g" color="bg-secondary" />
              <NutrientProgressBar label="Carbs" value={120} max={200} unit="g" color="bg-accent" />
              <NutrientProgressBar label="Fat" value={30} max={65} unit="g" color="bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-accent" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <NutrientProgressBar label="Spanish Vocabulary" value={32} max={100} unit="words" color="bg-accent" />
              <NutrientProgressBar label="Daily Study Goal" value={25} max={30} unit="min" color="bg-secondary" />
              <NutrientProgressBar label="Flashcard Mastery" value={65} max={100} unit="%" color="bg-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
