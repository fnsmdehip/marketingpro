import { storage } from "../storage";
import { AiProvider } from "@shared/schema";

// Types for AI provider operations
export type ProviderRequestParams = {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  user?: number;
};

export type ProviderImageParams = {
  prompt: string;
  model?: string;
  size?: string;
  quality?: string;
  style?: string;
  user?: number;
};

export type ProviderTTSParams = {
  text: string;
  voice?: string;
  speed?: number;
  user?: number;
};

export type ProviderVideoParams = {
  prompt: string;
  model?: string;
  duration?: number;
  style?: string;
  user?: number;
};

export interface ProviderResponse {
  success: boolean;
  result?: string | string[];
  error?: string;
  provider: string;
}

// Base provider class
export abstract class AIProvider {
  protected provider: AiProvider;
  protected hourlyRequests: number[];
  protected dailyRequests: number[];
  
  constructor(provider: AiProvider) {
    this.provider = provider;
    this.hourlyRequests = [];
    this.dailyRequests = [];
  }
  
  get name(): string {
    return this.provider.name;
  }
  
  get status(): string {
    return this.provider.status;
  }
  
  get hourlyLimit(): number {
    return this.provider.hourlyLimit;
  }
  
  get dailyLimit(): number {
    return this.provider.dailyLimit;
  }
  
  get usage(): {hourly: number, daily: number, percentage: number} {
    this.updateRequestCounters();
    
    return {
      hourly: this.hourlyRequests.length,
      daily: this.dailyRequests.length,
      percentage: Math.round((this.dailyRequests.length / this.dailyLimit) * 100)
    };
  }
  
  async recordUsage(userId: number, requestType: string, success: boolean): Promise<void> {
    // Record usage in the database
    await storage.createAiUsage({
      userId,
      provider: this.provider.name,
      requestType,
      requestCount: 1,
      status: success ? "success" : "failed"
    });
    
    // Update internal counters
    const now = Date.now();
    this.hourlyRequests.push(now);
    this.dailyRequests.push(now);
    
    // Clean up old requests
    this.updateRequestCounters();
  }
  
  // Check if provider is available for use
  isAvailable(): boolean {
    // Update counters before checking
    this.updateRequestCounters();
    
    return this.provider.status === 'active' && 
           this.hourlyRequests.length < this.hourlyLimit &&
           this.dailyRequests.length < this.dailyLimit;
  }
  
  // Update the request counters by removing old timestamps
  private updateRequestCounters(): void {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;
    
    // Keep only requests within the last hour
    this.hourlyRequests = this.hourlyRequests.filter(time => time >= hourAgo);
    
    // Keep only requests within the last 24 hours
    this.dailyRequests = this.dailyRequests.filter(time => time >= dayAgo);
  }
  
  // Abstract methods that should be implemented by specific providers
  abstract textGeneration(params: ProviderRequestParams): Promise<ProviderResponse>;
  abstract imageGeneration(params: ProviderImageParams): Promise<ProviderResponse>;
  abstract textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse>;
  abstract videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse>;
}
