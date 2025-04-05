import { Request, Response } from 'express';
import { storage } from '../storage';
import { createSocialProvider, getAvailableSocialPlatforms } from './provider-factory';
import { PostContent, AnalyticsTimeframe } from './social-provider';
import { z } from 'zod';
import { insertPlatformSchema } from '@shared/schema';

// Validation schemas
const postContentSchema = z.object({
  text: z.string().min(1).max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
  title: z.string().max(100).optional(),
  link: z.string().url().optional(),
  scheduledTime: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined)
});

const analyticsTimeframeSchema = z.object({
  startDate: z.string().datetime().transform(str => new Date(str)),
  endDate: z.string().datetime().transform(str => new Date(str))
});

// Extend platform schema with platform-specific fields
const connectPlatformSchema = insertPlatformSchema.extend({
  platform: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  accountId: z.string().optional(),
  tokenExpiry: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
  settings: z.record(z.unknown()).optional()
});

export async function getSocialPlatforms(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platforms = await storage.getPlatformsByUserId(req.user.id);
    
    // Filter sensitive information
    const sanitizedPlatforms = platforms.map(platform => ({
      id: platform.id,
      userId: platform.userId,
      platform: platform.platform,
      username: platform.username,
      accountId: platform.accountId,
      tokenExpiry: platform.tokenExpiry,
      createdAt: platform.createdAt,
      status: platform.status,
      // Don't include access tokens and refresh tokens
    }));

    res.json(sanitizedPlatforms);
  } catch (error: any) {
    console.error('Error fetching social platforms:', error);
    res.status(500).json({ error: 'Failed to fetch social platforms' });
  }
}

export async function getAvailablePlatforms(_req: Request, res: Response) {
  try {
    const platforms = getAvailableSocialPlatforms();
    res.json(platforms);
  } catch (error: any) {
    console.error('Error fetching available platforms:', error);
    res.status(500).json({ error: 'Failed to fetch available platforms' });
  }
}

export async function connectPlatform(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Validate input
    const validationResult = connectPlatformSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid platform data', details: validationResult.error.format() });
    }

    const platformData = validationResult.data;
    
    // Check if this platform type already exists for this user
    const existingPlatform = await storage.getPlatformByUserAndType(req.user.id, platformData.platform);
    
    if (existingPlatform) {
      // Update existing platform
      const updatedPlatform = await storage.updatePlatform(existingPlatform.id, {
        ...platformData,
        userId: req.user.id // ensure correct user id
      });
      
      if (!updatedPlatform) {
        return res.status(500).json({ error: 'Failed to update platform' });
      }
      
      // Verify connection
      const provider = createSocialProvider(updatedPlatform);
      if (!provider) {
        return res.status(500).json({ error: 'Failed to create social media provider' });
      }
      
      const validation = await provider.validateConnection();
      
      return res.json({
        platform: updatedPlatform,
        connection: validation
      });
    } else {
      // Create new platform
      const newPlatform = await storage.createPlatform({
        ...platformData,
        userId: req.user.id
      });
      
      // Verify connection
      const provider = createSocialProvider(newPlatform);
      if (!provider) {
        return res.status(500).json({ error: 'Failed to create social media provider' });
      }
      
      const validation = await provider.validateConnection();
      
      return res.json({
        platform: newPlatform,
        connection: validation
      });
    }
  } catch (error: any) {
    console.error('Error connecting platform:', error);
    res.status(500).json({ error: 'Failed to connect platform' });
  }
}

export async function disconnectPlatform(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    if (isNaN(platformId)) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Delete the platform
    const success = await storage.deletePlatform(platformId);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to disconnect platform' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error disconnecting platform:', error);
    res.status(500).json({ error: 'Failed to disconnect platform' });
  }
}

