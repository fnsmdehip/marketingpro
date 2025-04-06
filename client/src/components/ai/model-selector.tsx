import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Sliders } from "lucide-react";

type ModelSelectorProps = {
  modelType: "text" | "image" | "speech" | "video";
  selectedModel: string;
  onSelectModel: (model: string) => void;
  temperature?: number;
  onTemperatureChange?: (temperature: number) => void;
  disabled?: boolean;
};

export function ModelSelector({
  modelType,
  selectedModel,
  onSelectModel,
  temperature,
  onTemperatureChange,
  disabled = false,
}: ModelSelectorProps) {
  const { data: providers = [] } = useQuery({
    queryKey: ["/api/ai/providers"],
  });

  // Get available models for the selected type
  const getAvailableModels = () => {
    const availableModels: { name: string; provider: string }[] = [];

    providers.forEach((provider: any) => {
      if (provider.status === "active" && provider.capabilities.includes(modelType)) {
        if (modelType === "text" && provider.textModels) {
          provider.textModels.forEach((model: string) => {
            availableModels.push({ name: model, provider: provider.name });
          });
        } else if (modelType === "image" && provider.imageModels) {
          provider.imageModels.forEach((model: string) => {
            availableModels.push({ name: model, provider: provider.name });
          });
        } else if (modelType === "speech" && provider.speechModels) {
          provider.speechModels.forEach((model: string) => {
            availableModels.push({ name: model, provider: provider.name });
          });
        } else if (modelType === "video" && provider.videoModels) {
          provider.videoModels.forEach((model: string) => {
            availableModels.push({ name: model, provider: provider.name });
          });
        }
      }
    });

    return availableModels;
  };

  const availableModels = getAvailableModels();

  // Default models if none are returned from the API
  const defaultModels = {
    text: [
      { name: "gemini-2.5-pro", provider: "Google" },
      { name: "gpt-4o", provider: "OpenAI" },
      { name: "deepseek/deepseek-v3-base:free", provider: "DeepSeek" },
    ],
    image: [
      { name: "stable-diffusion-xl", provider: "Stability AI" },
      { name: "dall-e-3", provider: "OpenAI" },
    ],
    speech: [
      { name: "xtts-v2", provider: "Hugging Face" },
      { name: "whisper-1", provider: "OpenAI" },
    ],
    video: [
      { name: "damo-text-to-video", provider: "ModelScope" },
      { name: "gen-2", provider: "Runway" },
    ],
  };

  const models = availableModels.length > 0 
    ? availableModels 
    : defaultModels[modelType as keyof typeof defaultModels];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Sliders className="mr-2 h-4 w-4" />
          Model Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="model-selector">AI Model</Label>
          <Select
            id="model-selector"
            value={selectedModel}
            onValueChange={onSelectModel}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.name} value={model.name}>
                  {model.name} ({model.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {modelType === "text" && onTemperatureChange && temperature !== undefined && (
          <div>
            <div className="flex justify-between items-center">
              <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={([newTemperature]) => onTemperatureChange(newTemperature)}
              disabled={disabled}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}