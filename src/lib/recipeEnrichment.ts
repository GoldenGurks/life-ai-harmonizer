
import { Recipe } from '@/types/recipes';

// Compute a fallback score from macros
function computeFromMacros(calories: number, protein: number, fiber: number): number {
  // normalize fiber proportion, calorie range, protein ratio
  const fiberScore = fiber / 30;
  const calorieScore = 1 - Math.min(1, calories / 1000);
  const proteinScore = Math.min(1, protein / 50);
  return Math.max(0, (fiberScore + calorieScore + proteinScore) / 3);
}

// Ensure every recipe has a nutrientScore (derive if missing)
export function ensureNutrientScore(recipes: Recipe[]): Recipe[] {
  return recipes.map(r => {
    if (r.nutrientScore == null) {
      return { ...r, nutrientScore: computeFromMacros(r.calories, r.protein, r.fiber ?? 0) };
    }
    return r;
  });
}

// Throw if any still missing nutrientScore
export function validateRecipes(recipes: Recipe[]): void {
  const bad = recipes.filter(r => r.nutrientScore == null);
  if (bad.length) {
    throw new Error(`${bad.length} recipes missing nutrientScore`);
  }
}
