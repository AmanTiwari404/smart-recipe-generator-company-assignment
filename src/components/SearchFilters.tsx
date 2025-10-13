import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { dietaryOptions } from '@/data/recipes';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedIngredients: string[];
  onIngredientToggle: (ingredient: string) => void;
  availableIngredients: string[];
  selectedDietary: string[];
  onDietaryToggle: (dietary: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  maxCookingTime: string;
  onMaxCookingTimeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedIngredients,
  onIngredientToggle,
  availableIngredients,
  selectedDietary,
  onDietaryToggle,
  difficulty,
  onDifficultyChange,
  maxCookingTime,
  onMaxCookingTimeChange,
  onClearFilters
}: SearchFiltersProps) => {
  const hasActiveFilters = selectedIngredients.length > 0 || selectedDietary.length > 0 || 
    difficulty !== 'all' || maxCookingTime !== 'all';

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border shadow-soft">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Dietary Preferences */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Dietary Preferences</h3>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(option => (
            <Badge
              key={option.id}
              variant={selectedDietary.includes(option.id) ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => onDietaryToggle(option.id)}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Max Cooking Time</label>
          <Select value={maxCookingTime} onValueChange={onMaxCookingTimeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              <SelectItem value="30">Under 30 min</SelectItem>
              <SelectItem value="45">Under 45 min</SelectItem>
              <SelectItem value="60">Under 1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-foreground">Selected Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ingredient => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="cursor-pointer gap-1 pr-1"
                onClick={() => onIngredientToggle(ingredient)}
              >
                {ingredient}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Ingredient Suggestions */}
      <div>
        <h3 className="font-semibold mb-3 text-foreground">Add Ingredients</h3>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {availableIngredients
            .filter(ing => !selectedIngredients.includes(ing))
            .slice(0, 20)
            .map(ingredient => (
              <Badge
                key={ingredient}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onIngredientToggle(ingredient)}
              >
                + {ingredient}
              </Badge>
            ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};
