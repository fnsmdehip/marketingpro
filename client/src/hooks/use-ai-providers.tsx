import { createContext, ReactNode, useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Provider types
export type AIProvider = {
  id: number;
  name: string;
  endpoint: string;
  status: 'active' | 'inactive';
  usageCount: number;
  hourlyLimit: number;
  dailyLimit: number;
  lastUsed: string;
};

// Request and response types for AI generation
export type ImageGenerationRequest = {
  prompt: string;
  model?: string;
  size?: string;
  style?: string;
  n?: number;
  userId?: number;
};

export type VideoGenerationRequest = {
  prompt: string;
  model?: string;
  duration?: string;
  style?: string;
  userId?: number;
};

export type SpeechGenerationRequest = {
  text: string;
  model?: string;
  voice?: string;
  userId?: number;
};

export type GenerationResponse = {
  url: string;
  provider: string;
  model: string;
  created: string;
};

// The main context type
type AIContextType = {
  // Provider management
  providers: AIProvider[];
  isLoading: boolean;
  error: Error | null;
  
  // Image generation
  generateImage: (request: ImageGenerationRequest) => Promise<string>;
  isGeneratingImage: boolean;
  imageError: Error | null;
  
  // Video generation
  generateVideo: (request: VideoGenerationRequest) => Promise<string>;
  isGeneratingVideo: boolean;
  videoError: Error | null;
  
  // Speech generation
  generateSpeech: (request: SpeechGenerationRequest) => Promise<string>;
  isGeneratingSpeech: boolean;
  speechError: Error | null;
};

export const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Get AI providers
  const { 
    data: providers = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["/api/ai/providers"],
  });
  
  // Image generation mutation
  const { 
    mutateAsync: generateImageMutation,
    isPending: isGeneratingImage,
    error: imageError
  } = useMutation({
    mutationFn: async (request: ImageGenerationRequest) => {
      const response = await apiRequest("POST", "/api/ai/generate/image", request);
      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Image generation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Video generation mutation
  const { 
    mutateAsync: generateVideoMutation,
    isPending: isGeneratingVideo,
    error: videoError
  } = useMutation({
    mutationFn: async (request: VideoGenerationRequest) => {
      const response = await apiRequest("POST", "/api/ai/generate/video", request);
      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Video generation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Speech generation mutation
  const { 
    mutateAsync: generateSpeechMutation,
    isPending: isGeneratingSpeech,
    error: speechError
  } = useMutation({
    mutationFn: async (request: SpeechGenerationRequest) => {
      const response = await apiRequest("POST", "/api/ai/generate/speech", request);
      return response.json();
    },
    onError: (error: Error) => {
      toast({
        title: "Speech generation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Wrapper functions for mutations with improved error handling
  const generateImage = async (request: ImageGenerationRequest): Promise<string> => {
    try {
      const result = await generateImageMutation(request);
      return result.url;
    } catch (error) {
      console.error("Image generation error:", error);
      throw error;
    }
  };
  
  const generateVideo = async (request: VideoGenerationRequest): Promise<string> => {
    try {
      const result = await generateVideoMutation(request);
      return result.url;
    } catch (error) {
      console.error("Video generation error:", error);
      throw error;
    }
  };
  
  const generateSpeech = async (request: SpeechGenerationRequest): Promise<string> => {
    try {
      const result = await generateSpeechMutation(request);
      return result.url;
    } catch (error) {
      console.error("Speech generation error:", error);
      throw error;
    }
  };

  return (
    <AIContext.Provider
      value={{
        providers: providers as AIProvider[],
        isLoading,
        error: error as Error | null,
        generateImage,
        isGeneratingImage,
        imageError: imageError as Error | null,
        generateVideo,
        isGeneratingVideo,
        videoError: videoError as Error | null,
        generateSpeech,
        isGeneratingSpeech,
        speechError: speechError as Error | null,
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