import OpenAI from 'openai';
import { AIProvider, ProviderImageParams, ProviderRequestParams, ProviderResponse, ProviderTTSParams, ProviderVideoParams } from './provider';

export class OpenAIProvider extends AIProvider {
  private client: OpenAI;
  private rateLimitBackoff: number = 0;
  
  // Supported models
  private allowedModels = [
    'gpt-4o',      // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    'gpt-4',
    'gpt-3.5-turbo',
    'dall-e-3',
    'dall-e-2',
    'tts-1',
    'tts-1-hd'
  ];
  
  constructor(provider: { apiKey: string }) {
    super();
    this.client = new OpenAI({
      apiKey: provider.apiKey,
    });
  }
  
  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    try {
      // Apply rate limit backoff if necessary
      if (this.rateLimitBackoff > Date.now()) {
        return {
          success: false,
          error: {
            message: `Rate limit exceeded. Please try again after ${new Date(this.rateLimitBackoff).toLocaleTimeString()}`,
            code: 'rate_limited',
            retryAfter: Math.ceil((this.rateLimitBackoff - Date.now()) / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Sanitize input for security
      const sanitizedPrompt = this.sanitizeInput(params.prompt);
      
      // Default to gpt-4o if no model specified or validate the model
      const model = params.model || 'gpt-4o';
      if (!this.allowedModels.includes(model) && !model.startsWith('gpt-')) {
        return {
          success: false,
          error: {
            message: `Model "${model}" is not supported by OpenAI provider`,
            code: 'invalid_model'
          },
          provider: 'OpenAI'
        };
      }
      
      // Set sensible defaults
      const temperature = params.temperature ?? 0.7;
      const maxTokens = params.maxTokens ?? 1024;
      
      // Use a structured output if possible
      const useJSON = model === 'gpt-4o' || model === 'gpt-4' || model === 'gpt-3.5-turbo';
      
      // Make the API call
      const response = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: sanitizedPrompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
        ...(useJSON ? { response_format: { type: 'json_object' } } : {})
      });
      
      // Extract and return the result
      return {
        success: true,
        data: {
          text: response.choices[0]?.message?.content || '',
          model: model,
          usage: response.usage
        },
        provider: 'OpenAI'
      };
    } catch (error: any) {
      // Handle rate limiting specifically
      if (error?.status === 429 || (error?.message && error.message.includes('rate limit'))) {
        // Set a backoff period - default to 60 seconds if no retry-after header
        const retryAfter = error?.response?.headers?.['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : 60 * 1000;
          
        this.rateLimitBackoff = Date.now() + retryAfter;
        
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'rate_limited',
            retryAfter: Math.ceil(retryAfter / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Handle other errors
      return this.sanitizeError(error, 'OpenAI');
    }
  }
  
  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    try {
      // Apply rate limit backoff if necessary
      if (this.rateLimitBackoff > Date.now()) {
        return {
          success: false,
          error: {
            message: `Rate limit exceeded. Please try again after ${new Date(this.rateLimitBackoff).toLocaleTimeString()}`,
            code: 'rate_limited',
            retryAfter: Math.ceil((this.rateLimitBackoff - Date.now()) / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Sanitize input for security
      const sanitizedPrompt = this.sanitizeInput(params.prompt);
      
      // Determine the model (DALL-E 2 or 3)
      const model = params.model && params.model.includes('dall-e-3') ? 'dall-e-3' : 'dall-e-2';
      
      // Set quality and style for DALL-E 3
      const quality = model === 'dall-e-3' ? 'standard' : undefined;
      
      // OpenAI expects only 'vivid' or 'natural' for style
      let style: 'vivid' | 'natural' | null | undefined = undefined;
      if (params.style && model === 'dall-e-3') {
        style = params.style.toLowerCase() === 'vivid' ? 'vivid' : 
                params.style.toLowerCase() === 'natural' ? 'natural' : undefined;
      }
      
      // Determine image size
      // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
      // DALL-E 2 supports 256x256, 512x512, or 1024x1024
      let size: string;
      
      if (model === 'dall-e-3') {
        // For DALL-E 3, default to square, but allow wide or tall if requested
        if (params.width && params.height) {
          if (params.width > params.height) {
            size = '1792x1024';
          } else if (params.height > params.width) {
            size = '1024x1792';
          } else {
            size = '1024x1024';
          }
        } else {
          size = '1024x1024';
        }
      } else {
        // For DALL-E 2, only square sizes are supported
        if (params.width && params.width <= 256) {
          size = '256x256';
        } else if (params.width && params.width <= 512) {
          size = '512x512';
        } else {
          size = '1024x1024';
        }
      }
      
      // Make the API call
      // Construct the request parameters
      const requestParams: any = {
        model: model,
        prompt: sanitizedPrompt,
        n: 1,
        size: size as any,
        response_format: 'url'
      };
      
      // Only add quality and style for DALL-E 3
      if (model === 'dall-e-3') {
        if (quality) requestParams.quality = quality;
        if (style) requestParams.style = style;
      }
      
      // Make the API call
      const response = await this.client.images.generate(requestParams);
      
      // Return the result
      return {
        success: true,
        data: {
          url: response.data[0]?.url || '',
          model: model
        },
        provider: 'OpenAI'
      };
    } catch (error: any) {
      // Handle rate limiting specifically
      if (error?.status === 429 || (error?.message && error.message.includes('rate limit'))) {
        // Set a backoff period - default to 60 seconds if no retry-after header
        const retryAfter = error?.response?.headers?.['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : 60 * 1000;
          
        this.rateLimitBackoff = Date.now() + retryAfter;
        
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'rate_limited',
            retryAfter: Math.ceil(retryAfter / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Handle other errors
      return this.sanitizeError(error, 'OpenAI');
    }
  }
  
  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    try {
      // Apply rate limit backoff if necessary
      if (this.rateLimitBackoff > Date.now()) {
        return {
          success: false,
          error: {
            message: `Rate limit exceeded. Please try again after ${new Date(this.rateLimitBackoff).toLocaleTimeString()}`,
            code: 'rate_limited',
            retryAfter: Math.ceil((this.rateLimitBackoff - Date.now()) / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Sanitize input for security
      const sanitizedText = this.sanitizeInput(params.text);
      
      // Determine the model (tts-1 or tts-1-hd)
      const model = params.model && params.model.includes('hd') ? 'tts-1-hd' : 'tts-1';
      
      // Determine voice
      const voice = params.voice || 'alloy'; // OpenAI voices: alloy, echo, fable, onyx, nova, and shimmer
      
      // Make the API call
      const response = await this.client.audio.speech.create({
        model: model,
        voice: voice as any,
        input: sanitizedText
      });
      
      // Convert the binary data to base64
      const buffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(buffer).toString('base64');
      
      // Return the result
      return {
        success: true,
        data: {
          audio: base64Audio,
          format: 'mp3',
          model: model
        },
        provider: 'OpenAI'
      };
    } catch (error: any) {
      // Handle rate limiting specifically
      if (error?.status === 429 || (error?.message && error.message.includes('rate limit'))) {
        // Set a backoff period - default to 60 seconds if no retry-after header
        const retryAfter = error?.response?.headers?.['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : 60 * 1000;
          
        this.rateLimitBackoff = Date.now() + retryAfter;
        
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'rate_limited',
            retryAfter: Math.ceil(retryAfter / 1000)
          },
          provider: 'OpenAI',
          rateLimited: true
        };
      }
      
      // Handle other errors
      return this.sanitizeError(error, 'OpenAI');
    }
  }
  
  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // OpenAI doesn't currently offer video generation
    return {
      success: false,
      error: {
        message: 'Video generation is not supported by OpenAI provider',
        code: 'unsupported_feature'
      },
      provider: 'OpenAI'
    };
  }
}