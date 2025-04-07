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
import { AnthropicProvider } from "./anthropic";
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
      // Use the environment variable OpenRouter API key for DeepSeek
      apiKey = process.env.OPENROUTER_API_KEY;
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
    else if (providerNameLower.includes('anthropic') || providerNameLower.includes('claude')) {
      apiKey = process.env.ANTHROPIC_API_KEY;
      if (apiKey) {
        return new AnthropicProvider({ apiKey });
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
  
  // Initialize the singleton
  static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager();
    }
    return AIManager.instance;
  }
  
  private static instance: AIManager;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // TEMPORARY: Initialize providers directly until DB is properly set up
      console.log("Initializing AI providers directly...");
      
      // Register hardcoded providers first to ensure they're available
      // These are the free models we prioritize
      
      // Use OpenRouter API key from Replit environment secrets
      const openRouterApiKey = process.env.OPENROUTER_API_KEY;
      if (openRouterApiKey) {
        console.log("Found OpenRouter API key in environment:", openRouterApiKey.substring(0, 10) + "...");
      } else {
        console.warn("OPENROUTER_API_KEY not found in environment. AI text generation will not work.");
      }
      
      // Use the environment variable OpenRouter API key for DeepSeek
      try {
        // Use process.env.OPENROUTER_API_KEY which should be set by Replit Secrets
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        
        if (openRouterKey) {
          const deepseekProvider = new DeepSeekProvider({ apiKey: openRouterKey });
          this.providers.set('deepseek', deepseekProvider);
          console.log("DeepSeek provider initialized successfully with OpenRouter API key:", openRouterKey?.substring(0, 10) + "...");
        } else {
          console.warn("OPENROUTER_API_KEY not found in environment, DeepSeek provider not available");
        }
      } catch (error) {
        console.error("Failed to initialize DeepSeek provider:", error);
      }
      
      if (process.env.GEMINI_API_KEY) {
        const geminiProvider = new GeminiProvider({ apiKey: process.env.GEMINI_API_KEY });
        this.providers.set('gemini', geminiProvider);
        console.log("Gemini provider initialized successfully");
      } else {
        console.warn("GEMINI_API_KEY not found, Gemini provider not available");
      }
      
      if (process.env.OPENAI_API_KEY) {
        const openAIProvider = new OpenAIProvider({ apiKey: process.env.OPENAI_API_KEY });
        this.providers.set('openai', openAIProvider);
        console.log("OpenAI provider initialized successfully");
      }
      
      // Now try the database providers as well
      try {
        const activeProviders = await storage.getActiveAiProviders();
        console.log(`Loading ${activeProviders.length} providers from database`);
        
        // Create provider instances for any we don't already have
        for (const providerData of activeProviders) {
          const name = providerData.name.toLowerCase();
          if (!this.providers.has(name)) {
            const provider = createProvider(providerData);
            if (provider) {
              this.providers.set(name, provider);
              console.log(`Provider ${name} initialized from database`);
            }
          }
        }
      } catch (dbError) {
        console.warn("Error loading providers from database:", dbError);
        console.log("Continuing with hardcoded providers only");
      }
      
      console.log(`AI Manager initialized with ${this.providers.size} providers`);
      if (this.providers.size > 0) {
        console.log(`Available providers: ${Array.from(this.providers.keys()).join(', ')}`);
      } else {
        console.warn("No AI providers available! API generation endpoints will fail.");
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
      } else if (preferredModel.startsWith('claude-') || preferredModel.includes('anthropic')) {
        return this.providers.get('anthropic') || null;
      }
    }
    
    // If no model-specific provider found or no model specified, use fallback logic
    
    // Define capability maps for each request type
    // DeepSeek is now first choice for text since it handles marketing content better,
    // followed by Anthropic Claude which is also excellent for marketing
    const textCapabilities: string[] = ['deepseek', 'anthropic', 'openai', 'gemini', 'huggingface', 'openrouter'];
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
      
      // Check if this is marketing-related content to optimize provider selection
      let isMarketingContent = false;
      if (params.prompt) {
        const lowerPrompt = params.prompt.toLowerCase();
        isMarketingContent = 
          lowerPrompt.includes('marketing') || 
          lowerPrompt.includes('advertisement') || 
          lowerPrompt.includes('promote') || 
          lowerPrompt.includes('sell') ||
          lowerPrompt.includes('social media') ||
          lowerPrompt.includes('campaign');
      }
      
      // For marketing content, prefer DeepSeek or Claude (skip any preferred model)
      let provider;
      if (isMarketingContent) {
        // Try to use DeepSeek first for marketing content
        if (this.providers.has('deepseek')) {
          provider = this.providers.get('deepseek');
          console.log('[AI Manager] Marketing content detected, using DeepSeek');
        }
        // Fall back to Claude if DeepSeek is not available
        else if (this.providers.has('anthropic')) {
          provider = this.providers.get('anthropic');
          console.log('[AI Manager] Marketing content detected, using Claude');
        }
        // If neither is available, use normal selection logic
        else {
          provider = await this.selectProvider('text', params.model);
        }
      } else {
        provider = await this.selectProvider('text', params.model);
      }
      
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
          timestamp: new Date()
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
          timestamp: new Date()
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
          timestamp: new Date()
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
          timestamp: new Date()
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