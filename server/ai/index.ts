import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { OpenRouterProvider } from "./openrouter";
import { HuggingFaceProvider } from "./huggingface";
import { ReplicateProvider } from "./replicate";
import { GoogleColabProvider } from "./googlecolab";
import { GeminiProvider } from "./gemini";
import { storage } from "../storage";
import { AiProvider } from "@shared/schema";

// Factory function to create provider instances
function createProvider(providerData: AiProvider): AIProvider | null {
  try {
    if (providerData.endpoint.startsWith('openrouter/')) {
      return new OpenRouterProvider(providerData);
    } else if (providerData.endpoint.startsWith('huggingface/')) {
      return new HuggingFaceProvider(providerData);
    } else if (providerData.endpoint.startsWith('replicate/')) {
      return new ReplicateProvider(providerData);
    } else if (providerData.endpoint.startsWith('googlecolab/')) {
      return new GoogleColabProvider(providerData);
    } else if (providerData.endpoint.startsWith('gemini/')) {
      return new GeminiProvider(providerData);
    }
    return null;
  } catch (error) {
    console.error(`Error creating provider for ${providerData.name}:`, error);
    return null;
  }
}

// AI manager class for handling provider selection and fallback
export class AIManager {
  private providers: Map<string, AIProvider>;
  private initialized: boolean = false;
  
  constructor() {
    this.providers = new Map();
  }
  
  // Initialize by loading all active providers
  async initialize(): Promise<void> {
    try {
      const providerData = await storage.getActiveAiProviders();
      
      for (const provider of providerData) {
        const instance = createProvider(provider);
        if (instance) {
          this.providers.set(provider.name, instance);
        }
      }
      
      this.initialized = true;
      console.log(`AI Manager initialized with ${this.providers.size} providers`);
    } catch (error) {
      console.error('Error initializing AI Manager:', error);
      throw error;
    }
  }
  
  // Make sure we're initialized before any operations
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
  
  // Select the best available provider for a given operation
  private async selectProvider(requestType: string, preferredProvider?: string): Promise<AIProvider | null> {
    await this.ensureInitialized();
    
    // If a preferred provider is specified and available, use it
    if (preferredProvider) {
      const provider = this.providers.get(preferredProvider);
      if (provider && provider.isAvailable()) {
        return provider;
      }
    }
    
    // Find available providers
    const availableProviders: AIProvider[] = [];
    for (const provider of this.providers.values()) {
      if (provider.isAvailable()) {
        availableProviders.push(provider);
      }
    }
    
    if (availableProviders.length === 0) {
      return null; // No available providers
    }
    
    // Choose provider with lowest usage percentage
    return availableProviders.reduce((best, current) => {
      return current.usage.percentage < best.usage.percentage ? current : best;
    }, availableProviders[0]);
  }
  
  // Text generation with automatic provider selection and fallback
  async generateText(params: ProviderRequestParams): Promise<ProviderResponse> {
    await this.ensureInitialized();
    
    // Try preferred provider first
    const provider = await this.selectProvider('textGeneration', params.model);
    
    if (!provider) {
      return {
        success: false,
        error: "No available AI providers for text generation",
        provider: "none"
      };
    }
    
    try {
      const result = await provider.textGeneration(params);
      
      // If the preferred provider fails, try another one
      if (!result.success && params.model) {
        const fallbackProvider = await this.selectProvider('textGeneration');
        if (fallbackProvider && fallbackProvider.name !== provider.name) {
          console.log(`Falling back to ${fallbackProvider.name} for text generation`);
          return await fallbackProvider.textGeneration({
            ...params,
            model: undefined // Don't use the specific model in fallback
          });
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Error in text generation: ${error instanceof Error ? error.message : String(error)}`,
        provider: provider.name
      };
    }
  }
  
  // Image generation with automatic provider selection and fallback
  async generateImage(params: ProviderImageParams): Promise<ProviderResponse> {
    await this.ensureInitialized();
    
    // Try preferred provider first
    const provider = await this.selectProvider('imageGeneration', params.model);
    
    if (!provider) {
      return {
        success: false,
        error: "No available AI providers for image generation",
        provider: "none"
      };
    }
    
    try {
      const result = await provider.imageGeneration(params);
      
      // If the preferred provider fails, try another one
      if (!result.success && params.model) {
        const fallbackProvider = await this.selectProvider('imageGeneration');
        if (fallbackProvider && fallbackProvider.name !== provider.name) {
          console.log(`Falling back to ${fallbackProvider.name} for image generation`);
          return await fallbackProvider.imageGeneration({
            ...params,
            model: undefined // Don't use the specific model in fallback
          });
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Error in image generation: ${error instanceof Error ? error.message : String(error)}`,
        provider: provider.name
      };
    }
  }
  
  // Text-to-speech with automatic provider selection and fallback
  async generateSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    await this.ensureInitialized();
    
    // Try preferred provider first (prioritize Hugging Face or Replicate for TTS)
    const preferredProvider = this.providers.get('Hugging Face') || this.providers.get('Replicate');
    
    const provider = preferredProvider && preferredProvider.isAvailable()
      ? preferredProvider
      : await this.selectProvider('textToSpeech');
    
    if (!provider) {
      return {
        success: false,
        error: "No available AI providers for text-to-speech",
        provider: "none"
      };
    }
    
    try {
      const result = await provider.textToSpeech(params);
      
      // If the initial provider fails, try another one
      if (!result.success) {
        for (const p of this.providers.values()) {
          if (p.name !== provider.name && p.isAvailable()) {
            console.log(`Falling back to ${p.name} for text-to-speech`);
            const fallbackResult = await p.textToSpeech(params);
            if (fallbackResult.success) {
              return fallbackResult;
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Error in text-to-speech: ${error instanceof Error ? error.message : String(error)}`,
        provider: provider.name
      };
    }
  }
  
  // Video generation with automatic provider selection and fallback
  async generateVideo(params: ProviderVideoParams): Promise<ProviderResponse> {
    await this.ensureInitialized();
    
    // Try preferred provider first (prioritize Replicate for video)
    const preferredProvider = this.providers.get('Replicate');
    
    const provider = preferredProvider && preferredProvider.isAvailable()
      ? preferredProvider
      : await this.selectProvider('videoGeneration');
    
    if (!provider) {
      return {
        success: false,
        error: "No available AI providers for video generation",
        provider: "none"
      };
    }
    
    try {
      const result = await provider.videoGeneration(params);
      
      // If the initial provider fails, try another one
      if (!result.success) {
        for (const p of this.providers.values()) {
          if (p.name !== provider.name && p.isAvailable()) {
            console.log(`Falling back to ${p.name} for video generation`);
            const fallbackResult = await p.videoGeneration(params);
            if (fallbackResult.success) {
              return fallbackResult;
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Error in video generation: ${error instanceof Error ? error.message : String(error)}`,
        provider: provider.name
      };
    }
  }
  
  // Get status of all providers
  async getProvidersStatus(): Promise<any[]> {
    await this.ensureInitialized();
    
    const result = [];
    for (const provider of this.providers.values()) {
      result.push({
        name: provider.name,
        status: provider.status,
        usage: provider.usage
      });
    }
    
    return result;
  }
}

// Export a singleton instance
export const aiManager = new AIManager();