export async function postToSocialMedia(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    if (isNaN(platformId)) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Validate post content
    const validationResult = postContentSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid post content', details: validationResult.error.format() });
    }

    const content: PostContent = validationResult.data;
    
    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Post content or schedule it
    let result;
    
    if (content.scheduledTime) {
      result = await provider.scheduleContent(content);
    } else {
      result = await provider.postContent(content);
    }
    
    // Handle updated tokens if provider refreshed them during operation
    if (result.success && provider.platform.accessToken !== platform.accessToken) {
      await storage.updatePlatform(platformId, {
        accessToken: provider.platform.accessToken,
        refreshToken: provider.platform.refreshToken,
        tokenExpiry: provider.platform.tokenExpiry,
        updatedAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error posting to social media:', error);
    res.status(500).json({ error: 'Failed to post to social media' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    const postId = req.params.postId;
    
    if (isNaN(platformId) || !postId) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Delete the post
    const result = await provider.deletePost(postId);
    
    // Handle updated tokens if provider refreshed them during operation
    if (result.success && provider.platform.accessToken !== platform.accessToken) {
      await storage.updatePlatform(platformId, {
        accessToken: provider.platform.accessToken,
        refreshToken: provider.platform.refreshToken,
        tokenExpiry: provider.platform.tokenExpiry,
        updatedAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

export async function getAccountAnalytics(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    if (isNaN(platformId)) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Validate timeframe
    const validationResult = analyticsTimeframeSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: 'Invalid timeframe', details: validationResult.error.format() });
    }

    const timeframe: AnalyticsTimeframe = validationResult.data;
    
    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Get analytics
    const result = await provider.getAccountAnalytics(timeframe);
    
    // Handle updated tokens if provider refreshed them during operation
    if (result.success && provider.platform.accessToken !== platform.accessToken) {
      await storage.updatePlatform(platformId, {
        accessToken: provider.platform.accessToken,
        refreshToken: provider.platform.refreshToken,
        tokenExpiry: provider.platform.tokenExpiry,
        updatedAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error getting account analytics:', error);
    res.status(500).json({ error: 'Failed to get account analytics' });
  }
}

export async function getPostAnalytics(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    const postId = req.params.postId;
    
    if (isNaN(platformId) || !postId) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Get analytics
    const result = await provider.getPostAnalytics(postId);
    
    // Handle updated tokens if provider refreshed them during operation
    if (result.success && provider.platform.accessToken !== platform.accessToken) {
      await storage.updatePlatform(platformId, {
        accessToken: provider.platform.accessToken,
        refreshToken: provider.platform.refreshToken,
        tokenExpiry: provider.platform.tokenExpiry,
        updatedAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error getting post analytics:', error);
    res.status(500).json({ error: 'Failed to get post analytics' });
  }
}

export async function getOptimalPostingTimes(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    if (isNaN(platformId)) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Get optimal posting times
    const result = await provider.getOptimalPostingTimes();
    
    // Handle updated tokens if provider refreshed them during operation
    if (result.success && provider.platform.accessToken !== platform.accessToken) {
      await storage.updatePlatform(platformId, {
        accessToken: provider.platform.accessToken,
        refreshToken: provider.platform.refreshToken,
        tokenExpiry: provider.platform.tokenExpiry,
        updatedAt: new Date()
      });
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error getting optimal posting times:', error);
    res.status(500).json({ error: 'Failed to get optimal posting times' });
  }
}

export async function validatePlatformConnection(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const platformId = parseInt(req.params.platformId);
    if (isNaN(platformId)) {
      return res.status(400).json({ error: 'Invalid platform ID' });
    }

    // Get the platform
    const platform = await storage.getPlatform(platformId);
    
    if (!platform) {
      return res.status(404).json({ error: 'Platform not found' });
    }
    
    // Check if the platform belongs to the authenticated user
    if (platform.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Create provider
    const provider = createSocialProvider(platform);
    if (!provider) {
      return res.status(500).json({ error: 'Failed to create social media provider' });
    }
    
    // Validate connection
    const validation = await provider.validateConnection();
    
    // If not valid, try to refresh the token
    if (!validation.valid) {
      const refreshResult = await provider.refreshToken();
      
      if (refreshResult.success) {
        // Update the platform with new tokens
        await storage.updatePlatform(platformId, {
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken,
          tokenExpiry: refreshResult.tokenExpiry
        });
        
        // Revalidate with new token
        const revalidation = await provider.validateConnection();
        
        return res.json(revalidation);
      }
    }
    
    res.json(validation);
  } catch (error: any) {
    console.error('Error validating platform connection:', error);
    res.status(500).json({ error: 'Failed to validate platform connection' });
  }
}