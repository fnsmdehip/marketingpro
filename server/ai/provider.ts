/**
 * Base parameters interface for AI provider requests
 */
export interface ProviderRequestParams {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Parameters interface for image generation
 */
export interface ProviderImageParams {
  prompt: string;
  model?: string;
  size?: string;
  style?: string;
}

/**
 * Parameters interface for text-to-speech generation
 */
export interface ProviderTTSParams {
  text: string;
  voice?: string;
  speed?: number;
}

/**
 * Parameters interface for video generation
 */
export interface ProviderVideoParams {
  prompt: string;
  duration?: number;
  style?: string;
}

/**
 * Response interface from AI providers
 */
export interface ProviderResponse {
  success: boolean;
  data?: string;
  provider: string;
  model?: string;
  error?: {
    message: string;
    code?: string;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Abstract base class for AI providers
 * All AI providers must implement these methods
 */
export abstract class AIProvider {
  /**
   * Generate text content from a prompt
   */
  abstract textGeneration(params: ProviderRequestParams): Promise<ProviderResponse>;
  
  /**
   * Generate an image from a text prompt
   */
  abstract imageGeneration(params: ProviderImageParams): Promise<ProviderResponse>;
  
  /**
   * Convert text to speech audio
   */
  abstract textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse>;
  
  /**
   * Generate a video from a text prompt
   */
  abstract videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse>;
}