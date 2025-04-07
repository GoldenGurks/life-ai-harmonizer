
export interface MealItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  tags: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  day: string;
  meals: MealItem[];
}
