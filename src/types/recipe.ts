export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  cookingTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dietary: string[]; // e.g., 'vegetarian', 'vegan', 'gluten-free'
  cuisine: string;
  rating: number;
  ratingCount: number;
}

export interface DietaryPreference {
  id: string;
  label: string;
  icon: string;
}
