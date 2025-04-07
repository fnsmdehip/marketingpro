import { 
  users, contents, platforms, aiUsages, aiProviders,
  type User, type InsertUser, 
  type Content, type InsertContent,
  type Platform, type InsertPlatform,
  type AiUsage, type InsertAiUsage,
  type AiProvider, type InsertAiProvider
} from "@shared/schema";
import { Store } from "express-session";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined>;
  
  // Content operations
  getContent(id: number): Promise<Content | undefined>;
  getContentsByUserId(userId: number): Promise<Content[]>;
  getUpcomingContentsByUserId(userId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Platform operations
  getPlatform(id: number): Promise<Platform | undefined>;
  getPlatformsByUserId(userId: number): Promise<Platform[]>;
  getPlatformByUserAndType(userId: number, platformType: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, updates: Partial<Platform>): Promise<Platform | undefined>;
  deletePlatform(id: number): Promise<boolean>;
  
  // AI Usage operations
  getAiUsage(id: number): Promise<AiUsage | undefined>;
  getAiUsageByUserId(userId: number): Promise<AiUsage[]>;
  getAiUsageByProvider(provider: string): Promise<AiUsage[]>;
  createAiUsage(usage: InsertAiUsage): Promise<AiUsage>;
  
  // AI Provider operations
  getAiProvider(id: number): Promise<AiProvider | undefined>;
  getAiProviderByName(name: string): Promise<AiProvider | undefined>;
  getActiveAiProviders(): Promise<AiProvider[]>;
  createAiProvider(provider: InsertAiProvider): Promise<AiProvider>;
  updateAiProvider(id: number, updates: Partial<AiProvider>): Promise<AiProvider | undefined>;
  incrementAiProviderUsage(id: number): Promise<AiProvider | undefined>;
}

