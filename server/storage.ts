import { users, User, InsertUser, contents, Content, InsertContent, platforms, Platform, InsertPlatform, aiUsage, AiUsage, InsertAiUsage, aiProviders, AiProvider, InsertAiProvider } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined>;
  
  // Content methods
  getContent(id: number): Promise<Content | undefined>;
  getContentsByUserId(userId: number): Promise<Content[]>;
  getUpcomingContentsByUserId(userId: number): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
  
  // Platform methods
  getPlatform(id: number): Promise<Platform | undefined>;
  getPlatformsByUserId(userId: number): Promise<Platform[]>;
  getPlatformByUserAndType(userId: number, platform: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: number, platform: Partial<Platform>): Promise<Platform | undefined>;
  deletePlatform(id: number): Promise<boolean>;
  
  // AI Usage methods
  getAiUsage(id: number): Promise<AiUsage | undefined>;
  getAiUsageByUserId(userId: number): Promise<AiUsage[]>;
  getAiUsageByProvider(provider: string): Promise<AiUsage[]>;
  createAiUsage(usage: InsertAiUsage): Promise<AiUsage>;
  
  // AI Provider methods
  getAiProvider(id: number): Promise<AiProvider | undefined>;
  getAiProviderByName(name: string): Promise<AiProvider | undefined>;
  getActiveAiProviders(): Promise<AiProvider[]>;
  createAiProvider(provider: InsertAiProvider): Promise<AiProvider>;
  updateAiProvider(id: number, provider: Partial<AiProvider>): Promise<AiProvider | undefined>;
  incrementAiProviderUsage(id: number): Promise<AiProvider | undefined>;
  
  // Session store
  sessionStore: Store;
}

