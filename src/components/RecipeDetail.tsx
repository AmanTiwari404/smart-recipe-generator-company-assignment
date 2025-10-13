import { Recipe } from '@/types/recipe';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ChefHat, Users, Star, Heart, Flame } from 'lucide-react';
import { useState } from 'react';

interface RecipeDetailProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRate: (rating: number) => void;
  userRating: number;
}

export const RecipeDetail = ({ 
  recipe, 
  open, 
  onOpenChange,
  isFavorite,
  onToggleFavorite,
  onRate,
  userRating
}: RecipeDetailProps) => {
  const [servings, setServings] = useState(recipe?.servings || 4);

  if (!recipe) return null;

  const servingMultiplier = servings / recipe.servings;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative h-64 w-full">
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <DialogHeader className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <DialogTitle className="text-3xl font-bold mb-2">{recipe.name}</DialogTitle>
            <p className="text-white/90">{recipe.description}</p>
          </DialogHeader>
        </div>

        <ScrollArea className="max-h-[calc(90vh-16rem)] px-6 pb-6">
          <div className="space-y-6">
            {/* Quick Info & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">{recipe.cookingTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-secondary" />
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                    >
                      -
                    </Button>
                    <span className="font-medium">{servings}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => setServings(servings + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleFavorite}
                  className="gap-2"
                >
                  <Heart className={isFavorite ? "fill-current" : ""} />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            {/* Dietary & Cuisine Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{recipe.cuisine}</Badge>
              {recipe.dietary.map(diet => (
                <Badge key={diet} variant="outline">{diet}</Badge>
              ))}
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent fill-accent" />
                <span className="font-semibold">{recipe.rating}</span>
                <span className="text-muted-foreground">({recipe.ratingCount} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Your rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star}
                    className={`h-5 w-5 cursor-pointer transition-colors ${
                      star <= userRating 
                        ? 'text-accent fill-accent' 
                        : 'text-muted-foreground hover:text-accent'
                    }`}
                    onClick={() => onRate(star)}
                  />
                ))}
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium">Calories</p>
                </div>
                <p className="text-lg font-bold text-primary">{recipe.nutrition.calories}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Protein</p>
                <p className="text-lg font-bold text-secondary">{recipe.nutrition.protein}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                <p className="text-lg font-bold">{recipe.nutrition.carbs}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Fat</p>
                <p className="text-lg font-bold">{recipe.nutrition.fat}g</p>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-bold mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-bold mb-3">Instructions</h3>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </span>
                    <p className="pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
