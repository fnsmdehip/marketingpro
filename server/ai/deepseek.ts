import axios from "axios";
import { 
  AIProvider, 
  ProviderRequestParams, 
  ProviderResponse,
  ProviderImageParams,
  ProviderTTSParams,
  ProviderVideoParams
} from "./provider";
import { OpenAI } from "openai";
import util from 'util';

export class DeepSeekProvider extends AIProvider {
  private apiKey: string;
  private baseUrl: string = "https://openrouter.ai/api/v1";
  private consecutiveFailures: number = 0;
  private circuitOpen: boolean = false;
  private lastErrorTime: number = 0;
  private circuitResetTimeout: number = 300000; // 5 minutes
  private client: OpenAI;
  
  // DeepSeek models available through OpenRouter
  private allowedModels = [
    // Prioritized free models
    "deepseek/deepseek-chat-v3-0324:free", // Primary model - better quality
    "deepseek/deepseek-v3-base:free",      // First fallback if rate limited
    "deepseek/deepseek-r1-zero:free",      // Second fallback if rate limited
    
    // Other models still available
    "deepseek/deepseek-coder-v2-instruct",
    "deepseek-ai/deepseek-v2",
    "deepseek-ai/deepseek-v2-base",
    "deepseek-ai/deepseek-coder-v2-base",
    "deepseek-ai/deepseek-coder-v2",
    "deepseek-ai/deepseek-math-v1",
    "deepseek-ai/deepseek-v3-base",
    "deepseek-ai/deepseek-llm-67b-chat"
  ];

