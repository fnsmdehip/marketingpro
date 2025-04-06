import Anthropic from '@anthropic-ai/sdk';
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class AnthropicProvider extends AIProvider {
  private apiKey: string;
  private client: Anthropic;
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // Available Claude models - updated for 2025
  // The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
  private allowedModels = [
    "claude-3-7-sonnet-20250219", // latest model 
    "claude-3-5-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-3-opus-20240229",
    "claude-2.1",
    "claude-2.0"
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
    this.client = new Anthropic({
      apiKey: this.apiKey,
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

  // Record failure and potentially open circuit breaker
  private handleFailure(error: any): void {
    this.consecutiveFailures++;
    this.lastErrorTime = Date.now();
    
    // After 3 consecutive failures, open the circuit
    if (this.consecutiveFailures >= 3) {
      this.circuitOpen = true;
      console.warn('[Anthropic Provider] Circuit breaker opened due to consecutive failures');
    }
    
    console.error('[Anthropic Provider] Error:', error);
  }

  // Reset failure count on success
  private handleSuccess(): void {
    if (this.consecutiveFailures > 0) {
      this.consecutiveFailures = 0;
      console.log('[Anthropic Provider] Consecutive failures reset after successful call');
    }
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
        provider: 'anthropic'
      };
    }
    
    // Default to latest model
    const model = params.model || 'claude-3-7-sonnet-20250219';
    
    // Validate model for security
    if (!this.validateModelSecurity(model)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'anthropic'
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
      finalPrompt = `I need high-quality marketing content that's creative, persuasive, and optimized for conversion. Please provide professional-grade content for: ${sanitizedPrompt}
      
      Follow these marketing best practices:
      - Focus on benefits over features
      - Use persuasive, action-oriented language
      - Include emotional appeals where appropriate
      - Consider the target audience demographics
      - Keep tone consistent with brand voice
      - Include clear calls to action
      - Maintain professionalism and adherence to marketing ethics
      - Format content appropriately for the target platform`;
    }
    
    try {
      const message = await this.client.messages.create({
        model: model,
        max_tokens: params.maxTokens || 1024,
        temperature: params.temperature || 0.7,
        system: "You are an expert marketing content creator specializing in persuasive, high-converting copy that drives engagement and delivers business results. Create professional-grade content that's compelling and effective.",
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ]
      });
      
      this.handleSuccess();
      
      // Extract the generated text from the response
      // Handle different content types safely
      let generatedText = '';
      if (message.content && message.content.length > 0) {
        const content = message.content[0];
        if ('text' in content) {
          generatedText = content.text || '';
        } else if (typeof content === 'object' && content !== null) {
          // Try to extract text from other content formats
          generatedText = JSON.stringify(content);
        }
      }
      
      const result: ProviderResponse = {
        success: true,
        data: generatedText,
        provider: 'anthropic'
      };
      
      return result;
    } catch (error: any) {
      this.handleFailure(error);
      console.error("[Anthropic Provider] Error:", error.message);
      
      // Check for rate limiting specifically
      if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded for Anthropic provider',
            code: 'rate_limit',
            retryAfter: 60 // Default 60 second retry
          },
          provider: 'anthropic',
          rateLimited: true
        };
      }
      
      return this.sanitizeError(error, 'anthropic');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // Claude doesn't directly support image generation yet
    return {
      success: false,
      error: {
        message: 'Image generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'anthropic'
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // Claude doesn't directly support TTS yet
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'anthropic'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // Claude doesn't directly support video generation
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'anthropic'
    };
  }
}