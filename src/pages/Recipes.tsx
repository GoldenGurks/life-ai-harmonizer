import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookmarkPlus, ChefHat, Heart, Upload, Camera, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { Recipe, RecipeFilters } from '@/types/recipes';
import { recipeData, findRecipeById, getAlternativeRecipes } from '@/data/recipeDatabase';
import { Checkbox } from '@/components/ui/checkbox';
import { ingredientContains } from '@/utils/ingredientUtils';
import PhotoRecipeExtractor from '@/components/recipes/PhotoRecipeExtractor';
import UserProfile from '@/components/profile/UserProfile';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import PhotoImportModal from '@/components/recipes/PhotoImportModal';

// New components
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import { useRecipeState } from '@/hooks/useRecipeState';
import RecipeSearchBar from '@/components/recipes/RecipeSearchBar';
import RecipeFilterTags from '@/components/recipes/RecipeFilterTags';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import RecipeDetailDrawer from '@/components/recipes/RecipeDetailDrawer';

const mealTypeFilters = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const timeFilters = ['All', 'Under 15 mins', 'Under 30 mins', 'Under 45 mins', 'Under 60 mins'];
const dietaryFilters = ['Vegan', 'Vegetarian', 'High Protein', 'Low Carb', 'Gluten Free', 'Dairy Free', 'Nut Free'];

const Recipes = () => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isUploadDrawerOpen, setIsUploadDrawerOpen] = useState(false);
  const [isPhotoExtractorOpen, setIsPhotoExtractorOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isPhotoImportOpen, setIsPhotoImportOpen] = useState(false);
  
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    filteredRecipes,
    searchResults,
    handleDietaryFilterChange,
    handleFilterChange,
    clearFilters,
    applyFilters
  } = useRecipeFilters();
  
  const {
    selectedRecipe,
    setSelectedRecipe,
    isRecipeDetailOpen,
    setIsRecipeDetailOpen,
    extractedRecipes,
    getEnrichedRecipe,
    openRecipeDetail,
    handleExtractedRecipe
  } = useRecipeState();

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
    
    const recipe = findRecipeById(recipeId);
    if (recipe) {
      openRecipeDetail(recipe);
    }
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

  const handleAlternativeClick = async (altRecipe: Recipe) => {
    const enriched = await getEnrichedRecipe(altRecipe);
    setSelectedRecipe(enriched);
  };

  // Add recipe to library from photo import
  const handlePhotoRecipeCreated = (recipe: Recipe) => {
    handleExtractedRecipe(recipe);
    toast.success(`Recipe "${recipe.title}" imported from photo successfully!`);
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
          <Button variant="outline" onClick={() => setIsPhotoImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
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

      <RecipeSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        onFilterClick={() => setIsFilterDrawerOpen(true)}
      />

      <RecipeFilterTags
        activeFilters={activeFilters}
        onDietaryFilterChange={handleDietaryFilterChange}
        onClearFilters={() => {
          clearFilters();
          toast.info("All filters cleared");
        }}
      />

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeGrid
            recipes={getDisplayRecipes()}
            onRecipeClick={openRecipeDetail}
            onSaveRecipe={saveRecipe}
            onShowAlternatives={showAlternatives}
            onClearFilters={() => {
              clearFilters();
              toast.info("All filters cleared");
            }}
          />
        </TabsContent>
        
        <TabsContent value="saved" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeGrid
            recipes={recipeData.filter(r => r.saved)}
            onRecipeClick={openRecipeDetail}
            onSaveRecipe={saveRecipe}
            onShowAlternatives={showAlternatives}
            onClearFilters={() => {
              clearFilters();
              toast.info("All filters cleared");
            }}
          />
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
            <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Organize your recipes into collections</h3>
            <p className="text-muted-foreground mb-4">Create themed collections like "Quick Lunches" or "Favorite Dinners".</p>
            <Button>
              Create Collection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Photo Extractor Drawer */}
      {isPhotoExtractorOpen && (
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
                  onRecipeExtracted={(recipe) => {
                    handleExtractedRecipe(recipe);
                    toast.success(`Recipe "${recipe.title}" added to your collection!`);
                  }}
                  onClose={() => setIsPhotoExtractorOpen(false)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      
      {/* Photo Import Drawer */}
      {isPhotoImportOpen && (
        <Drawer open={isPhotoImportOpen} onOpenChange={setIsPhotoImportOpen}>
          <DrawerContent className="max-h-[90vh]">
            <div className="mx-auto w-full max-w-2xl">
              <DrawerHeader>
                <DrawerTitle>Import Recipe from Photo</DrawerTitle>
                <DrawerDescription>
                  Upload a photo of food and let SmartPlate extract the recipe details automatically.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 overflow-y-auto">
                <PhotoImportModal
                  onRecipeCreated={handlePhotoRecipeCreated}
                  onClose={() => setIsPhotoImportOpen(false)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      
      {/* User Profile Drawer */}
      {isUserProfileOpen && (
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
      )}
      
      {/* Filter Drawer */}
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
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => {
                applyFilters();
                setIsFilterDrawerOpen(false);
              }}>
                Apply Filters
              </Button>
              <Button variant="outline" onClick={() => {
                clearFilters();
                toast.info("All filters cleared");
              }}>
                Clear Filters
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Upload Drawer */}
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
      
      {/* Recipe Detail Drawer */}
      <RecipeDetailDrawer
        isOpen={isRecipeDetailOpen}
        onOpenChange={setIsRecipeDetailOpen}
        selectedRecipe={selectedRecipe}
        onSaveRecipe={saveRecipe}
        onAlternativeClick={handleAlternativeClick}
      />
    </Layout>
  );
};

export default Recipes;
