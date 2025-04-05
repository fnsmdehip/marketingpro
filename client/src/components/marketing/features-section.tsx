import { motion } from "framer-motion";
import { 
  Calendar, 
  Zap, 
  BarChart2, 
  MessageSquare, 
  TrendingUp, 
  Box, 
  Sparkles,
  Clock,
  Monitor,
  Layers
} from "lucide-react";

const features = [
  {
    name: "Multi-Platform Scheduling",
    description: "Schedule content to publish across Twitter, Instagram, LinkedIn, Facebook, TikTok and more, all from one dashboard.",
    icon: Calendar,
  },
  {
    name: "AI Content Generation",
    description: "Create engaging content with AI models like Gemini 2.5 Pro and DeepSeek v3, with automatic provider rotation and fallback.",
    icon: Zap,
  },
  {
    name: "UGC Creator Studio",
    description: "Generate attention-grabbing videos and images with our AI-powered UGC creator studio.",
    icon: Monitor,
  },
  {
    name: "Advanced Analytics",
    description: "Track performance across all platforms with unified analytics and actionable insights.",
    icon: BarChart2,
  },
  {
    name: "Psychological Conversion Tactics",
    description: "Implement proven psychological triggers to boost engagement and conversion rates.",
    icon: MessageSquare,
  },
  {
    name: "Platform-Specific Growth Engines",
    description: "Leverage platform-specific growth strategies optimized for maximum reach and engagement.",
    icon: TrendingUp,
  },
  {
    name: "Optimal Posting Times",
    description: "Our AI analyzes your audience to determine the optimal posting times for maximum engagement.",
    icon: Clock,
  },
  {
    name: "Automation Infrastructure",
    description: "Build sophisticated automation workflows that save time and increase efficiency.",
    icon: Box,
  },
  {
    name: "Content Adaptation",
    description: "Automatically adapt your content for each platform's specific requirements and best practices.",
    icon: Layers,
  },
  {
    name: "AI Prompt Arsenal",
    description: "Access our library of proven AI prompts optimized for marketing and conversion.",
    icon: Sparkles,
  },
];

export function FeaturesSection() {
  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.h2 
            className="text-base text-primary-600 font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Features
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Everything you need to dominate your marketing
          </motion.p>
          <motion.p 
            className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A comprehensive suite of tools designed to streamline your marketing workflow, 
            generate high-converting content, and maximize your results.
          </motion.p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
