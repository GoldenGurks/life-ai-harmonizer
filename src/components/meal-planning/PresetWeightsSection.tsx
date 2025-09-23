
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { PRESETS, normalizeWeights } from '@/config/recommendationPresets';
import { RecommendationWeights } from '@/types/recipes';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserProfile } from '@/hooks/useUserProfile';

interface PresetWeightsSectionProps {
  onWeightsChange: (weights: RecommendationWeights, preset: string) => void;
  initialPreset?: string;
}

export const PresetWeightsSection = ({ onWeightsChange, initialPreset = 'Healthy' }: PresetWeightsSectionProps) => {
  const { t } = useLanguage();
  const { profile } = useUserProfile();
  
  // Inherit user's previously selected goal if available
  const getUserGoalPreset = () => {
    if (profile?.fitnessGoal) {
      switch (profile.fitnessGoal) {
        case 'weightLoss': return 'WeightLoss';
        case 'muscleGain': return 'MuscleGain';
        case 'maintenance': return 'Healthy';
        default: return initialPreset;
      }
    }
    return initialPreset;
  };
  
  const inheritedPreset = getUserGoalPreset();
  const [selectedPreset, setSelectedPreset] = React.useState(inheritedPreset);
  const [weights, setWeights] = React.useState(PRESETS[inheritedPreset]);

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
  
  const resetToDefaults = () => {
    setWeights(PRESETS[selectedPreset]);
    onWeightsChange(PRESETS[selectedPreset], selectedPreset);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{t('mealPlanning.presetsWeights')}</h3>
          <RadioGroup 
            value={selectedPreset} 
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
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Empfehlungsgewichte anpassen</h3>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              {t('mealPlanning.resetDefaults')}
            </Button>
          </div>
          
          {['nutritionalFit', 'pantryMatch', 'costScore'].map((key) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="flex-1">
                  {t(`mealPlanning.${key}`)}:{' '}
                  {Math.round(weights[key as keyof RecommendationWeights] * 100)}%
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t(`mealPlanning.${key}Tooltip`)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
    </TooltipProvider>
  );
};
