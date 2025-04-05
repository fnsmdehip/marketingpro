import axios from 'axios';
import { Platform } from "@shared/schema";
import { 
  SocialProvider, 
  PostContent, 
  AnalyticsTimeframe, 
  PostAnalytics, 
  AccountAnalytics 
} from './social-provider';

export class TwitterProvider extends SocialProvider {
  private apiUrl: string = 'https://api.twitter.com/2';
  private uploadUrl: string = 'https://upload.twitter.com/1.1';
  private oauth2Url: string = 'https://api.twitter.com/oauth2';
  private bearerToken: string | null = null;
  
  constructor(platformData: Platform) {
    super(platformData);
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || null;
  }

  private async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.platform.accessToken) {
      headers['Authorization'] = `Bearer ${this.platform.accessToken}`;
    } else if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }

  async authenticate(): Promise<boolean> {
    // First check if the current token is valid
    const validation = await this.validateConnection();
    if (validation.valid) {
      return true;
    }

    // If not valid, try to refresh
    const refreshResult = await this.refreshToken();
    return refreshResult.success;
  }

  async postContent(content: PostContent): Promise<{
    success: boolean;
    postId?: string;
    error?: string;
  }> {
    try {
      // First authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // Check if we have media to upload
      let mediaIds: string[] = [];
      if (content.mediaUrls && content.mediaUrls.length > 0) {
        // In a real implementation, we would download each media and upload to Twitter
        // This is simplified for the example
        for (const mediaUrl of content.mediaUrls) {
          try {
            // Mock media upload - in real implementation, download image and upload to Twitter
            const uploadResponse = await axios.post(
              `${this.uploadUrl}/media/upload.json`,
              { media: mediaUrl },
              { headers: await this.getHeaders() }
            );
            mediaIds.push(uploadResponse.data.media_id_string);
          } catch (error: any) {
            console.error('Error uploading media to Twitter:', error);
          }
        }
      }

      // Create the tweet
      const tweetData: any = {
        text: content.text,
      };

      if (mediaIds.length > 0) {
        tweetData.media = { media_ids: mediaIds };
      }

      // Post the tweet
      const response = await axios.post(
        `${this.apiUrl}/tweets`,
        tweetData,
        { headers: await this.getHeaders() }
      );

      if (response.data && response.data.data && response.data.data.id) {
        return {
          success: true,
          postId: response.data.data.id
        };
      }

      return {
        success: false,
        error: 'Failed to post tweet'
      };
    } catch (error: any) {
      console.error('Error posting to Twitter:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async scheduleContent(content: PostContent): Promise<{
    success: boolean;
    scheduledId?: string;
    error?: string;
  }> {
    try {
      // Ensure we have a scheduled time
      if (!content.scheduledTime) {
        return { success: false, error: 'Scheduled time is required' };
      }

      // Authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // Create the scheduled tweet data
      const scheduledTweetData: any = {
        text: content.text,
        scheduled_time: content.scheduledTime.toISOString()
      };

      // Check if we have media to upload
      let mediaIds: string[] = [];
      if (content.mediaUrls && content.mediaUrls.length > 0) {
        // In a real implementation, we would download each media and upload to Twitter
        // This is simplified for the example
        for (const mediaUrl of content.mediaUrls) {
          try {
            // Mock media upload
            const uploadResponse = await axios.post(
              `${this.uploadUrl}/media/upload.json`,
              { media: mediaUrl },
              { headers: await this.getHeaders() }
            );
            mediaIds.push(uploadResponse.data.media_id_string);
          } catch (error: any) {
            console.error('Error uploading media to Twitter:', error);
          }
        }
      }

      if (mediaIds.length > 0) {
        scheduledTweetData.media = { media_ids: mediaIds };
      }

      // Schedule the tweet using the Twitter API
      const response = await axios.post(
        `${this.apiUrl}/tweets/scheduled`,
        scheduledTweetData,
        { headers: await this.getHeaders() }
      );

      if (response.data && response.data.data && response.data.data.id) {
        return {
          success: true,
          scheduledId: response.data.data.id
        };
      }

      return {
        success: false,
        error: 'Failed to schedule tweet'
      };
    } catch (error: any) {
      console.error('Error scheduling Twitter post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async deletePost(postId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // Delete the tweet
      await axios.delete(
        `${this.apiUrl}/tweets/${postId}`,
        { headers: await this.getHeaders() }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting Twitter post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async getAccountAnalytics(timeframe: AnalyticsTimeframe): Promise<{
    success: boolean;
    data?: AccountAnalytics;
    error?: string;
  }> {
    try {
      // Authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // Get user ID from the platform data
      const userId = this.platform.accountId;
      if (!userId) {
        return { success: false, error: 'Account ID not found' };
      }

      // Format dates for API
      const startTime = timeframe.startDate.toISOString();
      const endTime = timeframe.endDate.toISOString();

      // Get account metrics
      const metricsResponse = await axios.get(
        `${this.apiUrl}/users/${userId}/tweets?start_time=${startTime}&end_time=${endTime}&tweet.fields=public_metrics,created_at&max_results=100`,
        { headers: await this.getHeaders() }
      );

      if (!metricsResponse.data || !metricsResponse.data.data) {
        return { success: false, error: 'Failed to fetch account metrics' };
      }

      const tweets = metricsResponse.data.data;
      
      // Calculate aggregated metrics
      let totalImpressions = 0;
      let totalEngagement = 0;
      let totalLikes = 0;
      let totalRetweets = 0;
      let totalReplies = 0;
      
      // Get top posts
      const topPosts: PostAnalytics[] = tweets.map((tweet: any) => {
        const impressions = tweet.public_metrics.impression_count || 0;
        const likes = tweet.public_metrics.like_count || 0;
        const retweets = tweet.public_metrics.retweet_count || 0;
        const replies = tweet.public_metrics.reply_count || 0;
        const engagement = likes + retweets + replies;
        
        // Add to totals
        totalImpressions += impressions;
        totalEngagement += engagement;
        totalLikes += likes;
        totalRetweets += retweets;
        totalReplies += replies;
        
        return {
          postId: tweet.id,
          metrics: {
            impressions,
            engagement,
            likes,
            shares: retweets,
            comments: replies
          }
        };
      });
      
      // Sort by engagement
      topPosts.sort((a, b) => b.metrics.engagement - a.metrics.engagement);
      
      // Get follower count
      const userResponse = await axios.get(
        `${this.apiUrl}/users/${userId}?user.fields=public_metrics`,
        { headers: await this.getHeaders() }
      );
      
      const followers = userResponse.data.data.public_metrics.followers_count || 0;
      
      return {
        success: true,
        data: {
          metrics: {
            impressions: totalImpressions,
            engagement: totalEngagement,
            likes: totalLikes,
            shares: totalRetweets,
            comments: totalReplies,
            followers
          },
          topPosts: topPosts.slice(0, 10) // Just the top 10
        }
      };
    } catch (error: any) {
      console.error('Error fetching Twitter account analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async getPostAnalytics(postId: string): Promise<{
    success: boolean;
    data?: PostAnalytics;
    error?: string;
  }> {
    try {
      // Authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // Get tweet metrics
      const response = await axios.get(
        `${this.apiUrl}/tweets/${postId}?tweet.fields=public_metrics`,
        { headers: await this.getHeaders() }
      );

      if (!response.data || !response.data.data) {
        return { success: false, error: 'Failed to fetch post analytics' };
      }

      const tweet = response.data.data;
      const impressions = tweet.public_metrics.impression_count || 0;
      const likes = tweet.public_metrics.like_count || 0;
      const retweets = tweet.public_metrics.retweet_count || 0;
      const replies = tweet.public_metrics.reply_count || 0;
      const engagement = likes + retweets + replies;

      return {
        success: true,
        data: {
          postId,
          metrics: {
            impressions,
            engagement,
            likes,
            shares: retweets,
            comments: replies
          }
        }
      };
    } catch (error: any) {
      console.error('Error fetching Twitter post analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async refreshToken(): Promise<{
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiry?: Date;
    error?: string;
  }> {
    try {
      if (!this.platform.refreshToken) {
        return { success: false, error: 'No refresh token available' };
      }

      // Prepare client credentials
      const clientId = process.env.TWITTER_CLIENT_ID;
      const clientSecret = process.env.TWITTER_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return { success: false, error: 'Twitter API credentials not configured' };
      }

      // Create authorization header for client credentials
      const clientCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      // Request new token
      const response = await axios.post(
        `${this.oauth2Url}/token`,
        {
          grant_type: 'refresh_token',
          refresh_token: this.platform.refreshToken
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${clientCredentials}`
          }
        }
      );

      if (!response.data || !response.data.access_token) {
        return { success: false, error: 'Failed to refresh token' };
      }

      // Calculate token expiry
      const expiresIn = response.data.expires_in || 7200; // Default to 2 hours
      const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      return {
        success: true,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenExpiry
      };
    } catch (error: any) {
      console.error('Error refreshing Twitter token:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async validateConnection(): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      // If we don't have an access token, the connection is invalid
      if (!this.platform.accessToken) {
        return { valid: false, error: 'No access token available' };
      }

      // If token is expired, it's invalid
      if (this.platform.tokenExpiry && new Date(this.platform.tokenExpiry) < new Date()) {
        return { valid: false, error: 'Access token expired' };
      }

      // Test a simple API call to verify token
      const response = await axios.get(
        `${this.apiUrl}/users/me`,
        { headers: await this.getHeaders() }
      );

      return { valid: true };
    } catch (error: any) {
      console.error('Error validating Twitter connection:', error.response?.data || error.message);
      return {
        valid: false,
        error: error.response?.data?.detail || error.message
      };
    }
  }

  async getOptimalPostingTimes(): Promise<{
    success: boolean;
    times?: string[];
    error?: string;
  }> {
    try {
      // Authenticate
      const authenticated = await this.authenticate();
      if (!authenticated) {
        return { success: false, error: 'Authentication failed' };
      }

      // This would normally use the Twitter Analytics API to determine optimal posting times
      // For demonstration, we'll return commonly accepted optimal posting times
      return {
        success: true,
        times: [
          '7:00 AM - 9:00 AM', // Morning commute
          '11:00 AM - 1:00 PM', // Lunch break
          '5:00 PM - 7:00 PM', // Evening commute
          '8:00 PM - 10:00 PM'  // Evening leisure
        ]
      };
    } catch (error: any) {
      console.error('Error getting Twitter optimal posting times:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}