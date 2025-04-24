
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PRESETS, normalizeWeights } from '@/config/recommendationPresets';
import { RecommendationWeights } from '@/types/recipes';

interface PresetWeightsSectionProps {
  onWeightsChange: (weights: RecommendationWeights, preset: string) => void;
  initialPreset?: string;
}

export const PresetWeightsSection = ({ onWeightsChange, initialPreset = 'Healthy' }: PresetWeightsSectionProps) => {
  const [selectedPreset, setSelectedPreset] = React.useState(initialPreset);
  const [weights, setWeights] = React.useState(PRESETS[initialPreset]);

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    setWeights(PRESETS[preset]);
    onWeightsChange(PRESETS[preset], preset);
  };

  const handleSliderChange = (key: keyof RecommendationWeights, value: number) => {
    const newWeights = { ...weights, [key]: value / 100 };
    const normalized = normalizeWeights(newWeights);
    setWeights(normalized);
    onWeightsChange(normalized, selectedPreset);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Recommendation Preset</h3>
        <RadioGroup 
          defaultValue={selectedPreset} 
          onValueChange={handlePresetChange}
          className="space-y-2"
        >
          {Object.keys(PRESETS).map((preset) => (
            <div key={preset} className="flex items-center space-x-2">
              <RadioGroupItem value={preset} id={preset} />
              <Label htmlFor={preset}>{preset.replace(/([A-Z])/g, ' $1').trim()}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Fine-tune Weights</h3>
        {['nutritionalFit', 'pantryMatch', 'costScore'].map((key) => (
          <div key={key} className="space-y-2">
            <Label>
              {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
              {Math.round(weights[key as keyof RecommendationWeights] * 100)}%
            </Label>
            <Slider
              value={[weights[key as keyof RecommendationWeights] * 100]}
              onValueChange={(vals) => handleSliderChange(key as keyof RecommendationWeights, vals[0])}
              max={100}
              step={1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
