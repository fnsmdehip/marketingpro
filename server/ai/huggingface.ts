import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { AiProvider } from "@shared/schema";

export class HuggingFaceProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://api-inference.huggingface.co/models";
  
  constructor(provider: AiProvider) {
    super(provider);
    // Get API key from environment variables
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn(`Warning: HUGGINGFACE_API_KEY is not set. ${provider.name} will not work correctly.`);
    }
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "Hugging Face API key is not configured",
          provider: this.name
        };
      }
      
      // Use specified model or default to a good text generation model
      const model = params.model || "mistralai/Mistral-7B-Instruct-v0.2";
      
      // Make request to Hugging Face
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          inputs: params.prompt,
          parameters: {
            max_new_tokens: params.maxTokens || 512,
            temperature: params.temperature || 0.7,
            return_full_text: false
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "textGeneration", false);
        return {
          success: false,
          error: `Hugging Face API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      const data = await response.json();
      await this.recordUsage(params.user || 0, "textGeneration", true);
      
      // Format varies depending on the model, handle both array and object responses
      let result: string;
      if (Array.isArray(data)) {
        result = data[0].generated_text || '';
      } else {
        result = data.generated_text || '';
      }
      
      return {
        success: true,
        result,
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
          error: "Hugging Face API key is not configured",
          provider: this.name
        };
      }
      
      // Use specified model or default to a good image generation model
      const model = params.model || "stabilityai/stable-diffusion-xl-base-1.0";
      
      // Make request to Hugging Face
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          inputs: params.prompt,
          parameters: {
            guidance_scale: 7.5,
            num_inference_steps: 50
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "imageGeneration", false);
        return {
          success: false,
          error: `Hugging Face API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      // Response is the binary image data
      const imageBlob = await response.blob();
      
      // Convert blob to base64 for easier handling
      const arrayBuffer = await imageBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      
      await this.recordUsage(params.user || 0, "imageGeneration", true);
      
      return {
        success: true,
        result: base64Image,
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
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "Hugging Face API key is not configured",
          provider: this.name
        };
      }
      
      // Use a TTS model from Hugging Face (XTTS-v2 is a good one)
      const model = "coqui/XTTS-v2";
      
      // Make request to Hugging Face
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            text: params.text,
            speaker: params.voice || "default",
            language: "en"
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "textToSpeech", false);
        return {
          success: false,
          error: `Hugging Face API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      // Response is the binary audio data
      const audioBlob = await response.blob();
      
      // Convert blob to base64 for easier handling
      const arrayBuffer = await audioBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Audio = `data:audio/wav;base64,${buffer.toString('base64')}`;
      
      await this.recordUsage(params.user || 0, "textToSpeech", true);
      
      return {
        success: true,
        result: base64Audio,
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
    // Hugging Face doesn't have great video generation models yet, but we can use text-to-video models
    try {
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "Hugging Face API key is not configured",
          provider: this.name
        };
      }
      
      // Use a video generation model from Hugging Face
      const model = params.model || "damo-vilab/text-to-video-ms-1.7b";
      
      // Make request to Hugging Face
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: params.prompt
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        await this.recordUsage(params.user || 0, "videoGeneration", false);
        return {
          success: false,
          error: `Hugging Face API error: ${response.status} - ${errorText}`,
          provider: this.name
        };
      }
      
      // Response should be a video file
      const videoBlob = await response.blob();
      
      // Convert blob to base64 for easier handling
      const arrayBuffer = await videoBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Video = `data:video/mp4;base64,${buffer.toString('base64')}`;
      
      await this.recordUsage(params.user || 0, "videoGeneration", true);
      
      return {
        success: true,
        result: base64Video,
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
