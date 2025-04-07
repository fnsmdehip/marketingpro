import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { GeminiProvider } from "./gemini";
import { DeepSeekProvider } from "./deepseek";
import { AnthropicProvider } from "./anthropic";
import { storage } from "../storage";

// Result interface for text generation
export interface TextGenerationResult {
  success: boolean;
  data?: string;
  error?: {
    message: string;
    code?: string;
  };
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Interface for image generation parameters
export interface ImageGenerationParams {
  prompt: string;
  userId?: number;
  model?: string;
  size?: string;
  style?: string;
}

// Interface for text-to-speech parameters
export interface TTSParams {
  text: string;
  userId?: number;
  voice?: string;
  speed?: number;
}

// Interface for video generation parameters
export interface VideoGenerationParams {
  prompt: string;
  userId?: number;
  duration?: number;
  style?: string;
}

/**
 * AIManager class that handles routing requests to appropriate AI providers
 * with intelligent fallback logic for handling rate limits and errors
 */
export class AIManager {
  private providers: Map<string, AIProvider> = new Map();
  private initialized: boolean = false;

  constructor() {}

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Get active AI providers from database
      const activeProviders = await storage.getActiveAiProviders();
      
      // Initialize each provider
      for (const provider of activeProviders) {
        try {
          // Skip providers with missing configuration
          if (!provider.config) {
            console.warn(`Provider ${provider.name} is missing configuration, skipping`);
            continue;
          }

          // Parse config if it's a string
          const config = typeof provider.config === 'string' 
            ? JSON.parse(provider.config) 
            : provider.config;
          
          if (!config.apiKey) {
            console.warn(`Provider ${provider.name} is missing API key, skipping`);
            continue;
          }

          // Initialize the appropriate provider class based on provider type
          switch (provider.name.toLowerCase()) {
            case 'gemini':
              this.providers.set('gemini', new GeminiProvider({ apiKey: config.apiKey }));
              console.log('Initialized Gemini provider');
              break;
            case 'deepseek':
              this.providers.set('deepseek', new DeepSeekProvider({ apiKey: config.apiKey }));
              console.log('Initialized DeepSeek provider');
              break;
            case 'anthropic':
              this.providers.set('anthropic', new AnthropicProvider({ apiKey: config.apiKey }));
              console.log('Initialized Anthropic provider');
              break;
            default:
              console.warn(`Unknown provider type: ${provider.name}`);
          }
        } catch (error) {
          console.error(`Error initializing provider ${provider.name}:`, error);
        }
      }

      this.initialized = true;
      console.log(`Initialized ${this.providers.size} AI providers`);
    } catch (error) {
      console.error('Error initializing AI providers:', error);
      throw error;
    }
  }

  /**
   * Generates text using available AI providers with fallback mechanisms
   */
  async generateText(params: {
    prompt: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    userId?: number;
  }): Promise<TextGenerationResult> {
    await this.initialize();

    if (this.providers.size === 0) {
      return {
        success: false,
        error: {
          message: "No AI providers available. Please check your configuration.",
          code: "NO_PROVIDERS"
        }
      };
    }

    // Parse model to determine provider
    let targetProvider = 'gemini'; // Default provider
    let modelName = params.model || '';

    if (modelName.startsWith('gemini')) {
      targetProvider = 'gemini';
    } else if (modelName.startsWith('deepseek') || modelName.startsWith('openrouter')) {
      targetProvider = 'deepseek';
    } else if (modelName.startsWith('claude')) {
      targetProvider = 'anthropic';
    }

    // Create a list of providers to try, starting with the target provider
    const providerOrder = [targetProvider];
    
    // Add other providers as fallbacks
    this.providers.forEach((_, key) => {
      if (!providerOrder.includes(key)) {
        providerOrder.push(key);
      }
    });

    // Try each provider in order
    let lastError = null;
    
    for (const providerName of providerOrder) {
      const provider = this.providers.get(providerName);
      
      if (!provider) continue;
      
      try {
        console.log(`Trying provider: ${providerName}`);
        
        const providerParams: ProviderRequestParams = {
          prompt: params.prompt,
          model: params.model,
          temperature: params.temperature,
          maxTokens: params.maxTokens
        };
        
        const response = await provider.textGeneration(providerParams);
        
        // If successful, track usage and return
        if (response.success && response.data) {
          if (params.userId) {
            try {
              // Record AI usage
              await storage.createAiUsage({
                userId: params.userId,
                provider: providerName,
                requestType: 'text', // Set request type for database constraint
                promptTokens: response.usage?.promptTokens || 0,
                completionTokens: response.usage?.completionTokens || 0,
                totalTokens: response.usage?.totalTokens || 0,
                cost: 0 // Calculate actual cost based on model pricing
              });
              
              // Increment provider usage counter
              const providerRecord = await storage.getAiProviderByName(providerName);
              if (providerRecord) {
                await storage.incrementAiProviderUsage(providerRecord.id);
              }
            } catch (error) {
              console.error('Error recording AI usage:', error);
              // Continue even if usage tracking fails
            }
          }
          
          return {
            success: true,
            data: response.data,
            model: response.model,
            usage: response.usage
          };
        }
        
        // Store error for later use
        lastError = response.error;
        
      } catch (error: any) {
        console.error(`Error with provider ${providerName}:`, error);
        lastError = {
          message: error.message || "Unknown error",
          code: "PROVIDER_ERROR"
        };
      }
    }
    
    // If we've tried all providers and none worked
    return {
      success: false,
      error: lastError || {
        message: "All available AI providers failed. Please try again later.",
        code: "ALL_PROVIDERS_FAILED"
      }
    };
  }

  /**
   * Generates images using available AI providers
   */
  async generateImage(params: ImageGenerationParams): Promise<TextGenerationResult> {
    await this.initialize();
    
    // Implementation would be similar to generateText but for image generation
    // Using appropriate providers that support image generation
    
    return {
      success: false,
      error: {
        message: "Image generation is not fully implemented yet.",
        code: "NOT_IMPLEMENTED"
      }
    };
  }

  /**
   * Converts text to speech using available AI providers
   */
  async textToSpeech(params: TTSParams): Promise<TextGenerationResult> {
    await this.initialize();
    
    // Implementation would use providers that support TTS
    
    return {
      success: false,
      error: {
        message: "Text-to-speech generation is not fully implemented yet.",
        code: "NOT_IMPLEMENTED"
      }
    };
  }

  /**
   * Generates video using available AI providers
   */
  async generateVideo(params: VideoGenerationParams): Promise<TextGenerationResult> {
    await this.initialize();
    
    // Implementation would use providers that support video generation
    
    return {
      success: false,
      error: {
        message: "Video generation is not fully implemented yet.",
        code: "NOT_IMPLEMENTED"
      }
    };
  }
}

// Singleton instance of AIManager
export const aiManager = new AIManager();