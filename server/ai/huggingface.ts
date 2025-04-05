import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class HuggingFaceProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://api-inference.huggingface.co/models";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // Security-focused model allowlist
  private allowedTextModels = [
    "google/flan-t5-xxl",
    "google/flan-t5-xl",
    "google/gemma-7b",
    "google/flan-ul2",
    "tiiuae/falcon-40b"
  ];
  
  private allowedTTSModels = [
    "facebook/mms-tts",
    "coqui/XTTS-v2",
    "espnet/kan-bayashi_ljspeech_vits"
  ];
  
  private allowedImageModels = [
    "stabilityai/stable-diffusion-xl-base-1.0",
    "runwayml/stable-diffusion-v1-5",
    "SG161222/Realistic_Vision_V4.0"
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
  }

  // Check if circuit breaker is open (service considered down)
  private isCircuitOpen(): boolean {
    // If circuit is open, check if we should try again
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
  private validateModelSecurity(model: string, allowedModels: string[]): boolean {
    // Prevent path traversal attacks or unauthorized model access
    return this.validateModel(model, allowedModels);
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
        provider: 'huggingface'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'google/flan-t5-xl';
    
    // Validate model for security
    if (!this.validateModelSecurity(model, this.allowedTextModels)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'huggingface'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/${model}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          inputs: sanitizedPrompt,
          parameters: {
            max_new_tokens: params.maxTokens || 256,
            temperature: params.temperature || 0.7,
            return_full_text: false
          }
        },
        timeout: 30000 // 30 second timeout
      });
      
      this.handleSuccess();
      
      return {
        success: true,
        data: response.data[0].generated_text || response.data,
        provider: 'huggingface'
      };
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'huggingface');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        success: false,
        error: {
          message: 'Service temporarily unavailable (circuit breaker open)',
          code: 'circuit_open',
          retryAfter: Math.floor(this.circuitResetTimeout / 1000)
        },
        provider: 'huggingface'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'stabilityai/stable-diffusion-xl-base-1.0';
    
    // Validate model for security
    if (!this.validateModelSecurity(model, this.allowedImageModels)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'huggingface'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/${model}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          inputs: sanitizedPrompt,
          parameters: {
            width: params.width || 512,
            height: params.height || 512,
            num_inference_steps: 30,
            guidance_scale: 7.5
          }
        },
        responseType: 'arraybuffer',
        timeout: 60000 // 60 second timeout for image generation
      });
      
      this.handleSuccess();
      
      // Convert buffer to base64
      const imageBuffer = Buffer.from(response.data);
      const base64Image = imageBuffer.toString('base64');
      
      return {
        success: true,
        data: {
          format: 'base64',
          image: base64Image
        },
        provider: 'huggingface'
      };
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'huggingface');
    }
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        success: false,
        error: {
          message: 'Service temporarily unavailable (circuit breaker open)',
          code: 'circuit_open',
          retryAfter: Math.floor(this.circuitResetTimeout / 1000)
        },
        provider: 'huggingface'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'facebook/mms-tts';
    
    // Validate model for security
    if (!this.validateModelSecurity(model, this.allowedTTSModels)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'huggingface'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedText = this.sanitizeInput(params.text);
    
    try {
      // Set data based on model type
      let data: any = {};
      if (model === 'coqui/XTTS-v2') {
        data = {
          inputs: {
            text: sanitizedText,
            speaker_embedding: params.voice || 'random'
          }
        };
      } else {
        data = {
          inputs: sanitizedText,
          parameters: {
            speaker_id: params.voice || 0
          }
        };
      }
      
      const response = await axios({
        method: 'POST',
        url: `${this.baseUrl}/${model}`,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data,
        responseType: 'arraybuffer',
        timeout: 30000 // 30 second timeout
      });
      
      this.handleSuccess();
      
      // Convert buffer to base64
      const audioBuffer = Buffer.from(response.data);
      const base64Audio = audioBuffer.toString('base64');
      
      return {
        success: true,
        data: {
          format: 'base64',
          audio: base64Audio,
          contentType: 'audio/wav' // Most models return wav, adjust if needed
        },
        provider: 'huggingface'
      };
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'huggingface');
    }
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // HuggingFace doesn't directly support video generation via inference API
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'huggingface'
    };
  }
}