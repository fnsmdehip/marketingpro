import { AIProvider, ProviderRequestParams, ProviderResponse, ProviderImageParams, ProviderTTSParams, ProviderVideoParams } from "./provider";
import { AiProvider } from "@shared/schema";

export class ReplicateProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://api.replicate.com/v1";
  private pollInterval: number = 1000; // 1 second
  private maxPolls: number = 60; // Maximum number of polling attempts (60 seconds timeout)
  
  constructor(provider: AiProvider) {
    super(provider);
    // Get API key from environment variables
    this.apiKey = process.env.REPLICATE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn(`Warning: REPLICATE_API_KEY is not set. ${provider.name} will not work correctly.`);
    }
  }
  
  private async pollPrediction(predictionId: string): Promise<any> {
    let attempts = 0;
    
    while (attempts < this.maxPolls) {
      const response = await fetch(`${this.baseUrl}/predictions/${predictionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'succeeded') {
        return data.output;
      } else if (data.status === 'failed') {
        throw new Error(`Prediction failed: ${data.error || 'Unknown error'}`);
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      attempts++;
    }
    
    throw new Error('Prediction timed out after 60 seconds');
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "Replicate API key is not configured",
          provider: this.name
        };
      }
      
      // Default to a good model for text generation
      const model = params.model || "meta/llama-3-8b-instruct:1af982d1142d7bc818a4a05591a59ce28547352cf8c284407cdce4afec8441a0";
      
      // Start a prediction
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: model,
          input: {
            prompt: params.prompt,
            max_tokens: params.maxTokens || 512,
            temperature: params.temperature || 0.7
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "textGeneration", false);
        return {
          success: false,
          error: errorData.error || `Replicate API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const predictionData = await response.json();
      
      // Poll for the prediction result
      const output = await this.pollPrediction(predictionData.id);
      await this.recordUsage(params.user || 0, "textGeneration", true);
      
      // Format the output based on the model response
      let result: string;
      if (Array.isArray(output)) {
        result = output.join('');
      } else if (typeof output === 'string') {
        result = output;
      } else {
        result = JSON.stringify(output);
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
          error: "Replicate API key is not configured",
          provider: this.name
        };
      }
      
      // Default to a good model for image generation
      const model = params.model || "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f";
      
      // Map parameters
      const width = params.size?.split('x')[0] || '1024';
      const height = params.size?.split('x')[1] || '1024';
      
      // Start a prediction
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: model,
          input: {
            prompt: params.prompt,
            width: parseInt(width),
            height: parseInt(height),
            num_outputs: 1
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "imageGeneration", false);
        return {
          success: false,
          error: errorData.error || `Replicate API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const predictionData = await response.json();
      
      // Poll for the prediction result
      const output = await this.pollPrediction(predictionData.id);
      await this.recordUsage(params.user || 0, "imageGeneration", true);
      
      // Output will be an array of image URLs or a single URL
      const imageUrl = Array.isArray(output) ? output[0] : output;
      
      return {
        success: true,
        result: imageUrl,
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
          error: "Replicate API key is not configured",
          provider: this.name
        };
      }
      
      // Use a TTS model from Replicate
      const model = "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787";
      
      // Start a prediction
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: model,
          input: {
            text: params.text,
            voice_preset: params.voice || "v2/en_speaker_6"
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "textToSpeech", false);
        return {
          success: false,
          error: errorData.error || `Replicate API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const predictionData = await response.json();
      
      // Poll for the prediction result
      const output = await this.pollPrediction(predictionData.id);
      await this.recordUsage(params.user || 0, "textToSpeech", true);
      
      // Output is the audio URL
      const audioUrl = output.audio_out;
      
      return {
        success: true,
        result: audioUrl,
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
      // Check if API key is available
      if (!this.apiKey) {
        return {
          success: false,
          error: "Replicate API key is not configured",
          provider: this.name
        };
      }
      
      // Use a good video generation model
      const model = params.model || "cjwbw/damo-text-to-video:1e205ea73084bd17a0a3b43396e49ba0d6bc2e754e9283b2df49fad2dcf95755";
      
      // Start a prediction
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: model,
          input: {
            text_prompt: params.prompt,
            // Add more parameters based on specific model requirements
            num_frames: params.duration ? Math.min(params.duration * 30, 150) : 50
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        await this.recordUsage(params.user || 0, "videoGeneration", false);
        return {
          success: false,
          error: errorData.error || `Replicate API error: ${response.status}`,
          provider: this.name
        };
      }
      
      const predictionData = await response.json();
      
      // Poll for the prediction result
      const output = await this.pollPrediction(predictionData.id);
      await this.recordUsage(params.user || 0, "videoGeneration", true);
      
      // Output will be a video URL
      const videoUrl = Array.isArray(output) ? output[0] : output;
      
      return {
        success: true,
        result: videoUrl,
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
