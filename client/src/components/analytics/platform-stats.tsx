import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type PlatformStatsProps = {
  platform: string;
  dateRange: '7d' | '30d' | '90d' | '1y' | 'all';
};

export function PlatformStats({ platform, dateRange }: PlatformStatsProps) {
  // Different stats for different platforms
  const platformData = {
    twitter: {
      title: "Twitter/X Analytics",
      demographics: [
        { age: "18-24", value: 25 },
        { age: "25-34", value: 35 },
        { age: "35-44", value: 20 },
        { age: "45-54", value: 12 },
        { age: "55+", value: 8 }
      ],
      contentTypes: [
        { type: "Text", value: 40 },
        { type: "Image", value: 30 },
        { type: "Link", value: 20 },
        { type: "Poll", value: 5 },
        { type: "Video", value: 5 }
      ],
      bestTime: "1-3 PM EDT, Weekdays",
      growth: "+12% followers this month",
      topEngagementPost: "10 AI Tools Every Marketer Should Use in 2025",
      insights: "Thread-style posts showing 45% higher engagement than single tweets."
    },
    instagram: {
      title: "Instagram Analytics",
      demographics: [
        { age: "18-24", value: 35 },
        { age: "25-34", value: 40 },
        { age: "35-44", value: 15 },
        { age: "45-54", value: 7 },
        { age: "55+", value: 3 }
      ],
      contentTypes: [
        { type: "Image", value: 40 },
        { type: "Carousel", value: 30 },
        { type: "Reels", value: 25 },
        { type: "Stories", value: 5 }
      ],
      bestTime: "12-2 PM & 7-9 PM EDT, Tue-Fri",
      growth: "+8% followers this month",
      topEngagementPost: "Behind the scenes of our latest product shoot",
      insights: "Carousel posts showing 2.2x higher engagement than single images."
    },
    linkedin: {
      title: "LinkedIn Analytics",
      demographics: [
        { age: "18-24", value: 10 },
        { age: "25-34", value: 30 },
        { age: "35-44", value: 35 },
        { age: "45-54", value: 18 },
        { age: "55+", value: 7 }
      ],
      contentTypes: [
        { type: "Text", value: 25 },
        { type: "Document", value: 35 },
        { type: "Image", value: 15 },
        { type: "Link", value: 15 },
        { type: "Video", value: 10 }
      ],
      bestTime: "9-11 AM EDT, Tue-Thu",
      growth: "+5% followers this month",
      topEngagementPost: "How We Generated 10K Leads in 30 Days [Case Study]",
      insights: "Document posts showing 3x higher engagement than text-only posts."
    },
    facebook: {
      title: "Facebook Analytics",
      demographics: [
        { age: "18-24", value: 15 },
        { age: "25-34", value: 25 },
        { age: "35-44", value: 30 },
        { age: "45-54", value: 20 },
        { age: "55+", value: 10 }
      ],
      contentTypes: [
        { type: "Image", value: 30 },
        { type: "Video", value: 35 },
        { type: "Link", value: 25 },
        { type: "Text", value: 10 }
      ],
      bestTime: "1-4 PM EDT, Wed-Fri",
      growth: "+3% followers this month",
      topEngagementPost: "5 Psychological Triggers That Boost Conversion Rates",
      insights: "Video posts showing 2.5x higher engagement than other content types."
    },
    tiktok: {
      title: "TikTok Analytics",
      demographics: [
        { age: "18-24", value: 45 },
        { age: "25-34", value: 30 },
        { age: "35-44", value: 15 },
        { age: "45-54", value: 7 },
        { age: "55+", value: 3 }
      ],
      contentTypes: [
        { type: "Trending", value: 40 },
        { type: "Tutorial", value: 25 },
        { type: "Behind Scenes", value: 20 },
        { type: "Product", value: 15 }
      ],
      bestTime: "7-9 PM EDT, Weekdays & Weekends",
      growth: "+18% followers this month",
      topEngagementPost: "3 Marketing Hacks Nobody Is Talking About",
      insights: "Trend-based content showing 4x higher views than non-trend content."
    }
  };
  
  // Get data for the selected platform
  const data = platformData[platform as keyof typeof platformData];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.demographics}>
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-sm">Audience Growth</h4>
            <p className="text-sm text-gray-600">{data.growth}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Content Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.contentTypes}>
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-sm">Top Post</h4>
            <p className="text-sm text-gray-600">{data.topEngagementPost}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Platform Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-sm mb-2">Best Posting Times</h4>
              <p className="text-sm text-gray-600">{data.bestTime}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-sm mb-2">Content Strategy Insight</h4>
              <p className="text-sm text-gray-600">{data.insights}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}