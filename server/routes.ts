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

      const result = await aiManager.generateText({
        prompt,
        model,
        temperature: temperature || 0.7,
        userId: req.user?.id || userId
      });

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
      
      // Execute Python script to scrape the website
      // Using import.meta.require for ESM compatibility
      const { spawnSync } = await import('child_process');
      const result = spawnSync('python', ['-c', `
import sys
import trafilatura

try:
    # Send a request to the website
    downloaded = trafilatura.fetch_url("${url}")
    text = trafilatura.extract(downloaded)
    if text:
        print(text)
    else:
        print("No content extracted from the URL")
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
      `]);
      
      if (result.status !== 0) {
        console.error(`Web scraper error: ${result.stderr.toString()}`);
        return res.status(500).json({
          success: false,
          error: { message: `Error scraping website: ${result.stderr.toString()}` }
        });
      }
      
      const data = result.stdout.toString();
      
      // Return the scraped content
      return res.json({
        success: true,
        data: data
      });
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
