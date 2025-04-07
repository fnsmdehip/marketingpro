import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupPaymentRoutes } from "./payment";
import ugcGeneratorRoutes from "./ai/ugc-generator";
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
      
      // Set a timeout for the scraping operation - 15 seconds max
      const timeoutMs = 15000; 
      
      // Check if the URL is from a site that likely blocks scraping
      const blockedDomains = ['amazon.com', 'amazon.', 'linkedin.com', 'facebook.com', 'instagram.com'];
      const isBlockedDomain = blockedDomains.some(domain => url.includes(domain));
      
      if (isBlockedDomain) {
        return res.status(400).json({
          success: false,
          error: { 
            message: "This website likely blocks scraping attempts. Try a different URL that allows content extraction." 
          }
        });
      }
      
      // Execute Python script to scrape the website with timeout
      const { spawn } = await import('child_process');
      
      // Create a promise that will be rejected after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Scraping timed out')), timeoutMs);
      });
      
      // Create a promise for the scraping process
      const scrapingPromise = new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['-c', `
import sys
import trafilatura
import requests

try:
    # Set up a session with custom headers
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.google.com/",
        "DNT": "1"
    })
    
    # Try to download with our custom session
    try:
        response = session.get("${url}", timeout=10)
        downloaded = response.text
    except Exception as e:
        print(f"Error with requests: {str(e)}", file=sys.stderr)
        # Fall back to trafilatura's built-in downloader
        downloaded = trafilatura.fetch_url("${url}")
    
    # Extract the main content
    text = trafilatura.extract(downloaded)
    if text:
        print(text)
    else:
        print("No content extracted from the URL")
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
        `]);
        
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
        
        if (data.includes("No content extracted from the URL")) {
          return res.status(200).json({
            success: true,
            data: "No content could be extracted. The website may be blocking scraping or has no main content."
          });
        }
        
        return res.json({
          success: true,
          data: data
        });
      } catch (error: any) {
        console.error('Scraping error:', error.message);
        if (error.message === 'Scraping timed out') {
          return res.status(408).json({
            success: false,
            error: { message: "Scraping operation timed out. The website may be too large or blocking our request." }
          });
        }
        
        return res.status(500).json({
          success: false,
          error: { message: `Error scraping website: ${error.message}` }
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
