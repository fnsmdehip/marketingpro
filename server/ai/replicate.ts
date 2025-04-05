import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";

export class ReplicateProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://api.replicate.com/v1";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  
  // Security-focused model allowlist
  private allowedVideoModels = [
    "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
    "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    "cjwbw/damo-text-to-video:1e205ea73084080b5c3fdc3d7532291bd0f11506f8b856514098613639550a22"
  ];
  
  private allowedImageModels = [
    "stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c2e734f5123d8550cce59f70c7dcc7c2d97",
    "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
    "cjwbw/portraitplus:a01656a989e7f8ba1410625dca9adb06126. 5a9affe6e4bb407f98c4d87d5d1c92b"
  ];
  
  private allowedAvatarModels = [
    "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
    "stability-ai/stable-video-diffusion:ab1d779cac05745a49af69c6777f3e219f6e92a3554ab295c3c2d0be7e512edd"
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

  // Poll prediction until complete
  private async pollPrediction(predictionId: string, maxAttempts: number = 60): Promise<any> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        const response = await axios({
          method: 'GET',
          url: `${this.baseUrl}/predictions/${predictionId}`,
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout for polling
        });
        
        const status = response.data.status;
        
        if (status === 'succeeded') {
          return response.data.output;
        } else if (status === 'failed' || status === 'canceled') {
          throw new Error(`Prediction ${status}: ${response.data.error || 'Unknown error'}`);
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        // If error in polling, throw after a few attempts
        if (attempts > 3) {
          throw error;
        }
        // Otherwise wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    throw new Error('Prediction timed out');
  }

  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    // Replicate is primarily used for image/video generation in our system
    return {
      success: false,
      error: {
        message: 'Text generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'replicate'
    };
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
        provider: 'replicate'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'stability-ai/sdxl:d830ba5dabf8090ec0db6c10fc862c2e734f5123d8550cce59f70c7dcc7c2d97';
    
    // Validate model for security
    if (!this.validateModelSecurity(model, this.allowedImageModels)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'replicate'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      // Start the prediction
      const createResponse = await axios({
        method: 'POST',
        url: `${this.baseUrl}/predictions`,
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          version: model.split(':')[1],
          input: {
            prompt: sanitizedPrompt,
            width: params.width || 768,
            height: params.height || 768,
            num_outputs: 1,
            guidance_scale: 7.5,
            scheduler: "K_EULER",
            num_inference_steps: 30
          }
        },
        timeout: 30000 // 30 second timeout
      });
      
      // Poll until the prediction is complete
      const output = await this.pollPrediction(createResponse.data.id);
      
      this.handleSuccess();
      
      return {
        success: true,
        data: {
          images: output,
          prediction_id: createResponse.data.id
        },
        provider: 'replicate'
      };
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'replicate');
    }
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // Replicate doesn't have good free TTS models
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'replicate'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        success: false,
        error: {
          message: 'Service temporarily unavailable (circuit breaker open)',
          code: 'circuit_open',
          retryAfter: Math.floor(this.circuitResetTimeout / 1000)
        },
        provider: 'replicate'
      };
    }
    
    // Default model if not specified
    const model = params.model || 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438';
    
    // Validate model for security
    if (!this.validateModelSecurity(model, this.allowedVideoModels)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'replicate'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    try {
      // Start the prediction
      const createResponse = await axios({
        method: 'POST',
        url: `${this.baseUrl}/predictions`,
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          version: model.split(':')[1],
          input: {
            prompt: sanitizedPrompt,
            sizing_strategy: "maintain_aspect_ratio",
            motion_bucket_id: 127,
            frames_per_second: 7,
            video_length: params.duration || 3.0, // In seconds
            num_inference_steps: 25
          }
        },
        timeout: 30000 // 30 second timeout
      });
      
      // Poll until the prediction is complete
      const output = await this.pollPrediction(createResponse.data.id, 120); // Longer polling for video
      
      this.handleSuccess();
      
      return {
        success: true,
        data: {
          video_url: output,
          prediction_id: createResponse.data.id
        },
        provider: 'replicate'
      };
    } catch (error) {
      this.handleFailure(error);
      return this.sanitizeError(error, 'replicate');
    }
  }
}