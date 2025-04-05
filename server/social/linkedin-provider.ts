import axios from 'axios';
import { Platform } from "@shared/schema";
import { 
  SocialProvider, 
  PostContent, 
  AnalyticsTimeframe, 
  PostAnalytics, 
  AccountAnalytics 
} from './social-provider';

export class LinkedInProvider extends SocialProvider {
  private apiUrl: string = 'https://api.linkedin.com/v2';
  private oauthUrl: string = 'https://www.linkedin.com/oauth/v2';
  
  constructor(platformData: Platform) {
    super(platformData);
  }

  private async getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202305'
    };

    if (this.platform.accessToken) {
      headers['Authorization'] = `Bearer ${this.platform.accessToken}`;
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

      // Get LinkedIn account (person URN)
      const personUrn = this.platform.accountId;
      if (!personUrn) {
        return { success: false, error: 'LinkedIn account ID not found' };
      }

      // Create post data
      const postData: any = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // If we have media to upload
      if (content.mediaUrls && content.mediaUrls.length > 0) {
        // Register media upload
        const media = await this.uploadMedia(content.mediaUrls[0]);
        if (media) {
          postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'IMAGE';
          postData.specificContent['com.linkedin.ugc.ShareContent'].media = [
            {
              status: 'READY',
              description: {
                text: content.text.substring(0, 200)
              },
              media: media,
              title: {
                text: content.title || content.text.substring(0, 50)
              }
            }
          ];
        }
      }

      // Post the content
      const response = await axios.post(
        `${this.apiUrl}/ugcPosts`,
        postData,
        { headers: await this.getHeaders() }
      );

      if (response.data && response.data.id) {
        return {
          success: true,
          postId: response.data.id
        };
      }

      return {
        success: false,
        error: 'Failed to create LinkedIn post'
      };
    } catch (error: any) {
      console.error('Error posting to LinkedIn:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Helper method to upload media to LinkedIn
  private async uploadMedia(mediaUrl: string): Promise<string | null> {
    try {
      // Get LinkedIn account (person URN)
      const personUrn = this.platform.accountId;
      if (!personUrn) {
        return null;
      }

      // Step 1: Register upload
      const registerResponse = await axios.post(
        `${this.apiUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: [
              'urn:li:digitalmediaRecipe:feedshare-image'
            ],
            owner: `urn:li:person:${personUrn}`,
            serviceRelationships: [
              {
                relationshipType: 'OWNER',
                identifier: 'urn:li:userGeneratedContent'
              }
            ]
          }
        },
        { headers: await this.getHeaders() }
      );

      if (!registerResponse.data || !registerResponse.data.value || !registerResponse.data.value.asset) {
        return null;
      }

      const uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerResponse.data.value.asset;

      // Step 2: Download the image from mediaUrl
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(mediaResponse.data, 'binary');

      // Step 3: Upload the image to LinkedIn
      await axios.put(
        uploadUrl,
        buffer,
        {
          headers: {
            'Content-Type': 'application/octet-stream'
          }
        }
      );

      return asset;
    } catch (error: any) {
      console.error('Error uploading media to LinkedIn:', error.response?.data || error.message);
      return null;
    }
  }

  async scheduleContent(content: PostContent): Promise<{
    success: boolean;
    scheduledId?: string;
    error?: string;
  }> {
    try {
      // LinkedIn API doesn't directly support scheduling posts
      // For enterprise accounts, we'd use the LinkedIn Marketing API
      // For this implementation, we'll return an error message
      return {
        success: false,
        error: 'LinkedIn API does not support scheduling posts directly. Use a third-party scheduler or the Marketing API for enterprise accounts.'
      };
    } catch (error: any) {
      console.error('Error scheduling LinkedIn post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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

      // Delete the post
      await axios.delete(
        `${this.apiUrl}/ugcPosts/${postId}`,
        { headers: await this.getHeaders() }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting LinkedIn post:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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

      // Get LinkedIn account (person URN)
      const personUrn = this.platform.accountId;
      if (!personUrn) {
        return { success: false, error: 'LinkedIn account ID not found' };
      }

      // Format dates for API
      const startDate = timeframe.startDate.toISOString().split('T')[0];
      const endDate = timeframe.endDate.toISOString().split('T')[0];

      // Get shares (posts) during the timeframe
      const sharesResponse = await axios.get(
        `${this.apiUrl}/shares?q=owners&owners=urn:li:person:${personUrn}`,
        { headers: await this.getHeaders() }
      );

      if (!sharesResponse.data || !sharesResponse.data.elements) {
        return { success: false, error: 'Failed to fetch LinkedIn posts' };
      }

      // Filter by timeframe
      const shares = sharesResponse.data.elements.filter((share: any) => {
        const createDate = share.created.time.split('T')[0];
        return createDate >= startDate && createDate <= endDate;
      });

      // Get analytics for each post
      const postsAnalytics: PostAnalytics[] = [];
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let totalShares = 0;

      for (const share of shares) {
        try {
          const shareId = share.id;
          const statsResponse = await axios.get(
            `${this.apiUrl}/socialActions/${shareId}`,
            { headers: await this.getHeaders() }
          );

          if (statsResponse.data) {
            const likes = statsResponse.data.likesSummary?.count || 0;
            const comments = statsResponse.data.commentsSummary?.count || 0;
            
            // Get impressions and clicks from share statistics
            const shareStatsResponse = await axios.get(
              `${this.apiUrl}/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:person:${personUrn}&shares[0]=${shareId}`,
              { headers: await this.getHeaders() }
            );
            
            const shareStats = shareStatsResponse.data?.elements?.[0]?.shareStatistics || {};
            const impressions = shareStats.impressionCount || 0;
            const clicks = shareStats.clickCount || 0;
            const shares = shareStats.shareCount || 0;
            
            // Add to totals
            totalImpressions += impressions;
            totalClicks += clicks;
            totalLikes += likes;
            totalComments += comments;
            totalShares += shares;
            
            // Add to post analytics
            postsAnalytics.push({
              postId: shareId,
              metrics: {
                impressions,
                engagement: likes + comments + shares,
                clicks,
                likes,
                comments,
                shares
              }
            });
          }
        } catch (error) {
          console.error('Error fetching LinkedIn post analytics:', error);
        }
      }

      // Get profile statistics
      const profileResponse = await axios.get(
        `${this.apiUrl}/me?projection=(id,firstName,lastName,profilePicture,vanityName,numConnections)`,
        { headers: await this.getHeaders() }
      );

      const followers = profileResponse.data?.numConnections || 0;

      // Sort posts by engagement
      postsAnalytics.sort((a, b) => b.metrics.engagement - a.metrics.engagement);

      return {
        success: true,
        data: {
          metrics: {
            impressions: totalImpressions,
            engagement: totalLikes + totalComments + totalShares,
            clicks: totalClicks,
            likes: totalLikes,
            comments: totalComments,
            shares: totalShares,
            followers
          },
          topPosts: postsAnalytics.slice(0, 10) // Just the top 10
        }
      };
    } catch (error: any) {
      console.error('Error fetching LinkedIn account analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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

      // Get LinkedIn account (person URN)
      const personUrn = this.platform.accountId;
      if (!personUrn) {
        return { success: false, error: 'LinkedIn account ID not found' };
      }

      // Get post social actions (likes, comments)
      const socialResponse = await axios.get(
        `${this.apiUrl}/socialActions/${postId}`,
        { headers: await this.getHeaders() }
      );

      if (!socialResponse.data) {
        return { success: false, error: 'Failed to fetch post social metrics' };
      }

      const likes = socialResponse.data.likesSummary?.count || 0;
      const comments = socialResponse.data.commentsSummary?.count || 0;

      // Get impressions and clicks
      const statsResponse = await axios.get(
        `${this.apiUrl}/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=urn:li:person:${personUrn}&shares[0]=${postId}`,
        { headers: await this.getHeaders() }
      );

      if (!statsResponse.data || !statsResponse.data.elements || !statsResponse.data.elements[0]) {
        return { success: false, error: 'Failed to fetch post performance metrics' };
      }

      const shareStats = statsResponse.data.elements[0].shareStatistics || {};
      const impressions = shareStats.impressionCount || 0;
      const clicks = shareStats.clickCount || 0;
      const shares = shareStats.shareCount || 0;

      return {
        success: true,
        data: {
          postId,
          metrics: {
            impressions,
            engagement: likes + comments + shares,
            clicks,
            likes,
            comments,
            shares
          }
        }
      };
    } catch (error: any) {
      console.error('Error fetching LinkedIn post analytics:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return { success: false, error: 'LinkedIn API credentials not configured' };
      }

      // Request new token
      const response = await axios.post(
        `${this.oauthUrl}/accessToken`,
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: this.platform.refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
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
        refreshToken: response.data.refresh_token || this.platform.refreshToken,
        tokenExpiry
      };
    } catch (error: any) {
      console.error('Error refreshing LinkedIn token:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
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
        `${this.apiUrl}/me`,
        { headers: await this.getHeaders() }
      );

      if (!response.data || !response.data.id) {
        return { valid: false, error: 'Invalid LinkedIn connection' };
      }

      return { valid: true };
    } catch (error: any) {
      console.error('Error validating LinkedIn connection:', error.response?.data || error.message);
      return {
        valid: false,
        error: error.response?.data?.message || error.message
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

      // LinkedIn API doesn't provide optimal posting times directly
      // For demonstration, we'll return commonly accepted optimal posting times for LinkedIn
      return {
        success: true,
        times: [
          '7:30 AM - 8:30 AM', // Early morning, professionals check LinkedIn before work
          '12:00 PM - 1:00 PM', // Lunch break
          '5:00 PM - 6:00 PM',  // End of workday
          'Tuesday 10:00 AM - 11:00 AM', // Best day and time for B2B content
          'Wednesday 9:00 AM - 10:00 AM', // Good for thought leadership
          'Thursday 1:00 PM - 2:00 PM'   // Good engagement day
        ]
      };
    } catch (error: any) {
      console.error('Error getting LinkedIn optimal posting times:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}