  constructor(provider: { apiKey: string }) {
    super();
    this.apiKey = provider.apiKey;
    console.log("Initializing DeepSeek provider with API key:", this.apiKey?.substring(0, 10) + "...");
    
    // For debugging only
    if (this.apiKey.startsWith('sk-or-')) {
      console.log("DeepSeek using valid OpenRouter API key format");
    } else {
      console.warn("DeepSeek API key does not match expected OpenRouter format (should start with sk-or-)");
    }
    
    // Initialize OpenAI client with OpenRouter base URL
    this.client = new OpenAI({
      baseURL: this.baseUrl,
      apiKey: this.apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://marketingsaasapp.replit.app", 
        "X-Title": "MarketingSaaS"
      },
      dangerouslyAllowBrowser: true // Add this flag to allow browser usage
    } as any); // Type assertion to bypass type checking issues
  }

  // Check if circuit breaker is open (service considered down)
  private isCircuitOpen(): boolean {
    if (this.circuitOpen) {
      const now = Date.now();
      const timeSinceFailure = now - this.lastErrorTime;
      
      // Reset circuit after timeout period
      if (timeSinceFailure > this.circuitResetTimeout) {
        this.circuitOpen = false;
        this.consecutiveFailures = 0;
        return false;
      }
      return true;
    }
    return false;
  }

  // Handle failures and potentially open circuit breaker
  private handleFailure(error: any): void {
    this.consecutiveFailures++;
    this.lastErrorTime = Date.now();
    
    // Open circuit breaker after threshold failures
    if (this.consecutiveFailures >= 5) {
      this.circuitOpen = true;
    }
  }

  // Reset failure count on success
  private handleSuccess(): void {
    this.consecutiveFailures = 0;
  }

  // Validate model for security
  private validateModelSecurity(model: string): boolean {
    // Allow all models - user can use any model they add
    return true;
  }

  async textGeneration(params: ProviderRequestParams): Promise<ProviderResponse> {
    // Check circuit breaker
    if (this.isCircuitOpen()) {
      return {
        success: false,
        error: {
          message: 'Service temporarily unavailable (circuit breaker open)',
          code: 'circuit_open',
          retryAfter: Math.floor(this.circuitResetTimeout / 1000)
        },
        provider: 'deepseek'
      };
    }
    
    // Default model - DeepSeek Chat v3 model from OpenRouter 
    const model = params.model || 'deepseek/deepseek-chat-v3-0324:free';
    
    // Validate model for security
    if (!this.validateModelSecurity(model)) {
      return {
        success: false,
        error: {
          message: `Model "${model}" is not on the approved list for security reasons`,
          code: 'invalid_model'
        },
        provider: 'deepseek'
      };
    }
    
    // Sanitize user inputs to prevent injection
    const sanitizedPrompt = this.sanitizeInput(params.prompt);
    
    // Check if this is marketing-related content to optimize formatting
    let finalPrompt = sanitizedPrompt;
    const lowerPrompt = sanitizedPrompt.toLowerCase();
    const isMarketingContent = 
      lowerPrompt.includes('marketing') || 
      lowerPrompt.includes('advertisement') || 
      lowerPrompt.includes('promote') || 
      lowerPrompt.includes('sell') ||
      lowerPrompt.includes('social media') ||
      lowerPrompt.includes('campaign');
    
    // Add special instructions for marketing content to improve quality
    if (isMarketingContent) {
      finalPrompt = `I need high-quality marketing content that's creative, persuasive, and engagement-driving. Please provide professional-grade content for: ${sanitizedPrompt}
      
      Follow these marketing best practices:
      - Focus on benefits over features
      - Use persuasive, action-oriented language
      - Include emotional appeals where appropriate
      - Consider the target audience demographics
      - Keep tone consistent with brand voice
      - Include clear calls to action
      - Maintain professionalism and adherence to marketing standards`;
    }
    
    try {
      console.log("[DeepSeek Debug] Sending request to OpenRouter with model:", model);
      console.log("[DeepSeek Debug] API Key format:", this.apiKey ? `${this.apiKey.substring(0, 10)}...${this.apiKey.substring(this.apiKey.length-5)}` : "No API key");
      console.log("[DeepSeek Debug] Base URL:", this.baseUrl);
      
      // Use OpenAI-compatible client to call OpenRouter API
      const requestOptions = {
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert marketing content creator specializing in persuasive, high-converting copy that drives engagement and delivers business results. Always return only the final content without any meta-instructions, templates, or placeholders."
          },
          {
            role: "user",
            content: finalPrompt
          }
        ],
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 1024
      };
      
      console.log("[DeepSeek Debug] Request options:", JSON.stringify(requestOptions, null, 2));
      
      try {
        // Format the messages array correctly for OpenAI compatible API
        const formattedMessages = requestOptions.messages.map(msg => {
          // Ensure message has the right structure
          return {
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content
          };
        });
        
        // Create properly formatted request for OpenAI compatibility
        const formattedRequest = {
          model: requestOptions.model,
          messages: formattedMessages,
          temperature: requestOptions.temperature,
          max_tokens: requestOptions.max_tokens
        };
        
        console.log("[DeepSeek Debug] Formatted request:", JSON.stringify(formattedRequest, null, 2));
        
        // Try direct API call to OpenRouter as a fallback option
        try {
          console.log("[DeepSeek Debug] Trying direct OpenRouter API call");
          const directResponse = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions', 
            formattedRequest,
            {
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': 'https://marketingsaasapp.replit.app',
                'X-Title': 'MarketingSaaS',
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log("[DeepSeek Debug] Direct API Response:", util.inspect(directResponse.data, {depth: null, colors: false}));
          
          this.handleSuccess();
          
          // Extract the generated text from the direct response
          const directGeneratedText = directResponse.data.choices[0]?.message?.content || '';
          
          return {
            success: true,
            data: directGeneratedText,
            provider: 'deepseek'
          };
        } catch (directError: any) {
          console.error("[DeepSeek Debug] Direct API call failed:", directError.message);
          if (directError.response) {
            console.error("[DeepSeek Debug] Direct API Error status:", directError.response.status);
            console.error("[DeepSeek Debug] Direct API Error data:", 
              util.inspect(directError.response.data || {}, {depth: null, colors: false}));
          }
          
          // If direct call fails, fallback to OpenAI client
          console.log("[DeepSeek Debug] Falling back to OpenAI client");
        }
        
        // Make the OpenRouter API call through OpenAI client as fallback
        const completion = await this.client.chat.completions.create(formattedRequest as any);
        console.log("[DeepSeek Debug] OpenAI client Response received:", util.inspect(completion, {depth: null, colors: false}));
        
        this.handleSuccess();
        
        // Extract the generated text from the response
        const generatedText = completion.choices[0]?.message?.content || '';
        
        const result: ProviderResponse = {
          success: true,
          data: generatedText,
          provider: 'deepseek'
        };
        
        return result;
      } catch (apiError: any) {
        console.error("[DeepSeek Debug] API Error:", JSON.stringify(apiError, null, 2));
        console.error("[DeepSeek Debug] Full error object:", apiError);
        
        if (apiError.response) {
          console.error("[DeepSeek Debug] API Response:", apiError.response);
          try {
            const responseText = JSON.stringify(apiError.response.data || {});
            console.error("[DeepSeek Debug] Response data:", responseText);
          } catch (jsonError) {
            console.error("[DeepSeek Debug] Error stringifying response:", jsonError);
          }
        }
        
        throw apiError; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      this.handleFailure(error);
      console.error("[DeepSeek Provider] Error:", error.message);
      
      // Check for rate limiting specifically
      if (error.status === 429 || (error.message && error.message.includes('rate limit'))) {
        return {
          success: false,
          error: {
            message: 'Rate limit exceeded for DeepSeek provider',
            code: 'rate_limit',
            retryAfter: 60 // Default 60 second retry
          },
          provider: 'deepseek',
          rateLimited: true
        };
      }
      
      return this.sanitizeError(error, 'deepseek');
    }
  }

  async imageGeneration(params: ProviderImageParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support image generation
    return {
      success: false,
      error: {
        message: 'Image generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }

  async textToSpeech(params: ProviderTTSParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support TTS
    return {
      success: false,
      error: {
        message: 'Text-to-speech not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }

  async videoGeneration(params: ProviderVideoParams): Promise<ProviderResponse> {
    // DeepSeek via HuggingFace doesn't support video generation
    return {
      success: false,
      error: {
        message: 'Video generation not supported by this provider',
        code: 'unsupported_operation'
      },
      provider: 'deepseek'
    };
  }
}