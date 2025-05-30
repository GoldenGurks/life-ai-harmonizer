import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Plus, BookmarkPlus, ChefHat, Heart, Tag, Clock, Bookmark, Upload, TrendingUp, Flame, Leaf, X, Camera, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { motion } from '@/lib/motion';
import { Recipe, RecipeFilters } from '@/types/recipes';
import { recipeData, findRecipeById, getAlternativeRecipes } from '@/data/recipeDatabase';
import { Checkbox } from '@/components/ui/checkbox';
import { getIngredientAsString, ingredientContains } from '@/utils/ingredientUtils';
import PhotoRecipeExtractor from '@/components/recipes/PhotoRecipeExtractor';
import UserProfile from '@/components/profile/UserProfile';

const mealTypeFilters = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const timeFilters = ['All', 'Under 15 mins', 'Under 30 mins', 'Under 45 mins', 'Under 60 mins'];
const dietaryFilters = ['Vegan', 'Vegetarian', 'High Protein', 'Low Carb', 'Gluten Free', 'Dairy Free', 'Nut Free'];

const Recipes = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeDetailOpen, setIsRecipeDetailOpen] = useState(false);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [isPhotoExtractorOpen, setIsPhotoExtractorOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [extractedRecipes, setExtractedRecipes] = useState<Recipe[]>([]);
  
  const [activeFilters, setActiveFilters] = useState<RecipeFilters>({
    dietary: [],
    mealType: 'All',
    time: 'All',
    calorieRange: [0, 800],
  });
  
  const [filteredRecipes, setFilteredRecipes] = useState(recipeData);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchQuery]);

  const openRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeDetailOpen(true);
  };

  const saveRecipe = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const recipe = findRecipeById(id);
    if (!recipe) return;
    
    recipe.saved = !recipe.saved;
    toast.success(recipe.saved 
      ? "Recipe saved to your collection" 
      : "Recipe removed from your collection"
    );
  };

  const showAlternatives = (recipeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const alternatives = getAlternativeRecipes(recipeId);
    if (alternatives.length === 0) {
      toast.info("No alternative recipes available");
      return;
    }
    
    setSelectedRecipe(findRecipeById(recipeId));
    setIsRecipeDetailOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const results = recipeData.filter(recipe => {
      if (recipe.title.toLowerCase().includes(query)) return true;
      if (recipe.ingredients.some(ingredient => ingredientContains(ingredient, query))) return true;
      if (recipe.tags.some(tag => tag.toLowerCase().includes(query))) return true;
      return false;
    });
    
    setSearchResults(results);
    
    if (results.length === 0) {
      toast.info(`No recipes found matching "${searchQuery}"`);
    } else {
      toast.success(`Found ${results.length} recipes matching "${searchQuery}"`);
    }
  };

  const handleUploadRecipe = () => {
    if (!isUploadDrawerOpen) return;
    toast.success("Recipe uploaded successfully!");
    setIsUploadDrawerOpen(false);
  };

  const handleDietaryFilterChange = (filterName: string) => {
    setActiveFilters(prev => {
      const currentFilters = [...prev.dietary];
      
      if (currentFilters.includes(filterName)) {
        return {
          ...prev,
          dietary: currentFilters.filter(f => f !== filterName)
        };
      } 
      else {
        return {
          ...prev,
          dietary: [...currentFilters, filterName]
        };
      }
    });
  };

  const handleFilterChange = (type: keyof RecipeFilters, value: string | number | number[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      dietary: [],
      mealType: 'All',
      time: 'All',
      calorieRange: [0, 800],
    });
    toast.info("All filters cleared");
  };

  const applyFilters = () => {
    let results = recipeData;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(recipe => {
        return recipe.title.toLowerCase().includes(query) || 
               recipe.ingredients.some(ingredient => ingredientContains(ingredient, query)) ||
               recipe.tags.some(tag => tag.toLowerCase().includes(query));
      });
    }
    
    if (activeFilters.dietary.length > 0) {
      results = results.filter(recipe => 
        activeFilters.dietary.every(dietary => 
          recipe.tags.some(tag => tag.toLowerCase() === dietary.toLowerCase())
        )
      );
    }
    
    if (activeFilters.mealType !== 'All') {
      results = results.filter(recipe => 
        recipe.category === activeFilters.mealType
      );
    }
    
    if (activeFilters.time !== 'All') {
      const timeLimit = parseInt(activeFilters.time.match(/\d+/)?.[0] || '60');
      results = results.filter(recipe => {
        const recipeTime = parseInt(recipe.time.match(/\d+/)?.[0] || '0');
        return recipeTime <= timeLimit;
      });
    }
    
    results = results.filter(recipe => 
      recipe.calories >= activeFilters.calorieRange[0] &&
      recipe.calories <= activeFilters.calorieRange[1]
    );
    
    setFilteredRecipes(results);
    setSearchResults(results);
  };

  const handleExtractedRecipe = (recipe: Recipe) => {
    setExtractedRecipes(prev => [recipe, ...prev]);
    toast.success(`Recipe "${recipe.title}" added to your collection!`);
  };

  const getAllRecipes = () => {
    return [...extractedRecipes, ...recipeData];
  };

  const getDisplayRecipes = () => {
    const allRecipes = getAllRecipes();
    if (searchQuery.trim()) {
      return searchResults;
    }
    return allRecipes.filter(recipe => {
      if (recipe.title.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      if (recipe.ingredients.some(ingredient => ingredientContains(ingredient, searchQuery))) return true;
      if (recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery))) return true;
      return false;
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsUserProfileOpen(true)}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
          <Button variant="outline" onClick={() => setIsPhotoExtractorOpen(true)}>
            <Camera className="h-4 w-4 mr-2" />
            Extract from Photo
          </Button>
          <Button variant="outline" onClick={() => setIsUploadDrawerOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Recipe
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Recipe
          </Button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search recipes..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
        <Button variant="outline" size="icon" onClick={() => setIsFilterDrawerOpen(true)}>
          <Filter className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-wrap overflow-x-auto pb-2 mb-6 gap-2">
        {activeFilters.dietary.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear filters
          </Button>
        )}
        
        {activeFilters.dietary.map(filter => (
          <Badge 
            key={filter}
            variant="default" 
            className="cursor-pointer flex items-center gap-1"
            onClick={() => handleDietaryFilterChange(filter)}
          >
            {filter}
            <X className="h-3 w-3 ml-1" />
          </Badge>
        ))}
        
        {dietaryFilters
          .filter(filter => !activeFilters.dietary.includes(filter))
          .map(filter => (
            <Badge 
              key={filter}
              variant="outline" 
              className="cursor-pointer"
              onClick={() => handleDietaryFilterChange(filter)}
            >
              {filter}
            </Badge>
          ))}
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayRecipes().length > 0 ? (
            getDisplayRecipes().map(recipe => (
              <Card 
                key={recipe.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => openRecipeDetail(recipe)}
              >
                <div 
                  className="w-full h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${recipe.image})` }}
                >
                  <div className="flex justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      <Clock className="h-3 w-3 mr-1" />
                      {recipe.time}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {recipe.difficulty || 'Medium'}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => saveRecipe(recipe.id, e)}
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
                    <span>{recipe.category}</span>
                    <span className="mx-2">•</span>
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{recipe.tags.slice(0, 2).join(", ")}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <span className="font-medium">{recipe.calories}</span>
                      <span className="text-muted-foreground">kcal</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <span className="font-medium">{recipe.protein}g</span>
                      <span className="text-muted-foreground">Protein</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                      <span className="font-medium">{recipe.carbs}g</span>
                      <span className="text-muted-foreground">Carbs</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={(e) => showAlternatives(recipe.id, e)} className="text-muted-foreground">
                    <TrendingUp className="h-4 w-4 mr-1" /> 
                    Alternatives
                  </Button>
                  <Button variant="outline" size="sm">View Recipe</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-muted-foreground">No recipes found with the current filters.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipeData.filter(r => r.saved).map(recipe => (
            <Card 
              key={recipe.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
              onClick={() => openRecipeDetail(recipe)}
            >
              <div 
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              >
                <div className="flex justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    <Clock className="h-3 w-3 mr-1" />
                    {recipe.time}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {recipe.difficulty || 'Medium'}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={(e) => saveRecipe(recipe.id, e)}
                  >
                    <Heart className="h-4 w-4 fill-secondary text-secondary" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <ChefHat className="h-4 w-4 mr-1" /> 
                  <span>{recipe.category}</span>
                  <span className="mx-2">•</span>
                  <Tag className="h-4 w-4 mr-1" />
                  <span>{recipe.tags.slice(0, 2).join(", ")}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <span className="font-medium">{recipe.calories}</span>
                    <span className="text-muted-foreground">kcal</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <span className="font-medium">{recipe.protein}g</span>
                    <span className="text-muted-foreground">Protein</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                    <span className="font-medium">{recipe.carbs}g</span>
                    <span className="text-muted-foreground">Carbs</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={(e) => showAlternatives(recipe.id, e)} className="text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1" /> 
                  Alternatives
                </Button>
                <Button variant="outline" size="sm">View Recipe</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="my-recipes">
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
        
        <TabsContent value="collections">
          <div className="text-center py-16">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Organize your recipes into collections</h3>
            <p className="text-muted-foreground mb-4">Create themed collections like "Quick Lunches" or "Favorite Dinners".</p>
            <Button>
              Create Collection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Filter Recipes</DrawerTitle>
              <DrawerDescription>
                Refine your recipe search with these filters.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryFilters.map(filter => (
                      <div key={filter} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`filter-${filter}`} 
                          checked={activeFilters.dietary.includes(filter)}
                          onCheckedChange={() => handleDietaryFilterChange(filter)}
                        />
                        <label htmlFor={`filter-${filter}`} className="text-sm">
                          {filter}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Meal Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {mealTypeFilters.map(filter => (
                      <Badge 
                        key={filter} 
                        variant={activeFilters.mealType === filter ? "default" : "outline"} 
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('mealType', filter)}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Preparation Time</h3>
                  <div className="flex flex-wrap gap-2">
                    {timeFilters.map(filter => (
                      <Badge 
                        key={filter} 
                        variant={activeFilters.time === filter ? "default" : "outline"} 
                        className="cursor-pointer"
                        onClick={() => handleFilterChange('time', filter)}
                      >
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Calories</h3>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[200, 600]} 
                      max={1000} 
                      step={50}
                      onValueChange={(value) => handleFilterChange('calorieRange', value)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>{activeFilters.calorieRange[0]} kcal</span>
                      <span>{activeFilters.calorieRange[1]} kcal</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Nutritional Focus</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Flame className="h-4 w-4 mr-2 text-orange-500" />
                      High Protein
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Leaf className="h-4 w-4 mr-2 text-green-500" />
                      Low Carb
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Tag className="h-4 w-4 mr-2 text-blue-500" />
                      Low Fat
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Heart Healthy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => {
                applyFilters();
                setIsFilterDrawerOpen(false);
              }}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={isUploadDrawerOpen} onOpenChange={setIsUploadDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Import Recipe</DrawerTitle>
              <DrawerDescription>
                Import recipes from websites, social media, or enter manually.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Recipe URL</label>
                  <Input placeholder="Paste URL from a website, Instagram, or TikTok" className="mt-1" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Our AI will extract the recipe details automatically
                  </p>
                </div>
                
                <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="text-sm font-medium mt-2">Upload Image</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to upload
                  </p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleUploadRecipe}>Import Recipe</Button>
              <Button variant="outline" onClick={() => setIsUploadDrawerOpen(false)}>
                Cancel
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={isPhotoExtractorOpen} onOpenChange={setIsPhotoExtractorOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Extract Recipe from Photo</DrawerTitle>
              <DrawerDescription>
                Upload a photo of a recipe and let AI extract the ingredients and instructions.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 overflow-y-auto">
              <PhotoRecipeExtractor
                onRecipeExtracted={handleExtractedRecipe}
                onClose={() => setIsPhotoExtractorOpen(false)}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={isUserProfileOpen} onOpenChange={setIsUserProfileOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>User Profile</DrawerTitle>
              <DrawerDescription>
                Manage your profile and connect with other users to share recipes.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 overflow-y-auto max-h-[calc(90vh-12rem)]">
              <UserProfile />
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsUserProfileOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
      <Drawer open={isRecipeDetailOpen} onOpenChange={setIsRecipeDetailOpen}>
        <DrawerContent className="max-h-[90vh]">
          <div className="mx-auto w-full max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>{selectedRecipe?.title}</DrawerTitle>
              <DrawerDescription>
                {selectedRecipe?.tags.join(" • ")}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 overflow-y-auto max-h-[calc(90vh-12rem)]">
              {selectedRecipe && (
                <div className="space-y-6">
                  <div 
                    className="w-full h-64 md:h-80 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${selectedRecipe.image})` }}
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium mt-1">{selectedRecipe.time}</span>
                        <span className="text-xs text-muted-foreground">Prep time</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Flame className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium mt-1">{selectedRecipe.calories}</span>
                        <span className="text-xs text-muted-foreground">Calories</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium mt-1">{selectedRecipe.difficulty}</span>
                        <span className="text-xs text-muted-foreground">Difficulty</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant={selectedRecipe.saved ? "default" : "outline"} 
                      size="sm"
                      onClick={() => saveRecipe(selectedRecipe.id)}
                      className="gap-2"
                    >
                      {selectedRecipe.saved ? (
                        <>
                          <Bookmark className="h-4 w-4 fill-current" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Save Recipe
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-sm font-bold mb-3">Nutrition Facts</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Calories</span>
                            <span className="font-medium">{selectedRecipe.calories} kcal</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5 mt-1">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Protein</span>
                            <span className="font-medium">{selectedRecipe.protein}g</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5 mt-1">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Carbs</span>
                            <span className="font-medium">{selectedRecipe.carbs}g</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5 mt-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Fat</span>
                            <span className="font-medium">{selectedRecipe.fat}g</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5 mt-1">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{getIngredientAsString(ingredient)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-3">Alternative Recipes</h3>
                    <p className="text-sm text-muted-foreground mb-4">Don't like this recipe? Try these alternatives:</p>
                    
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      {selectedRecipe.alternativeIds?.map(id => {
                        const altRecipe = recipeData.find(r => r.id === id);
                        if (!altRecipe) return null;
                        
                        return (
                          <motion.div 
                            key={id}
                            className="min-w-[220px] rounded-lg overflow-hidden border cursor-pointer"
                            onClick={() => {
                              setSelectedRecipe(altRecipe);
                            }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div 
                              className="h-28 bg-cover bg-center"
                              style={{ backgroundImage: `url(${altRecipe.image})` }}
                            />
                            <div className="p-3">
                              <h4 className="font-medium text-sm line-clamp-1">{altRecipe.title}</h4>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {altRecipe.time}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DrawerFooter>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">Add to Meal Plan</Button>
                <Button className="flex-1">Add to Shopping List</Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </Layout>
  );
};

export default Recipes;
