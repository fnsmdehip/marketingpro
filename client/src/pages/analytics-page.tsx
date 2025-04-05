import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PerformanceChart } from "@/components/analytics/performance-chart";
import { PlatformStats } from "@/components/analytics/platform-stats";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Users, BarChart2, TrendingUp, ArrowUpRight, Download, Filter } from "lucide-react";

type DateRange = "7d" | "30d" | "90d" | "1y" | "all";
type MetricType = "impressions" | "engagement" | "clicks" | "conversions";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [metricType, setMetricType] = useState<MetricType>("impressions");
  const [platformFilter, setPlatformFilter] = useState("all");
  
  // Helper function to format date ranges for display
  const formatDateRange = (range: DateRange): string => {
    const now = new Date();
    let start = new Date();
    
    switch (range) {
      case "7d":
        start.setDate(now.getDate() - 7);
        break;
      case "30d":
        start.setDate(now.getDate() - 30);
        break;
      case "90d":
        start.setDate(now.getDate() - 90);
        break;
      case "1y":
        start.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        return "All Time";
    }
    
    return `${start.toLocaleDateString()} - ${now.toLocaleDateString()}`;
  };
  
  return (
    <DashboardLayout title="Analytics">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>
            <p className="text-sm text-gray-500">
              Insights and performance metrics across all platforms
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={dateRange} 
              onValueChange={(value) => setDateRange(value as DateRange)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Impressions</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">127.4K</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8.2%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-primary-50 rounded-md">
                  <Eye className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Engagement</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">12.8K</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      14.3%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-secondary-50 rounded-md">
                  <Users className="h-5 w-5 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Click Rate</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">3.2%</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2.1%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-accent-50 rounded-md">
                  <BarChart2 className="h-5 w-5 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">2.8%</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      0.5%
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Chart */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  {formatDateRange(dateRange)}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Select 
                  value={metricType} 
                  onValueChange={(value) => setMetricType(value as MetricType)}
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="clicks">Clicks</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={platformFilter} 
                  onValueChange={setPlatformFilter}
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue placeholder="Filter by platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PerformanceChart 
              dateRange={dateRange} 
              metricType={metricType} 
              platformFilter={platformFilter} 
            />
          </CardContent>
        </Card>
        
        {/* Platform-specific analytics */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Platform Performance
          </h2>
          
          <Tabs defaultValue="twitter">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            </TabsList>
            
            <TabsContent value="twitter">
              <PlatformStats platform="twitter" dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="instagram">
              <PlatformStats platform="instagram" dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="linkedin">
              <PlatformStats platform="linkedin" dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="facebook">
              <PlatformStats platform="facebook" dateRange={dateRange} />
            </TabsContent>
            
            <TabsContent value="tiktok">
              <PlatformStats platform="tiktok" dateRange={dateRange} />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>
              Your best performing content across platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <Select defaultValue="impressions">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="clicks">Clicks</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="divide-y divide-gray-200">
              {/* Sample top performing content items */}
              {[
                {
                  title: "10 AI Tools Every Marketer Should Use in 2025",
                  platform: "linkedin",
                  date: "Mar 15",
                  impressions: "24.5K",
                  engagement: "1.8K",
                  clicks: "945"
                },
                {
                  title: "How We Generated 10K Leads in 30 Days [Case Study]",
                  platform: "twitter",
                  date: "Mar 10",
                  impressions: "18.2K",
                  engagement: "2.1K",
                  clicks: "1.2K"
                },
                {
                  title: "5 Psychological Triggers That Boost Conversion Rates",
                  platform: "instagram",
                  date: "Mar 5",
                  impressions: "15.8K",
                  engagement: "987",
                  clicks: "562"
                },
                {
                  title: "[VIDEO] The Future of Social Media Marketing",
                  platform: "tiktok",
                  date: "Feb 28",
                  impressions: "12.3K",
                  engagement: "3.4K",
                  clicks: "879"
                },
                {
                  title: "Ultimate Guide to Content Repurposing",
                  platform: "facebook",
                  date: "Feb 20",
                  impressions: "10.6K",
                  engagement: "789",
                  clicks: "452"
                }
              ].map((item, index) => (
                <div key={index} className="py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <img 
                          src={`https://cdn-icons-png.flaticon.com/512/${
                            item.platform === 'twitter' ? '733/733579' :
                            item.platform === 'instagram' ? '174/174855' :
                            item.platform === 'linkedin' ? '174/174857' :
                            item.platform === 'facebook' ? '174/174848' :
                            '3046/3046121' // TikTok
                          }.png`} 
                          alt={item.platform} 
                          className="h-5 w-5 mr-2" 
                        />
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <p className="mt-1 text-base font-medium">{item.title}</p>
                    </div>
                    <div className="flex space-x-4 text-sm">
                      <div>
                        <p className="text-gray-500">Impressions</p>
                        <p className="font-medium text-right">{item.impressions}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Engagement</p>
                        <p className="font-medium text-right">{item.engagement}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clicks</p>
                        <p className="font-medium text-right">{item.clicks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
