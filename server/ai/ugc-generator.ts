import { Router } from 'express';
import { AIManager, aiManager } from './index';

const router = Router();

// UGC Text Generation endpoint
router.post('/ugc/text', async (req, res) => {
  try {
    const { prompt, platform, style, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: "Prompt is required" }
      });
    }
    
    // Create a platform-specific enhanced prompt
    let enhancedPrompt = prompt;
    
    if (platform) {
      // Add platform-specific context to the prompt
      const platformContexts: {[key: string]: string} = {
        twitter: "Create content optimized for Twitter (X): concise, under 280 characters, engaging, with appropriate hashtags. Content should be shareable and conversation-starting.",
        facebook: "Create content optimized for Facebook: 1-2 paragraphs, conversational tone, designed to encourage comments and shares. Can include questions to engage audience.",
        instagram: "Create content optimized for Instagram: visual-focused description, emoji-friendly, with appropriate hashtags (5-15 tags). Content should be aspirational and lifestyle-oriented.",
        linkedin: "Create content optimized for LinkedIn: professional tone, industry-focused, 2-3 paragraphs with business insights. Content should demonstrate expertise and encourage professional engagement.",
        pinterest: "Create content optimized for Pinterest: visual-focused, inspirational, with a clear call-to-action. Content should be aspirational and discoverable.",
        tiktok: "Create content optimized for TikTok: extremely concise (15-30 seconds when spoken), trend-aware, with viral potential. Content should be entertaining and authentic."
      };
      
      const platformContext = platformContexts[platform.toLowerCase()] || 
        "Create engaging social media content that encourages audience interaction.";
      
      enhancedPrompt = `${platformContext}\n\nPrompt: ${prompt}`;
    }
    
    if (style) {
      // Add style guidance to the prompt
      const styleContexts: {[key: string]: string} = {
        professional: "Use a professional, authoritative tone with industry-specific terminology where appropriate. The content should establish expertise and credibility.",
        casual: "Use a casual, conversational tone as if talking to a friend. Include some personality and humor where appropriate.",
        motivational: "Use an inspiring, uplifting tone with powerful language that encourages action and positive emotion.",
        educational: "Use a clear, instructional tone focused on teaching concepts with examples. Break down complex ideas into simple explanations.",
        humorous: "Use a funny, light-hearted tone with appropriate humor, wordplay, or wit. The content should entertain while delivering the message.",
        storytelling: "Frame the content as a narrative with a beginning, middle and end. Use descriptive language and create emotional engagement."
      };
      
      const styleContext = styleContexts[style.toLowerCase()] || 
        "Write in a balanced, accessible tone appropriate for general audiences.";
      
      enhancedPrompt = `${enhancedPrompt}\n\nStyle guidance: ${styleContext}`;
    }
    
    // Add quality guidance at the end
    enhancedPrompt = `${enhancedPrompt}\n\nEnsure the content is original, engaging, and directly addresses the target audience. Focus on providing value and encouraging audience interaction.`;
    
    console.log("[UGC Generator] Enhanced prompt:", enhancedPrompt);
    
    // Send to AI manager
    const result = await aiManager.generateText({
      prompt: enhancedPrompt,
      temperature: 0.7,
      userId: req.user?.id || userId
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in UGC text generation:", error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || "Internal server error" }
    });
  }
});

// UGC Image Generation endpoint
router.post('/ugc/image', async (req, res) => {
  try {
    const { prompt, style, size, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: "Prompt is required" }
      });
    }
    
    // Create an enhanced image prompt
    let enhancedPrompt = prompt;
    
    if (style) {
      // Add style guidance to the prompt
      const styleContexts: {[key: string]: string} = {
        photorealistic: "ultra-realistic, photographic quality, detailed lighting and textures",
        cartoon: "cartoon style, vibrant colors, simplified forms, cute aesthetic",
        minimalist: "minimalist design, clean lines, lots of negative space, simple color palette",
        "3d": "3D rendered, volumetric lighting, detailed textures, depth of field",
        painting: "digital painting, artistic brushstrokes, rich colors, fine details",
        sketch: "hand-drawn sketch, pencil lines, artistic shading, minimal color"
      };
      
      const styleContext = styleContexts[style.toLowerCase()] || "";
      
      if (styleContext) {
        enhancedPrompt = `${enhancedPrompt}, ${styleContext}`;
      }
    }
    
    // Add quality guidance
    enhancedPrompt = `${enhancedPrompt}, high quality, professional, marketing material`;
    
    console.log("[UGC Generator] Enhanced image prompt:", enhancedPrompt);
    
    // Forward to AI manager
    const result = await aiManager.generateImage({
      prompt: enhancedPrompt,
      size: size || "1024x1024",
      style,
      userId: req.user?.id || userId
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in UGC image generation:", error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || "Internal server error" }
    });
  }
});

// UGC Text-to-Speech endpoint
router.post('/ugc/speech', async (req, res) => {
  try {
    const { text, voice, speed, userId } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: { message: "Text is required" }
      });
    }
    
    console.log("[UGC Generator] TTS request:", { textLength: text.length, voice });
    
    // Forward to AI manager
    const result = await aiManager.textToSpeech({
      text,
      voice: voice || "neutral",
      speed: speed || 1.0,
      userId: req.user?.id || userId
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in UGC text-to-speech generation:", error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || "Internal server error" }
    });
  }
});

// UGC Video Generation endpoint
router.post('/ugc/video', async (req, res) => {
  try {
    const { prompt, duration, style, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: { message: "Prompt is required" }
      });
    }
    
    // Create an enhanced video prompt
    let enhancedPrompt = prompt;
    
    if (style) {
      // Add style guidance to the prompt
      const styleContexts: {[key: string]: string} = {
        cinematic: "cinematic quality, professional camera work, film-like lighting and composition",
        animated: "animated style, smooth motion, vibrant colors, expressive characters",
        documentary: "documentary style, realistic, observational camera work, natural lighting",
        commercial: "professional commercial quality, polished visuals, product-focused, high production value",
        social: "optimized for social media, short attention-grabbing visuals, dynamic pacing"
      };
      
      const styleContext = styleContexts[style.toLowerCase()] || "";
      
      if (styleContext) {
        enhancedPrompt = `${enhancedPrompt}, ${styleContext}`;
      }
    }
    
    // Add quality guidance
    enhancedPrompt = `${enhancedPrompt}, high quality, professional, marketing material`;
    
    console.log("[UGC Generator] Enhanced video prompt:", enhancedPrompt);
    
    // Forward to AI manager
    const result = await aiManager.generateVideo({
      prompt: enhancedPrompt,
      duration: duration || 15,
      style,
      userId: req.user?.id || userId
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error("Error in UGC video generation:", error);
    return res.status(500).json({
      success: false,
      error: { message: error.message || "Internal server error" }
    });
  }
});

export default router;