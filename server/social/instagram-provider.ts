import axios from 'axios';
import { Platform } from "@shared/schema";
import { 
  SocialProvider, 
  PostContent, 
  AnalyticsTimeframe, 
  PostAnalytics, 
  AccountAnalytics 
} from './social-provider';

export class InstagramProvider extends SocialProvider {
  private apiUrl: string = 'https://graph.facebook.com/v19.0';
  private oauthUrl: string = 'https://graph.facebook.com/oauth';
  
  constructor(platformData: Platform) {
    super(platformData);
  }

  private async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

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

      // Check if we have media to upload (required for Instagram)
      if (!content.mediaUrls || content.mediaUrls.length === 0) {
        return { success: false, error: 'Instagram requires at least one media item' };
      }

      // Get Instagram account ID
      const igAccountId = this.platform.accountId;
      if (!igAccountId) {
        return { success: false, error: 'Instagram account ID not found' };
      }

      // Only one media for simplicity
      const mediaUrl = content.mediaUrls[0];
      
      // Step 1: Create a media container
      const containerResponse = await axios.post(
        `${this.apiUrl}/${igAccountId}/media`,
        {
          access_token: this.platform.accessToken,
          image_url: mediaUrl,
          caption: content.text
        }
      );

      if (!containerResponse.data || !containerResponse.data.id) {
        return { success: false, error: 'Failed to create media container' };
      }

