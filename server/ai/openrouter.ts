import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { AiProvider } from "@shared/schema";

export class OpenRouterProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  
  constructor(provider: AiProvider) {
    super(provider);
    // Get API key from environment variables
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn(`Warning: OPENROUTER_API_KEY is not set. ${provider.name} will not work correctly.`);
    }
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "OpenRouter API key is not configured",
          provider: this.name
        };
      }
      
      // Determine which model to use based on provider endpoint and params
      const modelPath = this.provider.endpoint.split('/')[1];
      const model = params.model || modelPath;
      
      // Make request to OpenRouter
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://marketingpro.ai',
          'X-Title': 'MarketingPro.ai'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "user", content: params.prompt }
          ],
          max_tokens: params.maxTokens || 1000,
          temperature: params.temperature || 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "textGeneration", false);
        return {
          success: false,
          error: errorData.error?.message || `OpenRouter API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "textGeneration", true);
      
      return {
        success: true,
        result: data.choices[0].message.content,
        provider: this.name
      };
    } catch (error) {
      await this.recordUsage(params.user || 0, "textGeneration", false);
      return {
        success: false,
        error: `Error with ${this.name}: ${error instanceof Error ? error.message : String(error)}`,
        provider: this.name
      };
    }
  }
  
  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "OpenRouter API key is not configured",
          provider: this.name
        };
      }
      
      // For image generation, redirect to appropriate model via OpenRouter
      const model = params.model || "stability.stable-diffusion-xl";
      
      // Make request to OpenRouter image endpoint
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://marketingpro.ai',
          'X-Title': 'MarketingPro.ai'
        },
        body: JSON.stringify({
          model: model,
          prompt: params.prompt,
          n: 1,
          size: params.size || "1024x1024",
          quality: params.quality || "standard",
          style: params.style
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "imageGeneration", false);
        return {
          success: false,
          error: errorData.error?.message || `OpenRouter API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "imageGeneration", true);
      
      return {
        success: true,
        result: data.data[0].url, // URL to the generated image
        provider: this.name
      };
    } catch (error) {
      await this.recordUsage(params.user || 0, "imageGeneration", false);
      return {
        success: false,
        error: `Error with ${this.name}: ${error instanceof Error ? error.message : String(error)}`,
        provider: this.name
      };
    }
  }
  
  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // OpenRouter doesn't directly support TTS, so we'll return a not implemented response
    return {
      success: false,
      error: "Text to speech not directly supported through OpenRouter",
      provider: this.name
    };
  }
  
  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // OpenRouter doesn't directly support video generation, so we'll return a not implemented response
    return {
      success: false,
      error: "Video generation not directly supported through OpenRouter",
      provider: this.name
    };
  }
}
