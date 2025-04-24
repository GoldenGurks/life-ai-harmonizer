
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

export const normalizeWeights = (raw: Partial<RecommendationWeights>): RecommendationWeights => {
  const total = Object.values(raw).reduce((a, b) => a + b, 0);
  const normalized = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v / total])
  );
  
  return normalized as RecommendationWeights;
};
