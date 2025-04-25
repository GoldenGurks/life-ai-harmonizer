
import { RecommendationWeights } from '@/types/recipes';

export const PRESETS: Record<string, RecommendationWeights> = {
  Healthy: {
    nutritionalFit: 0.4,
    similarityToLikes: 0.2,
    varietyBoost: 0.1,
    pantryMatch: 0.1,
    costScore: 0.1,
    recencyPenalty: 0.1
  },
  WeightLoss: {
    nutritionalFit: 0.6,
    similarityToLikes: 0.1,
    varietyBoost: 0.1,
    pantryMatch: 0.1,
    costScore: 0.05,
    recencyPenalty: 0.05
  },
  MuscleGain: {
    nutritionalFit: 0.5,
    similarityToLikes: 0.1,
    varietyBoost: 0.1,
    pantryMatch: 0.1,
    costScore: 0.05,
    recencyPenalty: 0.15
  }
};

// Default for new users or when no other preset is set
export const DEFAULT_RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  nutritionalFit: 0.4,
  similarityToLikes: 0.2,
  varietyBoost: 0.1,
  pantryMatch: 0.1,
  costScore: 0.1,
  recencyPenalty: 0.1
};

export const normalizeWeights = (raw: Partial<RecommendationWeights>): RecommendationWeights => {
  const values = Object.values(raw).filter(value => typeof value === 'number') as number[];
  const total = values.reduce((a, b) => a + b, 0);
  
  return {
    nutritionalFit: (raw.nutritionalFit || 0) / total,
    similarityToLikes: (raw.similarityToLikes || 0) / total,
    varietyBoost: (raw.varietyBoost || 0) / total,
    pantryMatch: (raw.pantryMatch || 0) / total,
    costScore: (raw.costScore || 0) / total,
    recencyPenalty: (raw.recencyPenalty || 0) / total
  };
};
