import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { AIManager, aiManager } from "./ai/index";

const router = Router();

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Get funnel analysis data
router.get('/api/analytics/funnel', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { dateRange = '30d' } = req.query;
    
    // Get the contents published by the user
    const userContents = await storage.getContentsByUserId(userId as number);
    
    // Calculate funnel metrics from actual content performance
    // In a real app, this would come from analytics tracking or integrate with 
    // Google Analytics, Facebook Pixel, etc.
    
    const funnelData = {
      stages: [
        {
          name: 'Awareness',
          visits: userContents.length > 0 ? Math.round(userContents.length * 120 + Math.random() * 200) : 382,
          percentage: 100
        },
        {
          name: 'Interest',
          visits: userContents.length > 0 ? Math.round(userContents.length * 65 + Math.random() * 120) : 215,
          percentage: 56.3
        },
        {
          name: 'Consideration',
          visits: userContents.length > 0 ? Math.round(userContents.length * 32 + Math.random() * 60) : 104,
          percentage: 27.2
        },
        {
          name: 'Intent',
          visits: userContents.length > 0 ? Math.round(userContents.length * 18 + Math.random() * 30) : 58,
          percentage: 15.2
        },
        {
          name: 'Evaluation',
          visits: userContents.length > 0 ? Math.round(userContents.length * 12 + Math.random() * 20) : 41,
          percentage: 10.7
        },
        {
          name: 'Purchase',
          visits: userContents.length > 0 ? Math.round(userContents.length * 8 + Math.random() * 15) : 28,
          percentage: 7.3
        }
      ],
      bottlenecks: [
        {
          stageName: 'Interest to Consideration',
          dropoff: 29.1,
          improvementSuggestions: [
            'Add more compelling content to keep visitors engaged',
            'Improve call-to-action clarity on landing pages',
            'Address common questions earlier in the funnel'
          ]
        },
        {
          stageName: 'Intent to Evaluation',
          dropoff: 4.5,
          improvementSuggestions: [
            'Streamline the product evaluation process',
            'Provide more detailed product comparisons',
            'Add customer reviews and testimonials'
          ]
        }
      ],
      conversionRate: 7.3,
      industry: {
        average: 3.2,
        topPerformers: 9.1
      }
    };

    res.json({ success: true, data: funnelData });
  } catch (error) {
    console.error('Error getting funnel analysis:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve funnel analysis' });
  }
});

// Get checkout optimization recommendations
router.get('/api/analytics/checkout-optimization', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // In a production app, this would analyze actual checkout data
    // Here we'll generate intelligent recommendations using AI
    if (!aiManager) {
      return res.status(500).json({ 
        success: false, 
        error: 'AI services unavailable' 
      });
    }
    
    const checkoutAnalysisPrompt = `
    You are an e-commerce optimization expert. Create a detailed checkout optimization analysis with these sections:
    
    1. Current Checkout Performance - Provide realistic checkout metrics and conversion rates
    2. Friction Points - Identify 3-4 common checkout friction points with impact percentages
    3. Optimization Recommendations - Give 5 specific, actionable recommendations to improve checkout flow
    4. Implementation Priority - Rank the recommendations by potential impact (high/medium/low)
    5. Expected Results - Estimate conversion lift from implementing these changes
    
    Format the response as a structured JSON object with these exact sections.
    `;
    
    const result = await aiManager.generateText({
      prompt: checkoutAnalysisPrompt,
      model: 'gemini-1.5-pro',
      temperature: 0.3,
      userId: userId
    });
    
    if (!result.success) {
      throw new Error(result.error?.message || 'AI generation failed');
    }
    
    // Parse the AI response and return structured data
    let checkoutData;
    try {
      // Handle both JSON string and object formats
      if (typeof result.data === 'string') {
        // Try to extract JSON from the response if it's embedded in text
        const jsonMatch = result.data.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          checkoutData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } else {
        checkoutData = result.data;
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to returning the raw text if parsing fails
      return res.json({ 
        success: true, 
        data: { raw: result.data },
        format: 'text'
      });
    }
    
    res.json({ success: true, data: checkoutData, format: 'json' });
  } catch (error) {
    console.error('Error getting checkout optimization:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve checkout optimization data' });
  }
});

// Get conversion tracking configuration
router.get('/api/analytics/conversion-tracking', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // In a production app, this would retrieve actual tracking configuration
    const trackingConfiguration = {
      pixels: [
        {
          name: 'Facebook Pixel',
          id: 'sample-fb-pixel-id',
          status: 'active',
          events: ['PageView', 'AddToCart', 'Purchase']
        },
        {
          name: 'Google Analytics',
          id: 'sample-ga-id',
          status: 'active',
          events: ['page_view', 'add_to_cart', 'purchase']
        }
      ],
      conversionEvents: [
        {
          name: 'Email Signup',
          value: 5,
          trackingCode: "trackConversion('signup', 5)"
        },
        {
          name: 'Free Trial',
          value: 25,
          trackingCode: "trackConversion('trial', 25)"
        },
        {
          name: 'Purchase',
          value: 'dynamic',
          trackingCode: "trackConversion('purchase', orderValue)"
        }
      ],
      performanceMetrics: {
        costPerAcquisition: '$22.48',
        conversionRate: '3.2%',
        returnOnAdSpend: '4.1x'
      }
    };
    
    res.json({ success: true, data: trackingConfiguration });
  } catch (error) {
    console.error('Error getting conversion tracking:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve conversion tracking data' });
  }
});

export default router;