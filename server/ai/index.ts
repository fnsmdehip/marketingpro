import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse, 
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams,
  requestParamsSchema,
  imageParamsSchema,
  ttsParamsSchema,
  videoParamsSchema
} from "./provider";
import { HuggingFaceProvider } from "./huggingface";
import { ReplicateProvider } from "./replicate";
import { OpenRouterProvider } from "./openrouter";
import { GeminiProvider } from "./gemini";
import { DeepSeekProvider } from "./deepseek";
import { OpenAIProvider } from "./openai";
import { AiProvider } from "@shared/schema";
import { storage } from "../storage";

// Factory function to create the right provider instance
function createProvider(providerData: AiProvider): AIProvider | null {
  try {
    // Extract API key from environment variables based on provider name
    let apiKey: string | undefined;
    
    const providerNameLower = providerData.name.toLowerCase();
    
    if (providerNameLower.includes('huggingface') || providerNameLower.includes('hugging face')) {
      apiKey = process.env.HUGGINGFACE_API_KEY;
      if (apiKey) {
        return new HuggingFaceProvider({ apiKey });
      }
    } 
    else if (providerNameLower.includes('replicate')) {
      apiKey = process.env.REPLICATE_API_KEY;
      if (apiKey) {
        return new ReplicateProvider({ apiKey });
      }
    }
    else if (providerNameLower.includes('openrouter') || providerNameLower.includes('open router')) {
      apiKey = process.env.OPENROUTER_API_KEY;
      if (apiKey) {
        return new OpenRouterProvider({ apiKey });
      }
    }
    else if (providerNameLower.includes('gemini')) {
      apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        return new GeminiProvider({ apiKey });
      }
    }
    else if (providerNameLower.includes('deepseek')) {
      apiKey = process.env.HUGGINGFACE_API_KEY; // DeepSeek uses HuggingFace API
      if (apiKey) {
        return new DeepSeekProvider({ apiKey });
      }
    }
    else if (providerNameLower.includes('openai')) {
      apiKey = process.env.OPENAI_API_KEY;
      if (apiKey) {
        return new OpenAIProvider({ apiKey });
      }
    }
    
    console.warn(`Missing API key or unsupported provider: ${providerData.name}`);
  } catch (error) {
    console.error(`Error creating provider ${providerData.name}:`, error);
  }
  
  return null;
}

export class AIManager {
  private providers: Map<string, AIProvider>;
  private initialized: boolean = false;

