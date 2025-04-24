
import { describe, it, expect } from 'vitest';
import { PRESETS, normalizeWeights } from '@/config/recommendationPresets';
import { RecommendationWeights } from '@/types/recipes';

describe('Recommendation Presets', () => {
  it('normalized weights should sum to 1', () => {
    Object.values(PRESETS).forEach(preset => {
      const sum = Object.values(preset).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1, 5);
    });
  });

  it('should normalize custom weights correctly', () => {
    const raw: Partial<RecommendationWeights> = {
      nutritionalFit: 80,
      similarityToLikes: 40,
      varietyBoost: 30,
      pantryMatch: 20,
      costScore: 20,
      recencyPenalty: 10
    };

    const normalized = normalizeWeights(raw);
    const sum = Object.values(normalized).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});
