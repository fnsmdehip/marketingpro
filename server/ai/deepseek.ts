import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class DeepSeekProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://api-inference.huggingface.co/models";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // DeepSeek models available through Hugging Face
  private allowedModels = [
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
    
    // Default model - DeepSeek v3 base model
    const model = params.model || 'deepseek-ai/deepseek-v3-base';
    
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
    
    // Format prompt for chat models
    const formattedPrompt = model.includes('chat') ? 
      `<|im_start|>user\n${sanitizedPrompt}<|im_end|>\n<|im_start|>assistant\n` : 
      sanitizedPrompt;
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/${model}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: params.maxTokens || 512,
            temperature: params.temperature || 0.7,
            return_full_text: false,
            do_sample: true,
            top_p: 0.95
          }
        },
        timeout: 60000 // 60 second timeout
      });
      
      this.handleSuccess();
      
      // Extract the generated text from the response
      let generatedText = '';
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        generatedText = response.data[0].generated_text;
      } else if (response.data && response.data.generated_text) {
        generatedText = response.data.generated_text;
      } else {
        generatedText = JSON.stringify(response.data);
      }
      
      // Clean up assistant tag if present
      if (generatedText.includes('<|im_end|>')) {
        generatedText = generatedText.split('<|im_end|>')[0];
      }
      
      const result: ProviderResponse = {
        success: true,
        data: {
          text: generatedText,
          modelUsed: model
        },
        provider: 'deepseek'
      };
      
      return result;
    } catch (error) {
      this.handleFailure(error);
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