  constructor() {
    this.providers = new Map<string, AIProvider>();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Get all active AI providers from storage
      const activeProviders = await storage.getActiveAiProviders();
      
      console.log(`AI Manager initialized with ${activeProviders.length} providers`);
      
      // Create provider instances
      for (const providerData of activeProviders) {
        const provider = createProvider(providerData);
        if (provider) {
          this.providers.set(providerData.name.toLowerCase(), provider);
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error("Error initializing AI Manager:", error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  private async selectProvider(requestType: string, preferredModel?: string): Promise<AIProvider | null> {
    await this.ensureInitialized();
    
    // If we have a model and it has a provider-specific prefix, use that provider directly
    if (preferredModel) {
      // Check for provider-specific model name patterns
      if (preferredModel.startsWith('gemini-')) {
        return this.providers.get('gemini') || null;
      } else if (preferredModel.startsWith('deepseek-ai/') || preferredModel.includes('deepseek')) {
        return this.providers.get('deepseek') || null;
      } else if (preferredModel.startsWith('mistral') || preferredModel.startsWith('llama')) {
        return this.providers.get('huggingface') || null;
      } else if (preferredModel.includes('stable-diffusion') || preferredModel.includes('sdxl')) {
        return this.providers.get('replicate') || null;
      } else if (preferredModel.startsWith('gpt-') || preferredModel.includes('dall-e') || preferredModel.startsWith('tts-')) {
        return this.providers.get('openai') || null;
      }
    }
    
    // If no model-specific provider found or no model specified, use fallback logic
    
    // Define capability maps for each request type
    const textCapabilities: string[] = ['gemini', 'deepseek', 'openai', 'huggingface', 'openrouter'];
    const imageCapabilities: string[] = ['openai', 'replicate', 'huggingface'];
    const ttsCapabilities: string[] = ['openai', 'huggingface'];
    const videoCapabilities: string[] = ['replicate'];
    
    // Determine provider candidates based on request type
    let candidates: string[] = [];
    switch (requestType) {
      case 'text':
        candidates = textCapabilities;
        break;
      case 'image':
        candidates = imageCapabilities;
        break;
      case 'tts':
        candidates = ttsCapabilities;
        break;
      case 'video':
        candidates = videoCapabilities;
        break;
    }
    
    // Try to find an available provider
    for (const candidate of candidates) {
      if (this.providers.has(candidate)) {
        const provider = this.providers.get(candidate);
        if (provider) return provider;
      }
    }
    
    // If no specific provider found, return any available provider as last resort
    if (this.providers.size > 0) {
      const provider = Array.from(this.providers.values())[0];
      if (provider) return provider;
    }
    
    return null;
  }

  async generateText(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Validate the input parameters
      const validationResult = requestParamsSchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: {
            message: 'Validation error: ' + validationResult.error.message,
            code: 'validation_error'
          },
          provider: 'ai_manager'
        };
      }
      
      const provider = await this.selectProvider('text', params.model);
      
      if (!provider) {
        return {
          success: false,
          error: {
            message: 'No suitable provider available for text generation',
            code: 'no_provider'
          },
          provider: 'ai_manager'
        };
      }
      
      // Log AI usage in the database if a user is specified
      if (params.userId) {
        await storage.createAiUsage({
          userId: params.userId,
          provider: provider.constructor.name.replace('Provider', ''),
          requestType: 'text',
          requestCount: 1,
          status: 'success'
        });
      }
      
      return await provider.textGeneration(params);
    } catch (error) {
      console.error('Error in generateText:', error);
      return {
        success: false,
        error: {
          message: 'Internal server error in text generation',
          code: 'internal_error'
        },
        provider: 'ai_manager'
      };
    }
  }

  async generateImage(params: ProviderImageParams): Promise<ProviderResponse> {
    try {
      // Validate the input parameters
      const validationResult = imageParamsSchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: {
            message: 'Validation error: ' + validationResult.error.message,
            code: 'validation_error'
          },
          provider: 'ai_manager'
        };
      }
      
      const provider = await this.selectProvider('image', params.model);
      
      if (!provider) {
        return {
          success: false,
          error: {
            message: 'No suitable provider available for image generation',
            code: 'no_provider'
          },
          provider: 'ai_manager'
        };
      }
      
      // Log AI usage in the database if a user is specified and not skipping auth
      if (params.userId && !params.skipAuth) {
        await storage.createAiUsage({
          userId: params.userId,
          provider: provider.constructor.name.replace('Provider', ''),
          requestType: 'image',
          requestCount: 1,
          status: 'success'
        });
      }
      
      return await provider.imageGeneration(params);
    } catch (error) {
      console.error('Error in generateImage:', error);
      return {
        success: false,
        error: {
          message: 'Internal server error in image generation',
          code: 'internal_error'
        },
        provider: 'ai_manager'
      };
    }
  }

  async generateSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    try {
      // Validate the input parameters
      const validationResult = ttsParamsSchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: {
            message: 'Validation error: ' + validationResult.error.message,
            code: 'validation_error'
          },
          provider: 'ai_manager'
        };
      }
      
      const provider = await this.selectProvider('tts', params.model);
      
      if (!provider) {
        return {
          success: false,
          error: {
            message: 'No suitable provider available for text-to-speech',
            code: 'no_provider'
          },
          provider: 'ai_manager'
        };
      }
      
      // Log AI usage in the database if a user is specified
      if (params.userId) {
        await storage.createAiUsage({
          userId: params.userId,
          provider: provider.constructor.name.replace('Provider', ''),
          requestType: 'tts',
          requestCount: 1,
          status: 'success'
        });
      }
      
      return await provider.textToSpeech(params);
    } catch (error) {
      console.error('Error in generateSpeech:', error);
      return {
        success: false,
        error: {
          message: 'Internal server error in text-to-speech',
          code: 'internal_error'
        },
        provider: 'ai_manager'
      };
    }
  }

  async generateVideo(params: ProviderVideoParams): Promise<ProviderResponse> {
    try {
      // Validate the input parameters
      const validationResult = videoParamsSchema.safeParse(params);
      if (!validationResult.success) {
        return {
          success: false,
          error: {
            message: 'Validation error: ' + validationResult.error.message,
            code: 'validation_error'
          },
          provider: 'ai_manager'
        };
      }
      
      const provider = await this.selectProvider('video', params.model);
      
      if (!provider) {
        return {
          success: false,
          error: {
            message: 'No suitable provider available for video generation',
            code: 'no_provider'
          },
          provider: 'ai_manager'
        };
      }
      
      // Log AI usage in the database if a user is specified
      if (params.userId) {
        await storage.createAiUsage({
          userId: params.userId,
          provider: provider.constructor.name.replace('Provider', ''),
          requestType: 'video',
          requestCount: 1,
          status: 'success'
        });
      }
      
      return await provider.videoGeneration(params);
    } catch (error) {
      console.error('Error in generateVideo:', error);
      return {
        success: false,
        error: {
          message: 'Internal server error in video generation',
          code: 'internal_error'
        },
        provider: 'ai_manager'
      };
    }
  }

  async getProvidersStatus(): Promise<any[]> {
    await this.ensureInitialized();
    
    const status = [];
    
    // Get list of available providers with their capabilities
    // Using Array.from to avoid potential ES version compatibility issues
    for (const entry of Array.from(this.providers.entries())) {
      const [name, provider] = entry;
      const capabilities: string[] = [];
      
      // Check if the provider has meaningful implementations (not just error returns)
      try {
        const textGenImpl = provider.constructor.prototype.textGeneration.toString();
        if (textGenImpl && textGenImpl.length > 150 && !textGenImpl.includes('not supported by this provider')) {
          capabilities.push('text');
        }
        
        const imageGenImpl = provider.constructor.prototype.imageGeneration.toString();
        if (imageGenImpl && imageGenImpl.length > 150 && !imageGenImpl.includes('not supported by this provider')) {
          capabilities.push('image');
        }
        
        const ttsImpl = provider.constructor.prototype.textToSpeech.toString();
        if (ttsImpl && ttsImpl.length > 150 && !ttsImpl.includes('not supported by this provider')) {
          capabilities.push('tts');
        }
        
        const videoGenImpl = provider.constructor.prototype.videoGeneration.toString();
        if (videoGenImpl && videoGenImpl.length > 150 && !videoGenImpl.includes('not supported by this provider')) {
          capabilities.push('video');
        }
      } catch (error) {
        console.warn('Error checking provider capabilities:', error);
      }
      
      status.push({
        name,
        capabilities,
        available: true
      });
    }
    
    return status;
  }
}

export const aiManager = new AIManager();