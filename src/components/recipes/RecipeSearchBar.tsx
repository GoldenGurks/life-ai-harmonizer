
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface RecipeSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onFilterClick: () => void;
}

const RecipeSearchBar: React.FC<RecipeSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onFilterClick
}) => {
  return (
    <form onSubmit={onSearchSubmit} className="flex items-center gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search recipes..." 
          className="pl-10" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
      <Button variant="outline" size="icon" onClick={onFilterClick}>
        <Filter className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default RecipeSearchBar;
