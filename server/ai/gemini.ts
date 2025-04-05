import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class GeminiProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // Available models (2.5 is the latest and best)
  private allowedModels = [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-pro",
    "gemini-pro-vision"
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
        provider: 'gemini'
      };
    }
    
    // Default model if not specified - use 2.5 Pro as the primary model
    const model = params.model || 'gemini-1.5-pro';
    
    // Validate model for security
    if (!this.validateModelSecurity(model)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'gemini'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          contents: [
            {
              role: "user",
              parts: [{ text: sanitizedPrompt }]
            }
          ],
          generationConfig: {
            temperature: params.temperature || 0.7,
            maxOutputTokens: params.maxTokens || 1024,
            topP: 0.95,
            topK: 64
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        timeout: 30000 // 30 second timeout
      });
      
      this.handleSuccess();
      
      // Extract the text content from the response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      const result: ProviderResponse = {
        success: true,
        data: {
          text: generatedText,
          modelUsed: model
        },
        provider: 'gemini'
      };
      
      return result;
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'gemini');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // Gemini API doesn't support standalone image generation yet
    return {
      success: false,
      error: {
        message: 'Image generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'gemini'
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // Gemini doesn't directly support TTS yet
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'gemini'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // Gemini doesn't directly support video generation
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'gemini'
    };
  }
}