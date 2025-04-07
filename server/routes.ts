import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupPaymentRoutes } from "./payment";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Setup payment routes (Stripe integration)
  setupPaymentRoutes(app);

  // Basic auth routes - these will need to be expanded
  app.post("/api/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser({ username, password });
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error: any) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
