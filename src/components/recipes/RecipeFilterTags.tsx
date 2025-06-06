
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { RecipeFilters } from '@/types/recipes';

const dietaryFilters = ['Vegan', 'Vegetarian', 'High Protein', 'Low Carb', 'Gluten Free', 'Dairy Free', 'Nut Free'];

interface RecipeFilterTagsProps {
  activeFilters: RecipeFilters;
  onDietaryFilterChange: (filter: string) => void;
  onClearFilters: () => void;
}

const RecipeFilterTags: React.FC<RecipeFilterTagsProps> = ({
  activeFilters,
  onDietaryFilterChange,
  onClearFilters
}) => {
  return (
    <div className="flex flex-wrap overflow-x-auto pb-2 mb-6 gap-2">
      {activeFilters.dietary.length > 0 && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearFilters}
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
          onClick={() => onDietaryFilterChange(filter)}
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
            onClick={() => onDietaryFilterChange(filter)}
          >
            {filter}
          </Badge>
        ))}
    </div>
  );
};

export default RecipeFilterTags;