      const containerId = containerResponse.data.id;

      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `${this.apiUrl}/${igAccountId}/media_publish`,
        {
          access_token: this.platform.accessToken,
          creation_id: containerId
        }
      );

      if (!publishResponse.data || !publishResponse.data.id) {
        return { success: false, error: 'Failed to publish media' };
      }

      return {
        success: true,
        postId: publishResponse.data.id
      };
    } catch (error: any) {
      console.error('Error posting to Instagram:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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

      // Check if we have media to upload (required for Instagram)
      if (!content.mediaUrls || content.mediaUrls.length === 0) {
        return { success: false, error: 'Instagram requires at least one media item' };
      }

      // Get Instagram account ID
      const igAccountId = this.platform.accountId;
      if (!igAccountId) {
        return { success: false, error: 'Instagram account ID not found' };
      }

      // Only one media for simplicity
      const mediaUrl = content.mediaUrls[0];
      
      // Format the scheduled time
      const publishingTime = Math.floor(content.scheduledTime.getTime() / 1000);
      
      // Step 1: Create a media container with scheduling info
      const containerResponse = await axios.post(
        `${this.apiUrl}/${igAccountId}/media`,
        {
          access_token: this.platform.accessToken,
          image_url: mediaUrl,
          caption: content.text,
          is_published: false,
          publishing_time: publishingTime
        }
      );

      if (!containerResponse.data || !containerResponse.data.id) {
        return { success: false, error: 'Failed to create scheduled media container' };
      }

      const containerId = containerResponse.data.id;

      // Step 2: Schedule the media
      const scheduleResponse = await axios.post(
        `${this.apiUrl}/${igAccountId}/media_publish`,
        {
          access_token: this.platform.accessToken,
          creation_id: containerId,
          published: false,
          scheduled_publish_time: publishingTime
        }
      );

      if (!scheduleResponse.data || !scheduleResponse.data.id) {
        return { success: false, error: 'Failed to schedule media' };
      }

      return {
        success: true,
        scheduledId: scheduleResponse.data.id
      };
    } catch (error: any) {
      console.error('Error scheduling Instagram post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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

      // Delete the media
      const response = await axios.delete(
        `${this.apiUrl}/${postId}`,
        {
          params: {
            access_token: this.platform.accessToken
          }
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting Instagram post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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

      // Get Instagram account ID
      const igAccountId = this.platform.accountId;
      if (!igAccountId) {
        return { success: false, error: 'Instagram account ID not found' };
      }

      // Format dates for API
      const since = Math.floor(timeframe.startDate.getTime() / 1000);
      const until = Math.floor(timeframe.endDate.getTime() / 1000);

      // Get account metrics
      const metricsResponse = await axios.get(
        `${this.apiUrl}/${igAccountId}/insights`,
        {
          params: {
            access_token: this.platform.accessToken,
            metric: 'impressions,reach,profile_views,follower_count,website_clicks',
            period: 'day',
            since,
            until
          }
        }
      );

      if (!metricsResponse.data || !metricsResponse.data.data) {
        return { success: false, error: 'Failed to fetch account metrics' };
      }

      const metrics = metricsResponse.data.data;
      
      // Extract metrics
      let totalImpressions = 0;
      let totalReach = 0;
      let totalProfileViews = 0;
      let followers = 0;
      let totalWebsiteClicks = 0;
      
      metrics.forEach((metric: any) => {
        const values = metric.values.reduce((sum: number, val: any) => sum + val.value, 0);
        
        switch (metric.name) {
          case 'impressions':
            totalImpressions = values;
            break;
          case 'reach':
            totalReach = values;
            break;
          case 'profile_views':
            totalProfileViews = values;
            break;
          case 'follower_count':
            followers = metric.values[metric.values.length - 1].value; // Take latest count
            break;
          case 'website_clicks':
            totalWebsiteClicks = values;
            break;
        }
      });
      
      // Get recent media posts
      const mediaResponse = await axios.get(
        `${this.apiUrl}/${igAccountId}/media`,
        {
          params: {
            access_token: this.platform.accessToken,
            fields: 'id,timestamp,permalink,like_count,comments_count,insights.metric(impressions,reach,engagement)',
            limit: 20
          }
        }
      );
      
      if (!mediaResponse.data || !mediaResponse.data.data) {
        return { success: false, error: 'Failed to fetch media posts' };
      }
      
      const posts = mediaResponse.data.data;
      
      // Filter posts in the timeframe
      const timeframePosts = posts.filter((post: any) => {
        const postTime = new Date(post.timestamp).getTime() / 1000;
        return postTime >= since && postTime <= until;
      });
      
      // Calculate total engagement (likes + comments)
      const totalLikes = timeframePosts.reduce((sum: number, post: any) => sum + (post.like_count || 0), 0);
      const totalComments = timeframePosts.reduce((sum: number, post: any) => sum + (post.comments_count || 0), 0);
      const totalEngagement = totalLikes + totalComments;
      
      // Map to PostAnalytics format
      const topPosts: PostAnalytics[] = timeframePosts.map((post: any) => {
        const postLikes = post.like_count || 0;
        const postComments = post.comments_count || 0;
        const postEngagement = postLikes + postComments;
        let postImpressions = 0;
        let postReach = 0;
        
        // Extract insights if available
        if (post.insights && post.insights.data) {
          post.insights.data.forEach((insight: any) => {
            if (insight.name === 'impressions') {
              postImpressions = insight.values[0].value;
            } else if (insight.name === 'reach') {
              postReach = insight.values[0].value;
            }
          });
        }
        
        return {
          postId: post.id,
          metrics: {
            impressions: postImpressions,
            engagement: postEngagement,
            likes: postLikes,
            comments: postComments,
            clicks: 0 // Not directly available for individual posts
          }
        };
      });
      
      // Sort by engagement
      topPosts.sort((a, b) => b.metrics.engagement - a.metrics.engagement);
      
      return {
        success: true,
        data: {
          metrics: {
            impressions: totalImpressions,
            engagement: totalEngagement,
            likes: totalLikes,
            comments: totalComments,
            followers,
            profileViews: totalProfileViews,
            clicks: totalWebsiteClicks
          },
          topPosts: topPosts.slice(0, 10) // Just the top 10
        }
      };
    } catch (error: any) {
      console.error('Error fetching Instagram account analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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

      // Get post metrics
      const response = await axios.get(
        `${this.apiUrl}/${postId}/insights`,
        {
          params: {
            access_token: this.platform.accessToken,
            metric: 'impressions,reach,engagement,saved,video_views'
          }
        }
      );

      if (!response.data || !response.data.data) {
        return { success: false, error: 'Failed to fetch post analytics' };
      }

      const metrics = response.data.data;
      
      // Extract metrics
      let impressions = 0;
      let reach = 0;
      let engagement = 0;
      let saved = 0;
      let videoViews = 0;
      
      metrics.forEach((metric: any) => {
        const value = metric.values[0].value;
        
        switch (metric.name) {
          case 'impressions':
            impressions = value;
            break;
          case 'reach':
            reach = value;
            break;
          case 'engagement':
            engagement = value;
            break;
          case 'saved':
            saved = value;
            break;
          case 'video_views':
            videoViews = value;
            break;
        }
      });
      
      // Get likes and comments separately
      const postResponse = await axios.get(
        `${this.apiUrl}/${postId}`,
        {
          params: {
            access_token: this.platform.accessToken,
            fields: 'like_count,comments_count'
          }
        }
      );
      
      const likes = postResponse.data.like_count || 0;
      const comments = postResponse.data.comments_count || 0;

      return {
        success: true,
        data: {
          postId,
          metrics: {
            impressions,
            engagement,
            likes,
            comments,
            saves: saved
          }
        }
      };
    } catch (error: any) {
      console.error('Error fetching Instagram post analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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
      const clientId = process.env.FACEBOOK_APP_ID;
      const clientSecret = process.env.FACEBOOK_APP_SECRET;

      if (!clientId || !clientSecret) {
        return { success: false, error: 'Facebook API credentials not configured' };
      }

      // Request new token
      const response = await axios.get(
        `${this.oauthUrl}/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: clientId,
            client_secret: clientSecret,
            fb_exchange_token: this.platform.accessToken
          }
        }
      );

      if (!response.data || !response.data.access_token) {
        return { success: false, error: 'Failed to refresh token' };
      }

      // Calculate token expiry (long-lived tokens typically 60 days)
      const expiresIn = response.data.expires_in || 5184000; // Default to 60 days
      const tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      return {
        success: true,
        accessToken: response.data.access_token,
        // Instagram doesn't use refresh tokens in the same way, 
        // but we'll pass the new access token as the refresh token for consistency
        refreshToken: response.data.access_token,
        tokenExpiry
      };
    } catch (error: any) {
      console.error('Error refreshing Instagram token:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
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
      await axios.get(
        `${this.apiUrl}/me`,
        {
          params: {
            access_token: this.platform.accessToken,
            fields: 'id,name'
          }
        }
      );

      return { valid: true };
    } catch (error: any) {
      console.error('Error validating Instagram connection:', error.response?.data || error.message);
      return {
        valid: false,
        error: error.response?.data?.error?.message || error.message
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

      // Meta's Insights API doesn't provide optimal posting times directly
      // For demonstration, we'll return commonly accepted optimal posting times for Instagram
      return {
        success: true,
        times: [
          '11:00 AM - 1:00 PM', // Lunch time browsing
          '7:00 PM - 9:00 PM',  // Evening leisure
          '2:00 PM - 3:00 PM',  // Afternoon break
          '8:00 AM - 9:00 AM'   // Morning commute/breakfast
        ]
      };
    } catch (error: any) {
      console.error('Error getting Instagram optimal posting times:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}