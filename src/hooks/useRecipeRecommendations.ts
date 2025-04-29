import { useState, useEffect, useMemo } from 'react';
import { Recipe, ScoringPreferences } from '@/types/recipes';
import { useUserProfileContext } from '@/context/UserProfileContext';
import { recommendationService } from '@/services/recommendationService';
import { DEFAULT_RECOMMENDATION_WEIGHTS } from '@/config/recommendationPresets';

interface UseRecipeRecommendationsProps {
  recipes?: Recipe[];
  count?: number;
  mealType?: string;
  authorStyle?: string;
}

export const useRecipeRecommendations = (props?: UseRecipeRecommendationsProps) => {
  const { recipes = [], count = 5, mealType, authorStyle } = props || {};
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

  const scoringPrefs = useMemo(() => {
    if (!profile) {
      return {
        likedMeals: [],
        pantry: [],
        recommendationPreset: 'Healthy' as 'Healthy' | 'WeightLoss' | 'MuscleGain',
        recommendationWeights: DEFAULT_RECOMMENDATION_WEIGHTS,
        ...(authorStyle ? { authorStyle } : {})
      } as ScoringPreferences;
    }

    return {
      likedMeals: profile.likedMeals || [],
      pantry: profile.pantry || [],
      fitnessGoal: profile.fitnessGoal,
      likedFoods: profile.likedFoods || [],
      dislikedFoods: profile.dislikedFoods || [],
      recentlyViewed: recentlyViewed || [],
      calorieTarget: profile.calorieTarget,
      proteinTarget: profile.proteinTarget,
      carbTarget: profile.carbTarget,
      fatTarget: profile.fatTarget,
      recommendationPreset: (profile.recommendationPreset || 'Healthy') as 'Healthy' | 'WeightLoss' | 'MuscleGain',
      recommendationWeights: profile.recommendationWeights || DEFAULT_RECOMMENDATION_WEIGHTS,
      authorStyle: authorStyle || profile.authorStyle
    } as ScoringPreferences;
  }, [profile, recentlyViewed, authorStyle]);

  useEffect(() => {
    if (recipes.length === 0) return;

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
  }, [recipes, count, mealType, profile, recentlyViewed, scoringPrefs]);

  const markAsViewed = (recipeId: string) => {
    // Update recently viewed in local storage
    const updatedViewed = [recipeId, ...recentlyViewed.filter(id => id !== recipeId)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
    setRecentlyViewed(updatedViewed);
  };

  // Method to get top N recommendations
  const getTopN = (n: number): Recipe[] => {
    return recommendations.slice(0, n);
  };

  return { 
    recommendations,
    markAsViewed,
    getTopN
  };
};