// Simple in-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contents: Map<number, Content>;
  private platforms: Map<number, Platform>;
  private aiUsages: Map<number, AiUsage>;
  private aiProviders: Map<number, AiProvider>;
  
  private userIdCounter: number;
  private contentIdCounter: number;
  private platformIdCounter: number;
  private aiUsageIdCounter: number;
  private aiProviderIdCounter: number;
  
  sessionStore: Store | null = null;

  constructor() {
    this.users = new Map();
    this.contents = new Map();
    this.platforms = new Map();
    this.aiUsages = new Map();
    this.aiProviders = new Map();
    
    this.userIdCounter = 1;
    this.contentIdCounter = 1;
    this.platformIdCounter = 1;
    this.aiUsageIdCounter = 1;
    this.aiProviderIdCounter = 1;
    
    // Initialize with demo data if needed
    this.initializeDemoData();
  }
  
  private initializeDemoData() {
    // Add demo data if needed for development purposes
    // This is only for the in-memory implementation
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = {
      ...insertUser,
      id,
      email: insertUser.email || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      subscriptionTier: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    return this.updateUser(id, { stripeCustomerId: customerId });
  }
  
  async updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined> {
    return this.updateUser(id, { 
      stripeCustomerId: info.customerId,
      stripeSubscriptionId: info.subscriptionId,
      subscriptionStatus: 'active'
    });
  }

  // Content Methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getContentsByUserId(userId: number): Promise<Content[]> {
    return Array.from(this.contents.values()).filter(
      (content) => content.userId === userId
    );
  }
  
  async getUpcomingContentsByUserId(userId: number): Promise<Content[]> {
    const now = new Date();
    
    return Array.from(this.contents.values())
      .filter(
        (content) => content.userId === userId && 
          content.status === 'scheduled' && 
          content.scheduledDate && 
          content.scheduledDate > now
      )
      .sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return a.scheduledDate.getTime() - b.scheduledDate.getTime();
      });
  }
  
  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentIdCounter++;
    const now = new Date();
    
    const content: Content = {
      ...insertContent,
      id,
      body: insertContent.body || '',
      contentType: insertContent.contentType || 'social',
      status: insertContent.status || 'draft',
      platforms: Array.isArray(insertContent.platforms) ? insertContent.platforms : [],
      mediaUrls: Array.isArray(insertContent.mediaUrls) ? insertContent.mediaUrls : [],
      metadata: insertContent.metadata || {},
      publishedDate: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.contents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const content = await this.getContent(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...updates, updatedAt: new Date() };
    this.contents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }

  // Platform Methods
  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }
  
  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return Array.from(this.platforms.values()).filter(
      (platform) => platform.userId === userId
    );
  }
  
  async getPlatformByUserAndType(userId: number, platformType: string): Promise<Platform | undefined> {
    return Array.from(this.platforms.values()).find(
      (platform) => platform.userId === userId && platform.platformType === platformType
    );
  }
  
  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformIdCounter++;
    const now = new Date();
    
    const platform: Platform = {
      ...insertPlatform,
      id,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    
    this.platforms.set(id, platform);
    return platform;
  }
  
  async updatePlatform(id: number, updates: Partial<Platform>): Promise<Platform | undefined> {
    const platform = await this.getPlatform(id);
    if (!platform) return undefined;
    
    const updatedPlatform = { ...platform, ...updates, updatedAt: new Date() };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }
  
  async deletePlatform(id: number): Promise<boolean> {
    return this.platforms.delete(id);
  }

  // AI Usage Methods
  async getAiUsage(id: number): Promise<AiUsage | undefined> {
    return this.aiUsages.get(id);
  }
  
  async getAiUsageByUserId(userId: number): Promise<AiUsage[]> {
    return Array.from(this.aiUsages.values()).filter(
      (usage) => usage.userId === userId
    );
  }
  
  async getAiUsageByProvider(provider: string): Promise<AiUsage[]> {
    return Array.from(this.aiUsages.values()).filter(
      (usage) => usage.provider === provider
    );
  }
  
  async createAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const id = this.aiUsageIdCounter++;
    const now = new Date();
    
    const usage: AiUsage = {
      ...insertUsage,
      id,
      timestamp: now
    };
    
    this.aiUsages.set(id, usage);
    return usage;
  }

  // AI Provider Methods
  async getAiProvider(id: number): Promise<AiProvider | undefined> {
    return this.aiProviders.get(id);
  }
  
  async getAiProviderByName(name: string): Promise<AiProvider | undefined> {
    return Array.from(this.aiProviders.values()).find(
      (provider) => provider.name === name
    );
  }
  
  async getActiveAiProviders(): Promise<AiProvider[]> {
    return Array.from(this.aiProviders.values()).filter(
      (provider) => provider.isActive
    );
  }
  
  async createAiProvider(insertProvider: InsertAiProvider): Promise<AiProvider> {
    const id = this.aiProviderIdCounter++;
    const now = new Date();
    
    const provider: AiProvider = {
      ...insertProvider,
      id,
      usageCount: 0,
      failureCount: 0,
      lastFailureTimestamp: null,
      createdAt: now,
      updatedAt: now
    };
    
    this.aiProviders.set(id, provider);
    return provider;
  }
  
  async updateAiProvider(id: number, updates: Partial<AiProvider>): Promise<AiProvider | undefined> {
    const provider = await this.getAiProvider(id);
    if (!provider) return undefined;
    
    const updatedProvider = { ...provider, ...updates, updatedAt: new Date() };
    this.aiProviders.set(id, updatedProvider);
    return updatedProvider;
  }
  
  async incrementAiProviderUsage(id: number): Promise<AiProvider | undefined> {
    const provider = await this.getAiProvider(id);
    if (!provider) return undefined;
    
    return this.updateAiProvider(id, { usageCount: provider.usageCount + 1 });
  }
}

import { DatabaseStorage } from "./database-storage";

// Switch to database storage for persistence
export const storage = new DatabaseStorage();
