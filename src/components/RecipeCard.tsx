import { Recipe } from '@/types/recipe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  isFavorite?: boolean;
}

export const RecipeCard = ({ recipe, onClick, isFavorite = false }: RecipeCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-border hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-fade-in"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          {isFavorite && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Favorite
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white line-clamp-2">{recipe.name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {recipe.dietary.slice(0, 2).map(diet => (
            <Badge key={diet} variant="outline" className="text-xs">
              {diet}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">{recipe.cuisine}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChefHat className="h-4 w-4 text-secondary" />
            <span>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span>{recipe.rating} ({recipe.ratingCount})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
