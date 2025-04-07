import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import axios from "axios";

export class GeminiProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes

  // Models ordered by preference (will fall back in order)
  private allowedModels = [
    "gemini-2.5-pro",   // Latest Gemini 2.5 Pro
    "gemini-2.5-flash", // Faster but slightly less capable
    "gemini-2.0-pro",   // Previous generation Pro
    "gemini-2.0-flash", // Previous generation Flash
    "gemini-1.5-pro",   // More stable, good fallback option
    "gemini-1.0-pro"    // Most stable, lowest rate limit issues
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
  }

  private isCircuitOpen(): boolean {
    if (!this.circuitOpen) return false;
    
    // Check if circuit breaker timeout has elapsed
    const currentTime = Date.now();
    if (currentTime - this.lastErrorTime > this.circuitResetTimeout) {
      console.log("[GeminiProvider] Circuit breaker reset after timeout");
      this.circuitOpen = false;
      this.consecutiveFailures = 0;
      return false;
    }
    
    return true;
  }

  private handleFailure(error: any): void {
    this.consecutiveFailures++;
    console.warn(`[GeminiProvider] Failure #${this.consecutiveFailures}: ${error.message || "Unknown error"}`);
    
    // Open circuit after multiple consecutive failures
    if (this.consecutiveFailures >= 3) {
      this.circuitOpen = true;
      this.lastErrorTime = Date.now();
      console.error("[GeminiProvider] Circuit breaker opened due to multiple failures");
    }
  }

  private handleSuccess(): void {
    if (this.consecutiveFailures > 0) {
      this.consecutiveFailures = 0;
      console.log("[GeminiProvider] Reset consecutive failures counter after success");
    }
  }

  private validateModelSecurity(model: string): boolean {
    // Ensure the model is in our allowed list to prevent injection
    return this.allowedModels.includes(model);
  }

  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    if (this.isCircuitOpen()) {
      return {
        success: false,
        provider: "gemini",
        error: {
          message: "Service temporarily unavailable due to multiple failures. Please try again later.",
          code: "CIRCUIT_OPEN"
        }
      };
    }

    let currentModelIndex = 0;
    let preferredModel = params.model || this.allowedModels[0];
    
    // Ensure model is valid
    if (!this.validateModelSecurity(preferredModel)) {
      preferredModel = this.allowedModels[0];
    }
    
    // Find the index of the preferred model in our array
    const preferredModelIndex = this.allowedModels.indexOf(preferredModel);
    if (preferredModelIndex !== -1) {
      currentModelIndex = preferredModelIndex;
    }
    
    // Start trying with the preferred model, then fall back to others if needed
    while (currentModelIndex < this.allowedModels.length) {
      const currentModel = this.allowedModels[currentModelIndex];
      
      try {
        console.log(`[GeminiProvider] Attempting with model: ${currentModel}`);
        
        const response = await axios.post(
          `${this.baseUrl}/models/${currentModel}:generateContent?key=${this.apiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: params.prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: params.temperature || 0.7,
              maxOutputTokens: params.maxTokens || 2048
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
            ]
          }
        );
        
        // Handle successful response
        if (response.data.candidates && response.data.candidates.length > 0) {
          const textContent = response.data.candidates[0].content.parts
            .map((part: any) => part.text || "")
            .join("");
            
          // Record successful call
          this.handleSuccess();
          
          const result: ProviderResponse = {
            success: true,
            provider: "gemini",
            data: textContent,
            model: currentModel,
            usage: {
              promptTokens: response.data.usageMetadata?.promptTokenCount || 0,
              completionTokens: response.data.usageMetadata?.candidatesTokenCount || 0,
              totalTokens: (response.data.usageMetadata?.promptTokenCount || 0) + 
                          (response.data.usageMetadata?.candidatesTokenCount || 0)
            }
          };
          
          return result;
        } else {
          // No valid response 
          this.handleFailure(new Error("No valid response from Gemini API"));
          currentModelIndex++;
          continue;
        }
      } catch (error: any) {
        console.error(`[GeminiProvider] Error with ${currentModel}:`, error.response?.data || error.message);
        
        // Determine if we should try a different model based on error type
        if (error.response) {
          const statusCode = error.response.status;
          const errorMessage = error.response.data?.error?.message || "Unknown error";
          
          // Rate limit or quota exceeded - try fallback model
          if (statusCode === 429 || statusCode === 403 || 
              errorMessage.includes("quota") || 
              errorMessage.includes("rate limit") ||
              errorMessage.includes("safety settings")) {
            console.warn(`[GeminiProvider] ${currentModel} blocked (${errorMessage}), trying fallback model`);
            currentModelIndex++;
            continue;
          }
          
          // Blocked by safety filters - try fallback model with different settings
          if (errorMessage.includes("content filtered") || 
              errorMessage.includes("safety") ||
              errorMessage.includes("blocked")) {
            console.warn(`[GeminiProvider] Content blocked by safety filter, trying fallback model`);
            currentModelIndex++;
            continue;
          }
        }
        
        // Record the failure
        this.handleFailure(error);
        
        // For non-specific errors, try next model
        currentModelIndex++;
      }
    }
    
    // If we've exhausted all model options
    return {
      success: false,
      provider: "gemini",
      error: {
        message: "All available AI models failed to generate content. Please try again with different prompt content.",
        code: "ALL_MODELS_FAILED"
      }
    };
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    return {
      success: false,
      provider: "gemini",
      error: {
        message: "Image generation not yet supported by Gemini API",
        code: "UNSUPPORTED_OPERATION"
      }
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    return {
      success: false,
      provider: "gemini",
      error: {
        message: "Text to Speech not yet supported by Gemini API",
        code: "UNSUPPORTED_OPERATION"
      }
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    return {
      success: false,
      provider: "gemini",
      error: {
        message: "Video generation not yet supported by Gemini API",
        code: "UNSUPPORTED_OPERATION"
      }
    };
  }
}