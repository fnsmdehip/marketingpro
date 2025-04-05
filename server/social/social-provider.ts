import { Platform } from "@shared/schema";

export interface PostContent {
  text: string;
  mediaUrls?: string[];
  title?: string;
  link?: string;
  scheduledTime?: Date;
}

export interface AnalyticsTimeframe {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsMetrics {
  impressions: number;
  engagement: number;
  clicks?: number;
  shares?: number;
  likes?: number;
  saves?: number;
  comments?: number;
  followers?: number;
  profileViews?: number;
}

export interface PostAnalytics {
  postId: string;
  metrics: AnalyticsMetrics;
}

export interface AccountAnalytics {
  metrics: AnalyticsMetrics;
  topPosts: PostAnalytics[];
  demographics?: any;
}

export abstract class SocialProvider {
  public platform: Platform;
  
  constructor(platformData: Platform) {
    this.platform = platformData;
  }

  /**
   * Authenticate with the social media platform
   * This might use the stored access token or refresh it if needed
   */
  abstract authenticate(): Promise<boolean>;

  /**
   * Post content to the social media platform
   */
  abstract postContent(content: PostContent): Promise<{
    success: boolean;
    postId?: string;
    error?: string;
  }>;

  /**
   * Schedule content to be posted at a later time
   */
  abstract scheduleContent(content: PostContent): Promise<{
    success: boolean;
    scheduledId?: string;
    error?: string;
  }>;

  /**
   * Delete a post from the platform
   */
  abstract deletePost(postId: string): Promise<{
    success: boolean;
    error?: string;
  }>;

  /**
   * Get analytics data for the account
   */
  abstract getAccountAnalytics(timeframe: AnalyticsTimeframe): Promise<{
    success: boolean;
    data?: AccountAnalytics;
    error?: string;
  }>;

  /**
   * Get analytics for a specific post
   */
  abstract getPostAnalytics(postId: string): Promise<{
    success: boolean;
    data?: PostAnalytics;
    error?: string;
  }>;

  /**
   * Refresh the access token if needed
   */
  abstract refreshToken(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
    error?: string;
  }>;

  /**
   * Validate the connection to the platform
   */
  abstract validateConnection(): Promise<{
    valid: boolean;
    error?: string;
  }>;

  /**
   * Get platform-specific optimal posting times
   */
  abstract getOptimalPostingTimes(): Promise<{
    success: boolean;
    times?: string[];
    error?: string;
  }>;
}

export interface SocialProviderClass {
  new (platformData: Platform): SocialProvider;
}

export interface SocialProviderConfig {
  name: string;
  ProviderClass: SocialProviderClass;
  requiredFields: string[];
  supportsScheduling: boolean;
  supportsAnalytics: boolean;
  costDetails?: {
    apiCost: string;
    freeTier: string;
  };
}