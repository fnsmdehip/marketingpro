import { Link } from "wouter";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { MessageSquare, TrendingUp, Box, Sparkles, BarChart } from "lucide-react";

const tools = [
  {
    icon: MessageSquare,
    name: "Conversion Tactics",
    description: "Psychological triggers for better CTAs",
    href: "/marketing/conversion-tactics",
    color: "text-primary-600"
  },
  {
    icon: TrendingUp,
    name: "Growth Engines",
    description: "Platform-specific growth strategies",
    href: "/marketing/growth-engines",
    color: "text-secondary-600"
  },
  {
    icon: Box,
    name: "Automation",
    description: "Build sophisticated automation workflows",
    href: "/marketing/automation",
    color: "text-accent-600"
  },
  {
    icon: Sparkles,
    name: "Prompt Arsenal",
    description: "Ready-to-use AI prompts library",
    href: "/marketing/prompt-arsenal",
    color: "text-amber-600"
  },
  {
    icon: BarChart,
    name: "Analytics Dashboard",
    description: "Marketing funnel and conversion metrics",
    href: "/marketing/analytics",
    color: "text-blue-600"
  }
];

export function MarketingTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Arsenal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.name} href={tool.href}>
                <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 cursor-pointer">
                  <div className="flex-shrink-0">
                    <Icon className={`h-10 w-10 ${tool.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="absolute inset-0" aria-hidden="true"></span>
                    <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                    <p className="text-sm text-gray-500 truncate">{tool.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default MarketingTools;
