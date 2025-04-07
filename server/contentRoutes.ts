import { Request, Response, Router } from 'express';
import { storage } from './storage';
import { insertContentSchema } from '@shared/schema';
import { z } from 'zod';

// Helper function to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Create a router
const router = Router();

// Get all content for the authenticated user
router.get('/api/content', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }
    
    const contents = await storage.getContentsByUserId(userId);
    res.json(contents);
  } catch (error: any) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Get upcoming scheduled content
router.get('/api/content/upcoming', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }
    
    const contents = await storage.getUpcomingContentsByUserId(userId);
    res.json(contents);
  } catch (error: any) {
    console.error('Error fetching upcoming content:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Get single content by ID
router.get('/api/content/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const contentId = parseInt(req.params.id);
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }
    
    const content = await storage.getContent(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Make sure user can only access their own content
    if (content.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Forbidden: Content belongs to another user' });
    }
    
    res.json(content);
  } catch (error: any) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Create new content
router.post('/api/content', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // Create a modified schema with updated fields
    const contentValidationSchema = insertContentSchema.extend({
      body: z.string().optional().default(''),
      platforms: z.array(z.string()).optional().default([]),
      mediaUrls: z.array(z.string()).optional().default([]),
      metadata: z.record(z.any()).optional().default({})
    });
    
    // Validate request body against schema
    const validationResult = contentValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid content data', 
        errors: validationResult.error.errors 
      });
    }
    
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }
    
    // Make sure user can only create content for themselves
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(403).json({ message: 'Cannot create content for another user' });
    }
    
    // Set the correct userId
    const contentData = {
      ...validationResult.data,
      userId
    };
    
    const newContent = await storage.createContent(contentData);
    res.status(201).json(newContent);
  } catch (error: any) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Update content
router.put('/api/content/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const contentId = parseInt(req.params.id);
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }
    
    // Find the content first to check ownership
    const existingContent = await storage.getContent(contentId);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Make sure user can only update their own content
    if (existingContent.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Forbidden: Content belongs to another user' });
    }
    
    // Update content
    const updatedContent = await storage.updateContent(contentId, req.body);
    res.json(updatedContent);
  } catch (error: any) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Delete content
router.delete('/api/content/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const contentId = parseInt(req.params.id);
    if (isNaN(contentId)) {
      return res.status(400).json({ message: 'Invalid content ID' });
    }
    
    // Find the content first to check ownership
    const existingContent = await storage.getContent(contentId);
    if (!existingContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    // Make sure user can only delete their own content
    if (existingContent.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Forbidden: Content belongs to another user' });
    }
    
    // Delete content
    await storage.deleteContent(contentId);
    res.json({ success: true, message: 'Content deleted' });
  } catch (error: any) {
    console.error('Error deleting content:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

export default router;