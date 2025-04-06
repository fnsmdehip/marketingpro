import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";
import { OpenAI } from "openai";

export class DeepSeekProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  private client: OpenAI;
  
  // DeepSeek models available through OpenRouter
  private allowedModels = [
    // Prioritized free models
    "deepseek/deepseek-chat-v3-0324:free", // Primary model - better quality
    "deepseek/deepseek-v3-base:free",      // First fallback if rate limited
    "deepseek/deepseek-r1-zero:free",      // Second fallback if rate limited
    
    // Other models still available
    "deepseek/deepseek-coder-v2-instruct",
    "deepseek-ai/deepseek-v2",
    "deepseek-ai/deepseek-v2-base",
    "deepseek-ai/deepseek-coder-v2-base",
    "deepseek-ai/deepseek-coder-v2",
    "deepseek-ai/deepseek-math-v1",
    "deepseek-ai/deepseek-v3-base",
    "deepseek-ai/deepseek-llm-67b-chat"
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
    console.log("Initializing DeepSeek provider with API key:", this.apiKey?.substring(0, 10) + "...");
    
    // For debugging only
    if (this.apiKey.startsWith('sk-or-')) {
      console.log("DeepSeek using valid OpenRouter API key format");
    } else {
      console.warn("DeepSeek API key does not match expected OpenRouter format (should start with sk-or-)");
    }
    
    // Initialize OpenAI client with OpenRouter base URL
    this.client = new OpenAI({
      baseURL: this.baseUrl,
      apiKey: this.apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://marketingsaasapp.replit.app",
        "X-Title": "MarketingSaaS"
      }
    });
  }

  // Check if circuit breaker is open (service considered down)
  private isCircuitOpen(): boolean {
    if (this.circuitOpen) {
      const now = Date.now();
      const timeSinceFailure = now - this.lastErrorTime;
      
      // Reset circuit after timeout period
      if (timeSinceFailure > this.circuitResetTimeout) {
        this.circuitOpen = false;
        this.consecutiveFailures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  // Handle failures and potentially open circuit breaker
  private handleFailure(error: any): void {
    this.consecutiveFailures++;
    this.lastErrorTime = Date.now();
    
    // Open circuit breaker after threshold failures
    if (this.consecutiveFailures >= 5) {
      this.circuitOpen = true;
    }
  }

  // Reset failure count on success
  private handleSuccess(): void {
    this.consecutiveFailures = 0;
  }

  // Validate model for security
  private validateModelSecurity(model: string): boolean {
    // Prevent path traversal attacks or unauthorized model access
    return this.validateModel(model, this.allowedModels);
  }

  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        success: false,
        error: {
          message: 'Service temporarily unavailable (circuit breaker open)',
          code: 'circuit_open',
          retryAfter: Math.floor(this.circuitResetTimeout / 1000)
        },
        provider: 'deepseek'
      };
    }
    
    // Default model - DeepSeek Chat v3 model from OpenRouter 
    const model = params.model || 'deepseek/deepseek-chat-v3-0324:free';
    
    // Validate model for security
    if (!this.validateModelSecurity(model)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'deepseek'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    // Check if this is marketing-related content to optimize formatting
    let finalPrompt = sanitizedPrompt;
    const lowerPrompt = sanitizedPrompt.toLowerCase();
    const isMarketingContent = 
      lowerPrompt.includes('marketing') || 
      lowerPrompt.includes('advertisement') || 
      lowerPrompt.includes('promote') || 
      lowerPrompt.includes('sell') ||
      lowerPrompt.includes('social media') ||
      lowerPrompt.includes('campaign');
    
    // Add special instructions for marketing content to improve quality
    if (isMarketingContent) {
      finalPrompt = `I need high-quality marketing content that's creative, persuasive, and engagement-driving. Please provide professional-grade content for: ${sanitizedPrompt}
      
      Follow these marketing best practices:
      - Focus on benefits over features
      - Use persuasive, action-oriented language
      - Include emotional appeals where appropriate
      - Consider the target audience demographics
      - Keep tone consistent with brand voice
      - Include clear calls to action
      - Maintain professionalism and adherence to marketing standards`;
    }
    
    try {
      // Use OpenAI-compatible client to call OpenRouter API
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert marketing content creator specializing in persuasive, high-converting copy that drives engagement and delivers business results. Always return only the final content without any meta-instructions, templates, or placeholders."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 1024
      });
      
      this.handleSuccess();
      
      // Extract the generated text from the response
      const generatedText = completion.choices[0].message.content || '';
      
      const result: ProviderResponse = {
        success: true,
        data: generatedText,
        provider: 'deepseek'
      };
      
      return result;
    } catch (error: any) {
      this.handleFailure(error);
      console.error("[DeepSeek Provider] Error:", error.message);
      
      // Check for rate limiting specifically
      if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded for DeepSeek provider',
            code: 'rate_limit',
            retryAfter: 60 // Default 60 second retry
          },
          provider: 'deepseek',
          rateLimited: true
        };
      }
      
      return this.sanitizeError(error, 'deepseek');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support image generation
    return {
      success: false,
      error: {
        message: 'Image generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support TTS
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support video generation
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }
}