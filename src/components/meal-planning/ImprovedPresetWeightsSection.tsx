import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PRESETS, normalizeWeights } from '@/config/recommendationPresets';
import { RecommendationWeights } from '@/types/recipes';
import { useLanguage } from '@/hooks/useLanguage';
import { HelpCircle, Heart, DollarSign, Utensils } from 'lucide-react';

interface ImprovedPresetWeightsSectionProps {
  onWeightsChange: (weights: RecommendationWeights, preset: string) => void;
  initialPreset?: string;
}

/**
 * Improved preset weights section with Simple/Advanced mode toggle
 * Addresses the confusing slider UX with clearer explanations and preset-based approach
 */
export const ImprovedPresetWeightsSection = ({ 
  onWeightsChange, 
  initialPreset = 'Healthy' 
}: ImprovedPresetWeightsSectionProps) => {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  const [weights, setWeights] = useState(PRESETS[initialPreset]);
  const [isAdvanced, setIsAdvanced] = useState(false);

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

  const handleReset = () => {
    const defaultWeights = PRESETS[selectedPreset];
    setWeights(defaultWeights);
    onWeightsChange(defaultWeights, selectedPreset);
  };

  const presetDescriptions = {
    Healthy: "Prioritizes nutritional balance and wholesome ingredients",
    WeightLoss: "Focuses on lower-calorie, high-satiety meals",
    MuscleGain: "Emphasizes protein content and calorie density"
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{t('mealPlanning.presetsWeights')}</h3>
          <div className="flex items-center space-x-2">
            <Label htmlFor="advanced-mode" className="text-sm">
              {t('mealPlanning.simple')}
            </Label>
            <Switch
              id="advanced-mode"
              checked={isAdvanced}
              onCheckedChange={setIsAdvanced}
            />
            <Label htmlFor="advanced-mode" className="text-sm">
              {t('mealPlanning.advanced')}
            </Label>
          </div>
        </div>

        {/* Simple Mode - Preset Selection Only */}
        {!isAdvanced && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.keys(PRESETS).map((preset) => (
                <Card 
                  key={preset}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPreset === preset 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handlePresetChange(preset)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      {preset === 'Healthy' && <Heart className="h-6 w-6 text-green-600" />}
                      {preset === 'WeightLoss' && <DollarSign className="h-6 w-6 text-blue-600" />}
                      {preset === 'MuscleGain' && <Utensils className="h-6 w-6 text-orange-600" />}
                    </div>
                    <h4 className="font-medium text-sm mb-1">
                      {preset.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {presetDescriptions[preset as keyof typeof presetDescriptions]}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Mode - Sliders with Tooltips */}
        {isAdvanced && (
          <div className="space-y-6">
            {/* Preset selection in advanced mode */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Base Preset</Label>
              <div className="flex gap-2">
                {Object.keys(PRESETS).map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={selectedPreset === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePresetChange(preset)}
                  >
                    {preset.replace(/([A-Z])/g, ' $1').trim()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Fine-tuning sliders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Fine-tune Weights</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  {t('mealPlanning.resetDefaults')}
                </Button>
              </div>
              
              {[
                { key: 'nutritionalFit', icon: Heart, color: 'text-green-600' },
                { key: 'pantryMatch', icon: Utensils, color: 'text-blue-600' },
                { key: 'costScore', icon: DollarSign, color: 'text-orange-600' }
              ].map(({ key, icon: Icon, color }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <Label className="flex items-center gap-1">
                      {t(`mealPlanning.${key}`)}
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-48 text-xs">
                            {t(`mealPlanning.${key}Tooltip`)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {Math.round(weights[key as keyof RecommendationWeights] * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[weights[key as keyof RecommendationWeights] * 100]}
                    onValueChange={(vals) => handleSliderChange(key as keyof RecommendationWeights, vals[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};