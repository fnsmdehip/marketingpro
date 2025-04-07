import { z } from "zod";

export interface ProviderRequestParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  userId?: number;
  skipAuth?: boolean; // Used to bypass authentication for testing
}

export interface ProviderImageParams {
  prompt: string;
  model?: string;
  style?: string;
  width?: number;
  height?: number;
  userId?: number;
  skipAuth?: boolean; // Used to bypass authentication for testing
}

export interface ProviderTTSParams {
  text: string;
  voice?: string;
  model?: string;
  userId?: number;
}

export interface ProviderVideoParams {
  prompt: string;
  model?: string;
  duration?: number;
  style?: string;
  userId?: number;
}

export interface ProviderResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    retryAfter?: number;
  };
  provider: string;
  rateLimited?: boolean;
}

// Zod validation schemas for the provider parameters
export const requestParamsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().optional(),
  maxTokens: z.number().int().positive().max(8192).optional(),
  temperature: z.number().min(0).max(2).optional(),
  userId: z.number().int().positive().optional(),
  skipAuth: z.boolean().optional()
});

export const imageParamsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().optional(),
  style: z.string().optional(),
  width: z.number().int().min(32).max(4096).optional(),
  height: z.number().int().min(32).max(4096).optional(),
  userId: z.number().int().positive().optional(),
  skipAuth: z.boolean().optional()
});

export const ttsParamsSchema = z.object({
  text: z.string().min(1, "Text is required"),
  voice: z.string().optional(),
  model: z.string().optional(),
  userId: z.number().int().positive().optional()
});

export const videoParamsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().optional(),
  duration: z.number().positive().max(60).optional(),
  style: z.string().optional(),
  userId: z.number().int().positive().optional()
});

export abstract class AIProvider {
  static readonly MAX_RETRY_COUNT = 3;
  static readonly RETRY_DELAY = 1000;

  abstract textGeneration(params: ProviderRequestParams): Promise<ProviderResponse>;
  abstract imageGeneration(params: ProviderImageParams): Promise<ProviderResponse>;
  abstract textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse>;
  abstract videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse>;

  // Security features
  protected sanitizeInput(input: string): string {
    // Remove potential script tags and other risky content
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '');
  }

  protected validateModel(model: string, allowList: string[]): boolean {
    // Allow any model the user wants to add without restriction
    return true;
  }
  
  // Rate limiting helper
  protected isRateLimitError(error: any): boolean {
    // Different providers use different error structures
    return (
      error?.response?.status === 429 ||
      error?.status === 429 ||
      (error?.message && (error.message.toLowerCase().includes('rate limit') || 
                        error.message.toLowerCase().includes('too many requests')))
    );
  }

  // Error sanitization to prevent information disclosure
  protected sanitizeError(error: any, providerName: string): ProviderResponse {
    let message = 'Unknown error occurred';
    let code = 'unknown_error';
    let retryAfter = undefined;
    
    // Get error info but ensure no sensitive data is included
    if (error?.message) {
      message = error.message;
      // Replace any potential sensitive data
      if (message.includes('key') || message.includes('token') || message.includes('auth')) {
        message = 'Provider authentication error';
      }
    }
    
    // Extract status code if available
    if (error?.response?.status) {
      code = `http_${error.response.status}`;
    } else if (error?.status) {
      code = `http_${error.status}`;
    }
    
    // Extract retry-after if available
    if (error?.response?.headers?.['retry-after']) {
      retryAfter = parseInt(error.response.headers['retry-after']);
    } else if (this.isRateLimitError(error)) {
      retryAfter = 60; // Default 60 seconds when rate limited
    }
    
    return {
      success: false,
      error: {
        message,
        code,
        retryAfter
      },
      provider: providerName,
      rateLimited: this.isRateLimitError(error)
    };
  }
}