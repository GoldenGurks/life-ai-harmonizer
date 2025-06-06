
import { useState, useEffect } from 'react';
import { Recipe, RecipeFilters } from '@/types/recipes';
import { ingredientContains } from '@/utils/ingredientUtils';
import { recipeData } from '@/data/recipeDatabase';

export const useRecipeFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<RecipeFilters>({
    dietary: [],
    mealType: 'All',
    time: 'All',
    calorieRange: [0, 800],
  });
  
  const [filteredRecipes, setFilteredRecipes] = useState(recipeData);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

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

  useEffect(() => {
    applyFilters();
  }, [activeFilters, searchQuery]);

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
  };

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    filteredRecipes,
    searchResults,
    handleDietaryFilterChange,
    handleFilterChange,
    clearFilters,
    applyFilters
  };
};