// In-memory Storage implementation
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
  
  sessionStore: Store;
  
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
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with default AI providers
    this.initializeAiProviders();
  }
  
  private initializeAiProviders() {
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
    
    providers.forEach(provider => {
      this.createAiProvider({
        name: provider.name,
        endpoint: provider.endpoint,
        status: provider.status,
        hourlyLimit: provider.hourlyLimit,
        dailyLimit: provider.dailyLimit
      });
    });
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const timestamp = new Date();
    
    // Create a base user with required fields ensuring nullable fields are properly set
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName || null,
      avatarUrl: null,
      plan: 'free',
      createdAt: timestamp,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(id: number, customerId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(id: number, info: { customerId: string, subscriptionId: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: info.customerId,
      stripeSubscriptionId: info.subscriptionId,
      plan: 'pro' // Upgrade plan when subscription is added
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Content methods
  async getContent(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }
  
  async getContentsByUserId(userId: number): Promise<Content[]> {
    return Array.from(this.contents.values())
      .filter(content => content.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUpcomingContentsByUserId(userId: number): Promise<Content[]> {
    const now = new Date();
    return Array.from(this.contents.values())
      .filter(content => 
        content.userId === userId && 
        content.status === 'scheduled' &&
        content.scheduledAt && 
        new Date(content.scheduledAt) > now
      )
      .sort((a, b) => {
        if (!a.scheduledAt || !b.scheduledAt) return 0;
        return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
      });
  }
  
  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.contentIdCounter++;
    const timestamp = new Date();
    
    // Create content with all required fields properly set
    const content: Content = { 
      id,
      userId: insertContent.userId,
      title: insertContent.title,
      body: insertContent.body,
      mediaUrls: insertContent.mediaUrls ? JSON.parse(JSON.stringify(insertContent.mediaUrls)) : null,
      platforms: insertContent.platforms ? JSON.parse(JSON.stringify(insertContent.platforms)) : null,
      scheduleType: insertContent.scheduleType,
      scheduledAt: insertContent.scheduledAt || null,
      status: insertContent.status || 'draft',
      aiEnhanced: insertContent.aiEnhanced || null,
      aiModel: insertContent.aiModel || null,
      createdAt: timestamp 
    };
    
    this.contents.set(id, content);
    return content;
  }
  
  async updateContent(id: number, updates: Partial<Content>): Promise<Content | undefined> {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...updates };
    this.contents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
  
  // Platform methods
  async getPlatform(id: number): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }
  
  async getPlatformsByUserId(userId: number): Promise<Platform[]> {
    return Array.from(this.platforms.values())
      .filter(platform => platform.userId === userId);
  }
  
  async getPlatformByUserAndType(userId: number, platformType: string): Promise<Platform | undefined> {
    return Array.from(this.platforms.values())
      .find(platform => platform.userId === userId && platform.platform === platformType);
  }
  
  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformIdCounter++;
    const timestamp = new Date();
    
    const platform: Platform = { 
      id,
      userId: insertPlatform.userId,
      platform: insertPlatform.platform,
      status: insertPlatform.status || 'inactive',
      username: insertPlatform.username || null,
      accessToken: insertPlatform.accessToken || null,
      refreshToken: insertPlatform.refreshToken || null,
      tokenExpiry: insertPlatform.tokenExpiry || null,
      accountId: insertPlatform.accountId || null,
      createdAt: timestamp 
    };
    
    this.platforms.set(id, platform);
    return platform;
  }
  
  async updatePlatform(id: number, updates: Partial<Platform>): Promise<Platform | undefined> {
    const platform = this.platforms.get(id);
    if (!platform) return undefined;
    
    const updatedPlatform = { ...platform, ...updates };
    this.platforms.set(id, updatedPlatform);
    return updatedPlatform;
  }
  
  async deletePlatform(id: number): Promise<boolean> {
    return this.platforms.delete(id);
  }
  
  // AI Usage methods
  async getAiUsage(id: number): Promise<AiUsage | undefined> {
    return this.aiUsages.get(id);
  }
  
  async getAiUsageByUserId(userId: number): Promise<AiUsage[]> {
    return Array.from(this.aiUsages.values())
      .filter(usage => usage.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getAiUsageByProvider(provider: string): Promise<AiUsage[]> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    return Array.from(this.aiUsages.values())
      .filter(usage => 
        usage.provider === provider && 
        new Date(usage.timestamp) >= dayAgo
      );
  }
  
  async createAiUsage(insertUsage: InsertAiUsage): Promise<AiUsage> {
    const id = this.aiUsageIdCounter++;
    const timestamp = new Date();
    
    const usage: AiUsage = { 
      id,
      userId: insertUsage.userId,
      provider: insertUsage.provider,
      requestType: insertUsage.requestType,
      status: insertUsage.status,
      requestCount: insertUsage.requestCount || 1, // Default to 1 if not specified
      timestamp
    };
    
    this.aiUsages.set(id, usage);
    
    // Also increment the provider usage
    const provider = await this.getAiProviderByName(insertUsage.provider);
    if (provider) {
      await this.incrementAiProviderUsage(provider.id);
    }
    
    return usage;
  }
  
  // AI Provider methods
  async getAiProvider(id: number): Promise<AiProvider | undefined> {
    return this.aiProviders.get(id);
  }
  
  async getAiProviderByName(name: string): Promise<AiProvider | undefined> {
    return Array.from(this.aiProviders.values())
      .find(provider => provider.name === name);
  }
  
  async getActiveAiProviders(): Promise<AiProvider[]> {
    return Array.from(this.aiProviders.values())
      .filter(provider => provider.status === 'active')
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async createAiProvider(insertProvider: InsertAiProvider): Promise<AiProvider> {
    const id = this.aiProviderIdCounter++;
    const timestamp = new Date();
    
    const provider: AiProvider = { 
      id,
      name: insertProvider.name,
      endpoint: insertProvider.endpoint,
      status: insertProvider.status ? insertProvider.status : 'active',
      hourlyLimit: insertProvider.hourlyLimit,
      dailyLimit: insertProvider.dailyLimit,
      usageCount: 0,
      lastUsed: timestamp,
      createdAt: timestamp 
    };
    
    this.aiProviders.set(id, provider);
    return provider;
  }
  
  async updateAiProvider(id: number, updates: Partial<AiProvider>): Promise<AiProvider | undefined> {
    const provider = this.aiProviders.get(id);
    if (!provider) return undefined;
    
    const updatedProvider = { ...provider, ...updates };
    this.aiProviders.set(id, updatedProvider);
    return updatedProvider;
  }
  
  async incrementAiProviderUsage(id: number): Promise<AiProvider | undefined> {
    const provider = this.aiProviders.get(id);
    if (!provider) return undefined;
    
    const updatedProvider = { 
      ...provider, 
      usageCount: provider.usageCount + 1,
      lastUsed: new Date()
    };
    this.aiProviders.set(id, updatedProvider);
    return updatedProvider;
  }
}

// Export storage instance
export const storage = new MemStorage();
