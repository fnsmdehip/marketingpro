import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { aiManager } from './index';
import { storage } from '../storage';

const router = Router();

// Validation schemas for UGC generation
const ugcImageRequestSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
  model: z.string().optional(),
  size: z.string().optional(),
  style: z.string().optional(),
  userId: z.number().int().positive().optional()
});

const ugcVideoRequestSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
  model: z.string().optional(),
  duration: z.string().optional(),
  style: z.string().optional(),
  userId: z.number().int().positive().optional()
});

const ugcSpeechRequestSchema = z.object({
  text: z.string().min(5, "Text must be at least 5 characters"),
  model: z.string().optional(),
  voice: z.string().optional(),
  userId: z.number().int().positive().optional()
});

// Middleware to check authentication
const checkAuth = (req: Request, res: Response, next: Function) => {
  // Allow skipAuth for testing
  if (req.body.skipAuth === true) {
    return next();
  }
  
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: { message: "Unauthorized" } });
  }
  
  next();
};

// Circuit breaker pattern implementation
class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private circuitOpen: boolean = false;
  private readonly failureThreshold: number = 3;
  private readonly resetTimeout: number = 5 * 60 * 1000; // 5 minutes
  
  isOpen(): boolean {
    if (this.circuitOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.resetTimeout) {
        this.reset();
        return false;
      }
      return true;
    }
    return false;
  }
  
  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.circuitOpen = true;
      console.warn(`Circuit breaker opened after ${this.failureCount} consecutive failures`);
    }
  }
  
  recordSuccess(): void {
    if (this.failureCount > 0) {
      this.reset();
    }
  }
  
  reset(): void {
    this.failureCount = 0;
    this.circuitOpen = false;
  }
  
  getTimeUntilReset(): number {
    if (!this.circuitOpen) return 0;
    
    const now = Date.now();
    const timeElapsed = now - this.lastFailureTime;
    const timeRemaining = Math.max(0, this.resetTimeout - timeElapsed);
    
    return Math.ceil(timeRemaining / 1000); // Return seconds
  }
}

// Create circuit breakers for each generation type
const imageCircuitBreaker = new CircuitBreaker();
const videoCircuitBreaker = new CircuitBreaker();
const speechCircuitBreaker = new CircuitBreaker();

// Image generation endpoint
router.post('/generate/image', checkAuth, async (req: Request, res: Response) => {
  try {
    // Check circuit breaker
    if (imageCircuitBreaker.isOpen()) {
      const retryAfter = imageCircuitBreaker.getTimeUntilReset();
      return res.status(503).json({
        success: false,
        error: { 
          message: "Service temporarily unavailable. Too many failed requests.", 
          retryAfter 
        }
      });
    }
    
    // Validate request
    const { prompt, model, size, style } = ugcImageRequestSchema.parse(req.body);
    
    // Parse size to width and height if provided
    let width = 1024, height = 1024;
    if (size) {
      const dimensions = size.split('x');
      if (dimensions.length === 2) {
        width = parseInt(dimensions[0]);
        height = parseInt(dimensions[1]);
      }
    }
    
    // Call AI manager
    const result = await aiManager.generateImage({
      prompt,
      model,
      width,
      height,
      style,
      userId: req.user?.id
    });
    
    // Record usage
    if (result.success && req.user?.id) {
      await storage.createAiUsage({
        userId: req.user.id,
        provider: result.provider,
        requestType: 'image_generation',
        status: 'completed'
      });
    }
    
    // Handle circuit breaker logic
    if (result.success) {
      imageCircuitBreaker.recordSuccess();
    } else {
      // Only record failures for certain errors
      if (result.error?.code && ['internal_error', 'provider_error'].includes(result.error.code)) {
        imageCircuitBreaker.recordFailure();
      }
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error in UGC image generation:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid request data", details: error.errors }
      });
    }
    
    // General error
    res.status(500).json({
      success: false,
      error: { message: "Failed to generate image" }
    });
  }
});

// Video generation endpoint
router.post('/generate/video', checkAuth, async (req: Request, res: Response) => {
  try {
    // Check circuit breaker
    if (videoCircuitBreaker.isOpen()) {
      const retryAfter = videoCircuitBreaker.getTimeUntilReset();
      return res.status(503).json({
        success: false,
        error: { 
          message: "Service temporarily unavailable. Too many failed requests.", 
          retryAfter 
        }
      });
    }
    
    // Validate request
    const { prompt, model, duration, style } = ugcVideoRequestSchema.parse(req.body);
    
    // Call AI manager
    const result = await aiManager.generateVideo({
      prompt,
      model,
      duration: duration ? parseInt(duration) : undefined,
      style,
      userId: req.user?.id
    });
    
    // Record usage
    if (result.success && req.user?.id) {
      await storage.createAiUsage({
        userId: req.user.id,
        provider: result.provider,
        requestType: 'video_generation',
        status: 'completed'
      });
    }
    
    // Handle circuit breaker logic
    if (result.success) {
      videoCircuitBreaker.recordSuccess();
    } else {
      if (result.error?.code && ['internal_error', 'provider_error'].includes(result.error.code)) {
        videoCircuitBreaker.recordFailure();
      }
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error in UGC video generation:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid request data", details: error.errors }
      });
    }
    
    // General error
    res.status(500).json({
      success: false,
      error: { message: "Failed to generate video" }
    });
  }
});

// Speech generation endpoint
router.post('/generate/speech', checkAuth, async (req: Request, res: Response) => {
  try {
    // Check circuit breaker
    if (speechCircuitBreaker.isOpen()) {
      const retryAfter = speechCircuitBreaker.getTimeUntilReset();
      return res.status(503).json({
        success: false,
        error: { 
          message: "Service temporarily unavailable. Too many failed requests.", 
          retryAfter 
        }
      });
    }
    
    // Validate request
    const { text, model, voice } = ugcSpeechRequestSchema.parse(req.body);
    
    // Call AI manager
    const result = await aiManager.generateSpeech({
      text,
      model,
      voice,
      userId: req.user?.id
    });
    
    // Record usage
    if (result.success && req.user?.id) {
      await storage.createAiUsage({
        userId: req.user.id,
        provider: result.provider,
        requestType: 'speech_generation',
        status: 'completed'
      });
    }
    
    // Handle circuit breaker logic
    if (result.success) {
      speechCircuitBreaker.recordSuccess();
    } else {
      if (result.error?.code && ['internal_error', 'provider_error'].includes(result.error.code)) {
        speechCircuitBreaker.recordFailure();
      }
    }
    
    return res.json(result);
  } catch (error: any) {
    console.error('Error in UGC speech generation:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid request data", details: error.errors }
      });
    }
    
    // General error
    res.status(500).json({
      success: false,
      error: { message: "Failed to generate speech" }
    });
  }
});

export default router;