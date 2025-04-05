import { useState } from "react";
import { useAIProviders } from "@/hooks/use-ai-providers";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ModelSelectorProps {
  modelType: "text" | "image" | "speech" | "video";
  selectedModel: string;
  onSelectModel: (model: string) => void;
  temperature?: number;
  onTemperatureChange?: (value: number) => void;
  disabled?: boolean;
}

export function ModelSelector({
  modelType,
  selectedModel,
  onSelectModel,
  temperature = 0.7,
  onTemperatureChange,
  disabled = false
}: ModelSelectorProps) {
  const { providers, isLoading: isLoadingProviders } = useAIProviders();
  const [showTemperature, setShowTemperature] = useState(false);
  
  // Models for each type
  const modelOptions = {
    text: [
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Gemini 2.5 Pro" },
      { id: "deepseek-coder-v3", name: "DeepSeek v3", provider: "DeepSeek v3" },
      { id: "mistral-7b", name: "Mistral 7B (Hugging Face)", provider: "Hugging Face" },
      { id: "llama-3-8b-instruct", name: "Llama 3 8B (Replicate)", provider: "Replicate" },
    ],
    image: [
      { id: "stable-diffusion-xl", name: "Stable Diffusion XL", provider: "Hugging Face" },
      { id: "sdxl", name: "SDXL (Replicate)", provider: "Replicate" },
      { id: "openjourney", name: "OpenJourney", provider: "Hugging Face" },
    ],
    speech: [
      { id: "xtts-v2", name: "XTTS v2", provider: "Hugging Face" },
      { id: "bark", name: "Bark (Replicate)", provider: "Replicate" },
    ],
    video: [
      { id: "damo-text-to-video", name: "DAMO Text-to-Video", provider: "Replicate" },
      { id: "text-to-video-ms", name: "Text-to-Video MS", provider: "Hugging Face" },
    ]
  };
  
  // Filter available models based on active providers
  const getAvailableModels = () => {
    if (isLoadingProviders || providers.length === 0) {
      return modelOptions[modelType];
    }
    
    // Get active provider names
    const activeProviders = providers
      .filter(p => p.status === 'active' && p.usage.percentage < 95)
      .map(p => p.name);
    
    // Filter models by active providers
    return modelOptions[modelType].filter(model => 
      activeProviders.includes(model.provider)
    );
  };
  
  const availableModels = getAvailableModels();
  
  // Handle model selection
  const handleModelChange = (value: string) => {
    onSelectModel(value);
    
    // Show temperature slider for text models
    setShowTemperature(modelType === 'text');
  };
  
  // Handle temperature change
  const handleTemperatureChange = (value: number[]) => {
    if (onTemperatureChange) {
      onTemperatureChange(value[0]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select AI Model</CardTitle>
        <CardDescription>
          Choose the best model for your {modelType} generation needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingProviders ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model-select">Model</Label>
              <Select 
                value={selectedModel} 
                onValueChange={handleModelChange}
                disabled={disabled}
              >
                <SelectTrigger id="model-select">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {showTemperature && onTemperatureChange && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature-slider">Temperature: {temperature}</Label>
                </div>
                <Slider
                  id="temperature-slider"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={handleTemperatureChange}
                  disabled={disabled}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {modelType === 'text' ? 
          'Higher temperature values produce more creative but less predictable results.' :
          'Different models may produce varying styles and qualities.'}
      </CardFooter>
    </Card>
  );
}

export default ModelSelector;
