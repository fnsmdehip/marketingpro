import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupPaymentRoutes } from "./payment";
import ugcGeneratorRoutes from "./ai/ugc-generator";
import contentRoutes from "./contentRoutes";
import analyticsRoutes from "./analyticsRoutes";
import { AIManager, aiManager } from "./ai/index";
import { Request, Response } from "express";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Setup authentication routes
  setupAuth(app);

  // Setup payment routes (Stripe integration)
  setupPaymentRoutes(app);

  // Mount UGC generator routes
  app.use("/api/ai", ugcGeneratorRoutes);
  
  // Mount content management routes
  app.use(contentRoutes);
  
  // Mount analytics routes
  app.use(analyticsRoutes);

  // Add direct text generation endpoint
  app.post("/api/ai/generate/text", async (req: Request, res: Response) => {
    try {
      const { prompt, model, temperature, userId } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: { message: "Prompt is required" }
        });
      }
      
      console.log("[AI Generate Text] Request received:", {
        promptLength: prompt.length,
        model: model || "default model",
        temperature: temperature || "default temp"
      });
      
      // Load context file for AI guidance
      let contextGuidelines = "";
      try {
        // Read context guidelines from the documentation file
        const fs = require('fs');
        const path = require('path');
        contextGuidelines = fs.readFileSync(path.join(__dirname, '../docs/context-guidelines.md'), 'utf8');
        console.log("[AI Generate Text] Loaded context guidelines successfully");
      } catch (error: any) {
        const contextError = error as Error;
        console.warn("[AI Generate Text] Could not load context guidelines:", contextError.message);
        // Proceed without context guidelines
      }
      
      // Add context to the prompt if available
      let enhancedPrompt = prompt;
      if (contextGuidelines) {
        enhancedPrompt = `<context>\n${contextGuidelines}\n</context>\n\nPlease follow the guidelines above when generating the following content:\n\n${prompt}`;
      }
      
      // Generate text with enhanced prompt
      console.log("[AI Generate Text] Sending request to AI Manager");
      const result = await aiManager.generateText({
        prompt: enhancedPrompt,
        model,
        temperature: temperature || 0.7,
        userId: req.user?.id || userId
      });
      
      if (result.success) {
        console.log("[AI Generate Text] Generated content successfully, length:", result.data?.length || 0);
      } else {
        console.error("[AI Generate Text] Failed to generate content:", result.error);
      }

      return res.json(result);
    } catch (error: any) {
      console.error("Error in text generation endpoint:", error);
      return res.status(500).json({
        success: false,
        error: { message: error.message || "Internal server error" }
      });
    }
  });

  // API endpoint to get AI providers
  app.get("/api/ai/providers", async (_req: Request, res: Response) => {
    try {
      // Initialize AI manager if needed
      if (!aiManager) {
        return res.json([]);
      }
      
      await aiManager.initialize();
      
      // Get available AI providers from the database
      const providers = await storage.getActiveAiProviders();
      
      // Format providers for frontend consumption with default values for missing fields
      const formattedProviders = providers.map(provider => {
        // Extract config data or use defaults
        const config = provider.config ? 
          (typeof provider.config === 'string' ? 
            JSON.parse(provider.config) : provider.config) : {};
            
        const usage = config.usage || { hourly: 0, daily: 0 };
        const limits = config.limits || { hourlyLimit: 100, dailyLimit: 1000 };
        
        return {
          id: provider.id,
          name: provider.name,
          status: provider.isActive ? 'active' : 'inactive',
          usage: {
            hourly: usage.hourly || 0,
            daily: usage.daily || 0,
            percentage: Math.min(100, Math.round(((usage.hourly || 0) / (limits.hourlyLimit || 100)) * 100))
          }
        };
      });
      
      res.json(formattedProviders);
    } catch (error: any) {
      console.error("Error fetching AI providers:", error);
      res.status(500).json({ message: "Error fetching AI providers" });
    }
  });
  
  // Web Scraper API endpoint
  app.post("/api/web-scraper", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          error: { message: "URL is required" }
        });
      }
      
      // Validate URL
      try {
        new URL(url);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: { message: "Invalid URL format" }
        });
      }
      
      // Set a timeout for the scraping operation - 30 seconds max
      const timeoutMs = 30000; 
      
      // Execute Python script to scrape the website with timeout
      const { spawn } = await import('child_process');
      
      // Create a promise that will be rejected after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scraping timed out')), timeoutMs);
      });
      
      // Create a promise for the scraping process using our enhanced web_scraper.py
      const scrapingPromise = new Promise((resolve, reject) => {
        // Use the dedicated web_scraper.py file that has enhanced capabilities
        const pythonProcess = spawn('python', ['server/web_scraper.py', url]);
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(stderr || 'Unknown error occurred'));
          } else {
            resolve(stdout);
          }
        });
        
        pythonProcess.on('error', (err) => {
          reject(err);
        });
      });
      
      // Race between the scraping process and the timeout
      try {
        const data = await Promise.race([scrapingPromise, timeoutPromise]) as string;
        
        // Check for common error messages or empty content
        if (!data || 
            data.trim().length === 0 || 
            data.includes("No content extracted") || 
            data.includes("Failed to extract meaningful content")) {
          
          return res.status(404).json({
            success: false,
            error: { 
              message: "No meaningful content could be extracted from this URL. The site may have anti-scraping protections." 
            }
          });
        }
        
        return res.json({
          success: true,
          data: data
        });
      } catch (error: any) {
        console.error('Scraping error:', error.message);
        
        // Provide more helpful error messages based on common issues
        let userFriendlyMessage = "Failed to scrape website.";
        
        if (error.message === 'Scraping timed out') {
          userFriendlyMessage = "Scraping operation timed out. The website may be too large or blocking our request.";
        } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
          userFriendlyMessage = "This website is actively blocking scraping attempts. Try a different website.";
        } else if (error.message.includes("404") || error.message.includes("Not Found")) {
          userFriendlyMessage = "The requested page was not found. Please check the URL and try again.";
        } else if (error.message.includes("Certificate") || error.message.includes("SSL")) {
          userFriendlyMessage = "There was a security issue connecting to this website. Try a different URL.";
        }
        
        return res.status(500).json({
          success: false,
          error: { 
            message: userFriendlyMessage,
            details: error.message || "Unknown error" 
          }
        });
      }
    } catch (error: any) {
      console.error("Error in web scraper endpoint:", error);
      return res.status(500).json({
        success: false,
        error: { message: error.message || "Internal server error" }
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
