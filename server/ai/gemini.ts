import { AIProvider, ProviderImageParams, ProviderRequestParams, ProviderResponse, ProviderTTSParams, ProviderVideoParams } from './provider';
import { AiProvider } from '@shared/schema';
import { storage } from '../storage';

export class GeminiProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";
  
  constructor(provider: AiProvider) {
    super(provider);
    
    // Check for API key in environment
    this.apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn("GEMINI_API_KEY is not set. Gemini provider will not work correctly.");
    }
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Validate API key is present
      if (!this.apiKey) {
        return {
          success: false,
          error: "GEMINI_API_KEY is not configured",
          provider: this.name
        };
      }
      
      // Default to Gemini 1.5 Flash if not specified
      const modelName = params.model || "gemini-1.5-flash";
      
      // Map modelName to Gemini model endpoint
      let modelEndpoint;
      switch (modelName) {
        case "gemini-1.5-pro":
          modelEndpoint = "gemini-1.5-pro";
          break;
        case "gemini-1.5-flash":
          modelEndpoint = "gemini-1.5-flash";
          break;
        case "gemini-pro":
          modelEndpoint = "gemini-pro";
          break;
        default:
          modelEndpoint = "gemini-1.5-flash"; // Default model
      }
      
      // API URL for text generation
      const apiUrl = `${this.baseUrl}/models/${modelEndpoint}:generateContent?key=${this.apiKey}`;
      
      // Prepare request payload
      const payload = {
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
          maxOutputTokens: params.maxTokens || 800,
          topP: 0.95,
          topK: 40
        }
      };
      
      // Make API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      // Check for successful response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }
      
      // Parse response
      const data = await response.json();
      
      // Record usage
      if (params.user) {
        await this.recordUsage(params.user, "text", true);
      }
      
      // Extract and return generated text
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return {
        success: true,
        result: generatedText,
        provider: this.name
      };
      
    } catch (error: any) {
      console.error("Gemini text generation error:", error);
      
      // Record failed usage
      if (params.user) {
        await this.recordUsage(params.user, "text", false);
      }
      
      return {
        success: false,
        error: error.message || "Failed to generate text with Gemini",
        provider: this.name
      };
    }
  }
  
  // Gemini doesn't yet support direct image generation via API
  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // For image generation, we recommend using a multimodal model to generate prompts
    // and then passing those to a dedicated image model
    return {
      success: false,
      error: "Image generation is not directly supported by the Gemini API. Use a different provider.",
      provider: this.name
    };
  }
  
  // Gemini doesn't support text-to-speech
  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    return {
      success: false,
      error: "Text-to-speech is not supported by the Gemini API. Use a different provider.",
      provider: this.name
    };
  }
  
  // Gemini doesn't support video generation
  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    return {
      success: false,
      error: "Video generation is not supported by the Gemini API. Use a different provider.",
      provider: this.name
    };
  }
}