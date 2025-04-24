import { useState, useEffect, useMemo } from 'react';
import { Recipe, ScoringPreferences } from '@/types/recipes';
import { useUserProfileContext } from '@/context/UserProfileContext';
import { recommendationService } from '@/services/recommendationService';

interface UseRecipeRecommendationsProps {
  recipes: Recipe[];
  count: number;
  mealType?: string;
}

export const useRecipeRecommendations = ({ recipes, count, mealType }: UseRecipeRecommendationsProps) => {
  const { profile } = useUserProfileContext();
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }
  }, []);

  useEffect(() => {
    if (recommendations.length > 0) {
      // Update local storage with new recommendations
      localStorage.setItem('recipeRecommendations', JSON.stringify(recommendations));
    }
  }, [recommendations]);

  useEffect(() => {
    if (recipes.length === 0) return;

    // Create scoring preferences from user profile
    const scoringPrefs: ScoringPreferences = useMemo(() => {
      if (!profile) {
        return {
          likedMeals: [],
          pantry: [],
          recommendationPreset: 'Healthy' // Add default preset
        };
      }

      return {
        likedMeals: profile.likedMeals,
        pantry: profile.pantry,
        fitnessGoal: profile.fitnessGoal,
        likedFoods: profile.likedFoods,
        dislikedFoods: profile.dislikedFoods,
        recentlyViewed: recentlyViewed || [],
        calorieTarget: profile.calorieTarget,
        proteinTarget: profile.proteinTarget,
        carbTarget: profile.carbTarget,
        fatTarget: profile.fatTarget,
        recommendationPreset: profile.recommendationPreset || 'Healthy', // Add preset with fallback
        recommendationWeights: profile.recommendationWeights
      };
    }, [profile, recentlyViewed]);

    // Generate recommendations
    const generateRecommendations = async () => {
      const recommended = recommendationService.getDiversifiedRecommendations(
        scoringPrefs,
        recipes,
        count,
        mealType
      );
      setRecommendations(recommended);
    };

    generateRecommendations();
  }, [recipes, count, mealType, profile, recentlyViewed]);

  const markAsViewed = (recipeId: string) => {
    // Update recently viewed in local storage
    const updatedViewed = [recipeId, ...recentlyViewed.filter(id => id !== recipeId)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    setRecentlyViewed(updatedViewed);
  };

  return { recommendations, markAsViewed };
};
