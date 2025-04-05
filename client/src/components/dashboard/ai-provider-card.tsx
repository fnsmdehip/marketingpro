import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Zap, Code, Beaker, FlaskRound, LucideIcon } from "lucide-react";

type AIProviderStatus = {
  name: string;
  status: string;
  usage: {
    hourly: number;
    daily: number;
    percentage: number;
  };
};

interface AIProviderCardProps {
  provider: AIProviderStatus;
}

// Map provider names to icons
const providerIcons: Record<string, LucideIcon> = {
  "Gemini 2.5 Pro": Zap,
  "DeepSeek v3": Code,
  "Hugging Face": Beaker,
  "Replicate": FlaskRound,
};

export function AIProviderCard({ provider }: AIProviderCardProps) {
  const Icon = providerIcons[provider.name] || Zap;
  
  // Determine status indicator color
  const getStatusColor = (status: string, percentage: number) => {
    if (status !== 'active') return 'bg-yellow-400';
    if (percentage > 90) return 'bg-red-400';
    if (percentage > 70) return 'bg-yellow-400';
    return 'bg-green-400';
  };
  
  const statusColor = getStatusColor(provider.status, provider.usage.percentage);
  
  // Determine progress bar color
  const getProgressColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-600';
    if (percentage > 70) return 'bg-yellow-600';
    return 'bg-primary-600';
  };
  
  const progressColor = getProgressColor(provider.usage.percentage);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-12 w-12 text-primary-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{provider.name}</dt>
              <dd>
                <div className="text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className={cn("h-2.5 w-2.5 rounded-full mr-2", statusColor)}></span>
                    {provider.status === 'active' 
                      ? 'Operational' 
                      : provider.status === 'rate_limited' 
                      ? 'Rate Limited (Fallback Active)' 
                      : 'Inactive'}
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>
        
        <div className="mt-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">API Usage</span>
            <span className="text-xs font-medium text-gray-700">{provider.usage.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn("h-2 rounded-full", progressColor)} 
              style={{ width: `${provider.usage.percentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {provider.usage.hourly} / {provider.usage.daily} requests used
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIProviderCard;
