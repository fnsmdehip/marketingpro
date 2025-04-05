import { Platform } from "@shared/schema";
import { SocialProvider, SocialProviderConfig } from "./social-provider";
import { TwitterProvider } from "./twitter-provider";
import { InstagramProvider } from "./instagram-provider";
import { LinkedInProvider } from "./linkedin-provider";

// Registry of supported social media platforms
export const SOCIAL_PROVIDERS: Record<string, SocialProviderConfig> = {
  twitter: {
    name: "Twitter/X",
    ProviderClass: TwitterProvider,
    requiredFields: ["accessToken", "refreshToken", "accountId"],
    supportsScheduling: true,
    supportsAnalytics: true,
    costDetails: {
      apiCost: "$100/month (Basic API)",
      freeTier: "Limited functionality"
    }
  },
  instagram: {
    name: "Instagram",
    ProviderClass: InstagramProvider,
    requiredFields: ["accessToken", "refreshToken", "accountId"],
    supportsScheduling: true,
    supportsAnalytics: true,
    costDetails: {
      apiCost: "Free with Facebook Developer Account",
      freeTier: "Full functionality with rate limits"
    }
  },
  linkedin: {
    name: "LinkedIn",
    ProviderClass: LinkedInProvider,
    requiredFields: ["accessToken", "refreshToken", "accountId"],
    supportsScheduling: false,
    supportsAnalytics: true,
    costDetails: {
      apiCost: "Free with LinkedIn Developer Account",
      freeTier: "Basic functionality with rate limits"
    }
  }
};

/**
 * Factory function to create a social media provider instance
 * @param platform The platform data from the database
 * @returns A SocialProvider instance for the specified platform
 */
export function createSocialProvider(platform: Platform): SocialProvider | null {
  const providerConfig = SOCIAL_PROVIDERS[platform.platform];
  
  if (!providerConfig) {
    console.error(`Unknown social media provider type: ${platform.platform}`);
    return null;
  }
  
  try {
    return new providerConfig.ProviderClass(platform);
  } catch (error) {
    console.error(`Error creating social provider for ${platform.platform}:`, error);
    return null;
  }
}

/**
 * Get available social media platforms
 * @returns An array of available platform configurations
 */
export function getAvailableSocialPlatforms(): { id: string; name: string; requiredFields: string[]; details: any }[] {
  return Object.entries(SOCIAL_PROVIDERS).map(([id, config]) => ({
    id,
    name: config.name,
    requiredFields: config.requiredFields,
    details: {
      supportsScheduling: config.supportsScheduling,
      supportsAnalytics: config.supportsAnalytics,
      costDetails: config.costDetails
    }
  }));
}