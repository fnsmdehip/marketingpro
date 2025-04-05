import { users, User, InsertUser, contents, Content, InsertContent, platforms, Platform, InsertPlatform, aiUsage, AiUsage, InsertAiUsage, aiProviders, AiProvider, InsertAiProvider } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";
import session from "express-session";
import { Store } from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  sessionStore: Store;

  constructor() {
    // Set up PostgreSQL session store
    const PostgresSessionStore = connectPg(session);
    
    // Create a pool directly using the DATABASE_URL environment variable
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL
    });
    
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
    
    // Initialize AI providers - make sure they're in the DB
    this.initializeAiProviders();
  }
  
  private async initializeAiProviders() {
    // Check if we have any providers already
    const existingProviders = await this.getActiveAiProviders();
    
    if (existingProviders.length === 0) {
      // Add default AI providers
      const providers = [
        {
          name: "Gemini",
          endpoint: "gemini/gemini-1.5-pro",
          status: "active",
          hourlyLimit: 60,
          dailyLimit: 250
        },
        {
          name: "Gemini 2.5 Pro",
          endpoint: "openrouter/gemini-2.5-pro",
          status: "active",
          hourlyLimit: 50,
          dailyLimit: 200
        },
        {
          name: "DeepSeek v3",
          endpoint: "openrouter/deepseek-coder-v3",
          status: "active",
          hourlyLimit: 30,
          dailyLimit: 100
        },
        {
          name: "Hugging Face",
          endpoint: "huggingface/inference",
          status: "active",
          hourlyLimit: 100,
          dailyLimit: 500
        },
        {
          name: "Replicate",
          endpoint: "replicate/api",
          status: "active",
          hourlyLimit: 20,
          dailyLimit: 50
        },
        {
          name: "Google Colab",
          endpoint: "googlecolab/jupyter",
          status: "active",
          hourlyLimit: 10,
          dailyLimit: 30
        }
      ];
      
      for (const provider of providers) {
        await this.createAiProvider({
          name: provider.name,
          endpoint: provider.endpoint,
          status: provider.status,
          hourlyLimit: provider.hourlyLimit,
          dailyLimit: provider.dailyLimit
        });
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    return this.updateUser(id, { stripeCustomerId: customerId });
  }

  async updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined> {
    return this.updateUser(id, { 
      stripeCustomerId: info.customerId, 
      stripeSubscriptionId: info.subscriptionId,
      plan: 'pro' // Upgrade plan when subscription is added
    });
  }

  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    const [content] = await db.select().from(contents).where(eq(contents.id, id));
    return content;
  }

  async getContentsByUserId(userId: number): Promise<Content[]> {
    return db
      .select()
      .from(contents)
      .where(eq(contents.userId, userId))
      .orderBy(contents.createdAt);
  }

  async getUpcomingContentsByUserId(userId: number): Promise<Content[]> {
    const now = new Date();
    return db
      .select()
      .from(contents)
      .where(and(
        eq(contents.userId, userId),
        eq(contents.status, 'scheduled'),
        gt(contents.scheduledAt, now)
      ))
      .orderBy(contents.scheduledAt);
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [content] = await db.insert(contents).values(insertContent).returning();
    return content;
  }

  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const [content] = await db
      .update(contents)
      .set(updates)
      .where(eq(contents.id, id))
      .returning();
    return content;
  }

  async deleteContent(id: number): Promise<boolean> {
    const result = await db.delete(contents).where(eq(contents.id, id));
    return result.rowCount > 0;
  }

  // Platform methods
  async getPlatform(id: number): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));
    return platform;
  }

  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return db.select().from(platforms).where(eq(platforms.userId, userId));
  }

  async getPlatformByUserAndType(userId: number, platformType: string): Promise<Platform | undefined> {
    const [platform] = await db
      .select()
      .from(platforms)
      .where(and(
        eq(platforms.userId, userId),
        eq(platforms.platform, platformType)
      ));
    return platform;
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db.insert(platforms).values(insertPlatform).returning();
    return platform;
  }

  async updatePlatform(id: number, updates: Partial<Platform>): Promise<Platform | undefined> {
    const [platform] = await db
      .update(platforms)
      .set(updates)
      .where(eq(platforms.id, id))
      .returning();
    return platform;
  }

  async deletePlatform(id: number): Promise<boolean> {
    const result = await db.delete(platforms).where(eq(platforms.id, id));
    return result.rowCount > 0;
  }

  // AI Usage methods
  async getAiUsage(id: number): Promise<AiUsage | undefined> {
    const [usage] = await db.select().from(aiUsage).where(eq(aiUsage.id, id));
    return usage;
  }

  async getAiUsageByUserId(userId: number): Promise<AiUsage[]> {
    return db
      .select()
      .from(aiUsage)
      .where(eq(aiUsage.userId, userId))
      .orderBy(aiUsage.timestamp);
  }

  async getAiUsageByProvider(provider: string): Promise<AiUsage[]> {
    // Get usage for the last 24 hours
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    
    return db
      .select()
      .from(aiUsage)
      .where(and(
        eq(aiUsage.provider, provider),
        gt(aiUsage.timestamp, dayAgo)
      ));
  }

  async createAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const [usage] = await db.insert(aiUsage).values(insertUsage).returning();
    
    // Also increment the provider usage
    const provider = await this.getAiProviderByName(insertUsage.provider);
    if (provider) {
      await this.incrementAiProviderUsage(provider.id);
    }
    
    return usage;
  }

  // AI Provider methods
  async getAiProvider(id: number): Promise<AiProvider | undefined> {
    const [provider] = await db.select().from(aiProviders).where(eq(aiProviders.id, id));
    return provider;
  }

  async getAiProviderByName(name: string): Promise<AiProvider | undefined> {
    const [provider] = await db.select().from(aiProviders).where(eq(aiProviders.name, name));
    return provider;
  }

  async getActiveAiProviders(): Promise<AiProvider[]> {
    return db
      .select()
      .from(aiProviders)
      .where(eq(aiProviders.status, 'active'))
      .orderBy(aiProviders.name);
  }

  async createAiProvider(insertProvider: InsertAiProvider): Promise<AiProvider> {
    const [provider] = await db.insert(aiProviders).values(insertProvider).returning();
    return provider;
  }

  async updateAiProvider(id: number, updates: Partial<AiProvider>): Promise<AiProvider | undefined> {
    const [provider] = await db
      .update(aiProviders)
      .set(updates)
      .where(eq(aiProviders.id, id))
      .returning();
    return provider;
  }

  async incrementAiProviderUsage(id: number): Promise<AiProvider | undefined> {
    const [provider] = await db.select().from(aiProviders).where(eq(aiProviders.id, id));
    if (!provider) return undefined;
    
    const [updatedProvider] = await db
      .update(aiProviders)
      .set({ 
        usageCount: provider.usageCount + 1,
        lastUsed: new Date()
      })
      .where(eq(aiProviders.id, id))
      .returning();
    
    return updatedProvider;
  }
}