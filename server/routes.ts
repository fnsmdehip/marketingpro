import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupPaymentRoutes } from "./payment";
import { storage } from "./storage";
import { aiManager } from "./ai";
import { z } from "zod";
import { insertContentSchema, insertPlatformSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Setup payment routes
  setupPaymentRoutes(app);
  
  // Initialize AI manager
  await aiManager.initialize();
  
  // Dashboard data route
  app.get("/api/dashboard", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.id;
      
      // Get platform connections
      const platforms = await storage.getPlatformsByUserId(userId);
      
      // Get upcoming content
      const upcomingContent = await storage.getUpcomingContentsByUserId(userId);
      
      // Get AI provider status
      const aiProviders = await aiManager.getProvidersStatus();
      
      res.json({
        platforms,
        upcomingContent,
        aiProviders
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });
  
  // Content Routes
  app.get("/api/content", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.id;
      const content = await storage.getContentsByUserId(userId);
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  
  app.post("/api/content", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Validate request body
      const validatedData = insertContentSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const content = await storage.createContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content" });
    }
  });
  
  app.get("/api/content/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      if (content.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  
  app.put("/api/content/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      if (content.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Validate request body (exclude userId from updates)
      const { userId, ...updates } = req.body;
      
      const updatedContent = await storage.updateContent(contentId, updates);
      res.json(updatedContent);
    } catch (error) {
      console.error("Error updating content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update content" });
    }
  });
  
  app.delete("/api/content/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const contentId = parseInt(req.params.id);
      const content = await storage.getContent(contentId);
      
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      if (content.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteContent(contentId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });
  
  // Platform Routes
  app.get("/api/platforms", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.user.id;
      const platforms = await storage.getPlatformsByUserId(userId);
      
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ message: "Failed to fetch platforms" });
    }
  });
  
  app.post("/api/platforms", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Validate request body
      const validatedData = insertPlatformSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      // Check if platform already exists for this user
      const existingPlatform = await storage.getPlatformByUserAndType(req.user.id, validatedData.platform);
      
      if (existingPlatform) {
        return res.status(400).json({ message: "Platform connection already exists" });
      }
      
      const platform = await storage.createPlatform(validatedData);
      res.status(201).json(platform);
    } catch (error) {
      console.error("Error creating platform:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid platform data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create platform" });
    }
  });
  
  app.delete("/api/platforms/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const platformId = parseInt(req.params.id);
      const platform = await storage.getPlatform(platformId);
      
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      if (platform.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deletePlatform(platformId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting platform:", error);
      res.status(500).json({ message: "Failed to delete platform" });
    }
  });
  
  // AI Routes
  app.get("/api/ai/providers", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const providers = await aiManager.getProvidersStatus();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching AI providers:", error);
      res.status(500).json({ message: "Failed to fetch AI providers" });
    }
  });
  
  app.post("/api/ai/generate/text", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { prompt, model, maxTokens, temperature } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const result = await aiManager.generateText({
        prompt,
        model,
        maxTokens,
        temperature,
        user: req.user.id
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error generating text:", error);
      res.status(500).json({ message: "Failed to generate text" });
    }
  });
  
  app.post("/api/ai/generate/image", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { prompt, model, size, quality, style } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const result = await aiManager.generateImage({
        prompt,
        model,
        size,
        quality,
        style,
        user: req.user.id
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });
  
  app.post("/api/ai/generate/speech", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { text, voice, speed } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      const result = await aiManager.generateSpeech({
        text,
        voice,
        speed,
        user: req.user.id
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({ message: "Failed to generate speech" });
    }
  });
  
  app.post("/api/ai/generate/video", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { prompt, model, duration, style } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const result = await aiManager.generateVideo({
        prompt,
        model,
        duration,
        style,
        user: req.user.id
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error generating video:", error);
      res.status(500).json({ message: "Failed to generate video" });
    }
  });
  
  app.post("/api/ai/enhance/content", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { content, enhancement, platform } = req.body;
      
      if (!content || !enhancement) {
        return res.status(400).json({ message: "Content and enhancement type are required" });
      }
      
      // Create a prompt based on enhancement type
      let prompt = '';
      
      switch (enhancement) {
        case 'optimize':
          prompt = `Optimize this content for maximum engagement on ${platform || 'social media'}: "${content}"`;
          break;
        case 'rewrite':
          prompt = `Rewrite this content for better clarity and readability: "${content}"`;
          break;
        case 'emotions':
          prompt = `Rewrite this content to include emotional triggers that drive engagement: "${content}"`;
          break;
        case 'hashtags':
          prompt = `Generate 5-7 optimal hashtags for this content: "${content}"`;
          break;
        case 'questions':
          prompt = `Convert this statement into an engaging question format: "${content}"`;
          break;
        default:
          prompt = `Improve this content for better engagement: "${content}"`;
      }
      
      const result = await aiManager.generateText({
        prompt,
        user: req.user.id
      });
      
      res.json(result);
    } catch (error) {
      console.error("Error enhancing content:", error);
      res.status(500).json({ message: "Failed to enhance content" });
    }
  });
  
  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
