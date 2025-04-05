import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { AiProvider } from "@shared/schema";

export class GoogleColabProvider extends AIProvider {
  private colabUrl: string;
  private apiKey: string;
  
  constructor(provider: AiProvider) {
    super(provider);
    // Get API info from environment variables
    this.colabUrl = process.env.GOOGLECOLAB_URL || '';
    this.apiKey = process.env.GOOGLECOLAB_API_KEY || '';
    
    if (!this.colabUrl || !this.apiKey) {
      console.warn(`Warning: GOOGLECOLAB_URL or GOOGLECOLAB_API_KEY is not set. ${provider.name} will not work correctly.`);
    }
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Check if API info is available
      if (!this.colabUrl || !this.apiKey) {
        return {
          success: false,
          error: "Google Colab configuration is missing",
          provider: this.name
        };
      }
      
      // Make request to custom Colab endpoint
      const response = await fetch(`${this.colabUrl}/generate_text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: params.prompt,
          max_tokens: params.maxTokens || 512,
          temperature: params.temperature || 0.7,
          model: params.model || "default"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "textGeneration", false);
        return {
          success: false,
          error: `Google Colab API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "textGeneration", true);
      
      return {
        success: true,
        result: data.generated_text,
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
      // Check if API info is available
      if (!this.colabUrl || !this.apiKey) {
        return {
          success: false,
          error: "Google Colab configuration is missing",
          provider: this.name
        };
      }
      
      // Make request to custom Colab endpoint
      const response = await fetch(`${this.colabUrl}/generate_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: params.prompt,
          size: params.size || "512x512",
          model: params.model || "default",
          style: params.style || "default"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "imageGeneration", false);
        return {
          success: false,
          error: `Google Colab API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "imageGeneration", true);
      
      return {
        success: true,
        result: data.image_base64, // Assuming the Colab returns base64 encoded image
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
    try {
      // Check if API info is available
      if (!this.colabUrl || !this.apiKey) {
        return {
          success: false,
          error: "Google Colab configuration is missing",
          provider: this.name
        };
      }
      
      // Make request to custom Colab endpoint
      const response = await fetch(`${this.colabUrl}/generate_speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          text: params.text,
          voice: params.voice || "default",
          speed: params.speed || 1.0
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "textToSpeech", false);
        return {
          success: false,
          error: `Google Colab API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "textToSpeech", true);
      
      return {
        success: true,
        result: data.audio_base64, // Assuming the Colab returns base64 encoded audio
        provider: this.name
      };
    } catch (error) {
      await this.recordUsage(params.user || 0, "textToSpeech", false);
      return {
        success: false,
        error: `Error with ${this.name}: ${error instanceof Error ? error.message : String(error)}`,
        provider: this.name
      };
    }
  }
  
  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    try {
      // Check if API info is available
      if (!this.colabUrl || !this.apiKey) {
        return {
          success: false,
          error: "Google Colab configuration is missing",
          provider: this.name
        };
      }
      
      // Make request to custom Colab endpoint
      const response = await fetch(`${this.colabUrl}/generate_video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt: params.prompt,
          duration: params.duration || 5, // seconds
          model: params.model || "default",
          style: params.style || "default"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "videoGeneration", false);
        return {
          success: false,
          error: `Google Colab API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "videoGeneration", true);
      
      return {
        success: true,
        result: data.video_url, // URL to the generated video
        provider: this.name
      };
    } catch (error) {
      await this.recordUsage(params.user || 0, "videoGeneration", false);
      return {
        success: false,
        error: `Error with ${this.name}: ${error instanceof Error ? error.message : String(error)}`,
        provider: this.name
      };
    }
  }
}
