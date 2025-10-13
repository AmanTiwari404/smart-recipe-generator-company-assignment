import { useState, useMemo, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { recipes, allIngredients } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetail } from '@/components/RecipeDetail';
import { SearchFilters } from '@/components/SearchFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heart, ChefHat } from 'lucide-react';
import { toast } from 'sonner';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('all');
  const [maxCookingTime, setMaxCookingTime] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('all');

  // Load favorites and ratings from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedRatings = localStorage.getItem('ratings');
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
    if (savedRatings) setRatings(JSON.parse(savedRatings));
  }, []);

  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
        toast.success('Removed from favorites');
      } else {
        newFavorites.add(recipeId);
        toast.success('Added to favorites!');
      }
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const setRecipeRating = (recipeId: string, rating: number) => {
    setRatings(prev => {
      const newRatings = { ...prev, [recipeId]: rating };
      localStorage.setItem('ratings', JSON.stringify(newRatings));
      return newRatings;
    });
    toast.success(`Rated ${rating} stars!`);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search query
      if (searchQuery && !recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !recipe.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Ingredients filter (recipe must have at least one selected ingredient)
      if (selectedIngredients.length > 0) {
        const hasIngredient = selectedIngredients.some(ing =>
          recipe.ingredients.some(recipeIng => 
            recipeIng.toLowerCase().includes(ing.toLowerCase())
          )
        );
        if (!hasIngredient) return false;
      }

      // Dietary filters (recipe must match all selected dietary preferences)
      if (selectedDietary.length > 0) {
        const matchesDietary = selectedDietary.every(diet =>
          recipe.dietary.includes(diet)
        );
        if (!matchesDietary) return false;
      }

      // Difficulty filter
      if (difficulty !== 'all' && recipe.difficulty !== difficulty) {
        return false;
      }

      // Cooking time filter
      if (maxCookingTime !== 'all' && recipe.cookingTime > parseInt(maxCookingTime)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedIngredients, selectedDietary, difficulty, maxCookingTime]);

  const favoriteRecipes = useMemo(() => {
    return recipes.filter(recipe => favorites.has(recipe.id));
  }, [favorites]);

  const displayedRecipes = activeTab === 'favorites' ? favoriteRecipes : filteredRecipes;

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleDietaryToggle = (dietary: string) => {
    setSelectedDietary(prev =>
      prev.includes(dietary)
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIngredients([]);
    setSelectedDietary([]);
    setDifficulty('all');
    setMaxCookingTime('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <img 
          src={heroImage} 
          alt="Fresh ingredients" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="max-w-2xl text-white animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Smart Recipe Generator
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Discover delicious recipes based on the ingredients you have
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <ChefHat className="h-5 w-5" />
                  <span className="font-medium">22+ Recipes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">Save Favorites</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedIngredients={selectedIngredients}
              onIngredientToggle={handleIngredientToggle}
              availableIngredients={allIngredients}
              selectedDietary={selectedDietary}
              onDietaryToggle={handleDietaryToggle}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              maxCookingTime={maxCookingTime}
              onMaxCookingTimeChange={setMaxCookingTime}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Recipes Grid */}
          <main>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="all">
                  All Recipes ({filteredRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="favorites">
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites ({favoriteRecipes.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {displayedRecipes.length === 0 ? (
              <div className="text-center py-16">
                <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-bold mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'favorites' 
                    ? "You haven't saved any favorites yet" 
                    : "Try adjusting your filters or search query"}
                </p>
                {activeTab !== 'favorites' && (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    isFavorite={favorites.has(recipe.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetail
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        isFavorite={selectedRecipe ? favorites.has(selectedRecipe.id) : false}
        onToggleFavorite={() => selectedRecipe && toggleFavorite(selectedRecipe.id)}
        onRate={(rating) => selectedRecipe && setRecipeRating(selectedRecipe.id, rating)}
        userRating={selectedRecipe ? ratings[selectedRecipe.id] || 0 : 0}
      />
    </div>
  );
};

export default Index;
