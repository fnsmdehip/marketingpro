import { createContext, ReactNode, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AIProviderStatus = {
  name: string;
  status: string;
  usage: {
    hourly: number;
    daily: number;
    percentage: number;
  };
};

type TextGenerationParams = {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

type ImageGenerationParams = {
  prompt: string;
  model?: string;
  size?: string;
  quality?: string;
  style?: string;
};

type SpeechGenerationParams = {
  text: string;
  voice?: string;
  speed?: number;
};

type VideoGenerationParams = {
  prompt: string;
  model?: string;
  duration?: number;
  style?: string;
};

type GenerationResponse = {
  success: boolean;
  result?: string | string[];
  error?: string;
  provider: string;
};

type AIContextType = {
  providers: AIProviderStatus[];
  isLoadingProviders: boolean;
  generateText: (params: TextGenerationParams) => Promise<GenerationResponse>;
  generateImage: (params: ImageGenerationParams) => Promise<GenerationResponse>;
  generateSpeech: (params: SpeechGenerationParams) => Promise<GenerationResponse>;
  generateVideo: (params: VideoGenerationParams) => Promise<GenerationResponse>;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  isGeneratingSpeech: boolean;
  isGeneratingVideo: boolean;
};

export const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Query for providers status
  const { data: providers = [], isLoading: isLoadingProviders } = useQuery<AIProviderStatus[]>({
    queryKey: ['/api/ai/providers'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Text generation mutation
  const textMutation = useMutation({
    mutationFn: async (params: TextGenerationParams): Promise<GenerationResponse> => {
      const res = await apiRequest("POST", "/api/ai/generate/text", params);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Text generation failed",
        description: error.message,
        variant: "destructive"
      });
      return {
        success: false,
        error: error.message,
        provider: "none"
      };
    }
  });
  
  // Image generation mutation
  const imageMutation = useMutation({
    mutationFn: async (params: ImageGenerationParams): Promise<GenerationResponse> => {
      const res = await apiRequest("POST", "/api/ai/generate/image", params);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Image generation failed",
        description: error.message,
        variant: "destructive"
      });
      return {
        success: false,
        error: error.message,
        provider: "none"
      };
    }
  });
  
  // Speech generation mutation
  const speechMutation = useMutation({
    mutationFn: async (params: SpeechGenerationParams): Promise<GenerationResponse> => {
      const res = await apiRequest("POST", "/api/ai/generate/speech", params);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Speech generation failed",
        description: error.message,
        variant: "destructive"
      });
      return {
        success: false,
        error: error.message,
        provider: "none"
      };
    }
  });
  
  // Video generation mutation
  const videoMutation = useMutation({
    mutationFn: async (params: VideoGenerationParams): Promise<GenerationResponse> => {
      const res = await apiRequest("POST", "/api/ai/generate/video", params);
      return await res.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Video generation failed",
        description: error.message,
        variant: "destructive"
      });
      return {
        success: false,
        error: error.message,
        provider: "none"
      };
    }
  });
  
  // Wrapper functions to handle errors and provide feedback
  const generateText = async (params: TextGenerationParams): Promise<GenerationResponse> => {
    try {
      const result = await textMutation.mutateAsync(params);
      
      if (!result.success) {
        toast({
          title: "Text generation issue",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "none"
      };
    }
  };
  
  const generateImage = async (params: ImageGenerationParams): Promise<GenerationResponse> => {
    try {
      const result = await imageMutation.mutateAsync(params);
      
      if (!result.success) {
        toast({
          title: "Image generation issue",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "none"
      };
    }
  };
  
  const generateSpeech = async (params: SpeechGenerationParams): Promise<GenerationResponse> => {
    try {
      const result = await speechMutation.mutateAsync(params);
      
      if (!result.success) {
        toast({
          title: "Speech generation issue",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "none"
      };
    }
  };
  
  const generateVideo = async (params: VideoGenerationParams): Promise<GenerationResponse> => {
    try {
      const result = await videoMutation.mutateAsync(params);
      
      if (!result.success) {
        toast({
          title: "Video generation issue",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        provider: "none"
      };
    }
  };
  
  return (
    <AIContext.Provider
      value={{
        providers,
        isLoadingProviders,
        generateText,
        generateImage,
        generateSpeech,
        generateVideo,
        isGeneratingText: textMutation.isPending,
        isGeneratingImage: imageMutation.isPending,
        isGeneratingSpeech: speechMutation.isPending,
        isGeneratingVideo: videoMutation.isPending
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAIProviders() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIProviders must be used within an AIProvider");
  }
  return context;
}
