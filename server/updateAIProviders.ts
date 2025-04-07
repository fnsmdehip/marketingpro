import { db } from './db';
import { aiProviders } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Update AI providers with API keys from environment variables
 */
export async function updateAIProviders() {
  try {
    console.log('Updating AI providers with API keys from environment variables...');
    
    // Update Gemini
    await db.update(aiProviders)
      .set({
        apiKey: process.env.GEMINI_API_KEY,
        config: JSON.stringify({
          endpoint: "gemini-1.5-pro",
          hourlyLimit: 60,
          dailyLimit: 250,
          apiKey: process.env.GEMINI_API_KEY
        })
      })
      .where(eq(aiProviders.name, 'gemini'));
    
    // Update DeepSeek/OpenRouter
    await db.update(aiProviders)
      .set({
        apiKey: process.env.OPENROUTER_API_KEY,
        config: JSON.stringify({
          endpoint: "openrouter/deepseek-v3-base",
          hourlyLimit: 50,
          dailyLimit: 200,
          apiKey: process.env.OPENROUTER_API_KEY
        })
      })
      .where(eq(aiProviders.name, 'deepseek'));
    
    console.log('AI providers updated successfully');
  } catch (error) {
    console.error('Error updating AI providers:', error);
  }
}