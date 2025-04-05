import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class OpenRouterProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // Security-focused model allowlist
  private allowedModels = [
    "openai/gpt-3.5-turbo",
    "google/gemini-1.5-pro",
    "google/gemini-1.5-flash",
    "anthropic/claude-3-opus",
    "anthropic/claude-3-haiku",
    "mistralai/mistral-small",
    "meta-llama/llama-3-70b-instruct",
    "meta-llama/llama-3-8b-instruct"
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
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
        provider: 'openrouter'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'google/gemini-1.5-flash';
    
    // Validate model for security
    if (!this.validateModelSecurity(model)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'openrouter'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/chat/completions`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://marketing-suite.example.com', // Update with actual domain
          'X-Title': 'Marketing Suite'
        },
        data: {
          model: model,
          messages: [{ role: 'user', content: sanitizedPrompt }],
          max_tokens: params.maxTokens || 1024,
          temperature: params.temperature || 0.7,
          stream: false
        },
        timeout: 60000 // 60 second timeout
      });
      
      this.handleSuccess();
      
      const result: ProviderResponse = {
        success: true,
        data: {
          text: response.data.choices[0].message.content,
          modelUsed: response.data.model
        },
        provider: 'openrouter'
      };
      return result;
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'openrouter');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // OpenRouter doesn't directly support image generation yet
    return {
      success: false,
      error: {
        message: 'Image generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'openrouter'
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // OpenRouter doesn't directly support TTS yet
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'openrouter'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // OpenRouter doesn't directly support video generation
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'openrouter'
    };
  }
}