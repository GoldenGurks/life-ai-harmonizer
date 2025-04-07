
import React from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Plus, BookmarkPlus, ChefHat, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  category: string;
  tags: string[];
  saved: boolean;
}

const recipeData: Recipe[] = [
  {
    id: '1',
    title: 'Mediterranean Quinoa Bowl',
    image: 'https://placehold.co/600x400?text=Mediterranean+Bowl',
    time: '25 mins',
    category: 'Lunch',
    tags: ['Vegan', 'High Protein', 'Mediterranean'],
    saved: true,
  },
  {
    id: '2',
    title: 'Avocado & Kale Smoothie',
    image: 'https://placehold.co/600x400?text=Green+Smoothie',
    time: '5 mins',
    category: 'Breakfast',
    tags: ['Vegan', 'Quick', 'Superfood'],
    saved: false,
  },
  {
    id: '3',
    title: 'Grilled Chicken Salad',
    image: 'https://placehold.co/600x400?text=Chicken+Salad',
    time: '20 mins',
    category: 'Lunch',
    tags: ['High Protein', 'Low Carb'],
    saved: true,
  },
  {
    id: '4',
    title: 'Baked Salmon with Asparagus',
    image: 'https://placehold.co/600x400?text=Salmon+Dinner',
    time: '30 mins',
    category: 'Dinner',
    tags: ['Omega-3', 'High Protein'],
    saved: false,
  },
];

const Recipes = () => {
  const saveRecipe = (id: string) => {
    toast.success("Recipe saved to your collection");
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search recipes..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="personal">My Recipes</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipeData.map(recipe => (
            <Card key={recipe.id} className="overflow-hidden">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              ></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => saveRecipe(recipe.id)}
                  >
                    {recipe.saved ? 
                      <Heart className="h-4 w-4 fill-secondary text-secondary" /> :
                      <Heart className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <ChefHat className="h-4 w-4 mr-1" /> 
                  <span>{recipe.time} • {recipe.category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Recipe</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="saved" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipeData.filter(r => r.saved).map(recipe => (
            <Card key={recipe.id} className="overflow-hidden">
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              ></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => saveRecipe(recipe.id)}
                  >
                    <Heart className="h-4 w-4 fill-secondary text-secondary" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <ChefHat className="h-4 w-4 mr-1" /> 
                  <span>{recipe.time} • {recipe.category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Recipe</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="personal">
          <div className="text-center py-16">
            <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No personal recipes yet</h3>
            <p className="text-muted-foreground mb-4">Start adding your own recipes to build your collection.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add My First Recipe
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="ai">
          <div className="text-center py-16">
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Let AI create recipes for you</h3>
            <p className="text-muted-foreground mb-4">Get personalized recipes based on your preferences and dietary needs.</p>
            <Button>
              Generate Recipe
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Recipes;
