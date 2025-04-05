import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Eye, Users, BarChart2, TrendingUp, ArrowUpRight, Download, Filter, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [metricType, setMetricType] = useState("impressions");
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });
  
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2 items-center">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">127.4K</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />8.2%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded-md">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">12.8K</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />14.3%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-purple-50 rounded-md">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Click Rate</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">3.2%</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />2.1%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-orange-50 rounded-md">
                <BarChart2 className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">2.8%</p>
                  <span className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />0.5%
                  </span>
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded-md">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Metrics across all platforms
              </CardDescription>
            </div>
            <Select value={metricType} onValueChange={setMetricType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impressions">Impressions</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border rounded bg-gray-50">
            <p className="text-muted-foreground">Performance chart will appear here</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Platform Tabs */}
      <h2 className="text-xl font-bold mb-4">Platform Performance</h2>
      <Tabs defaultValue="twitter" className="mb-6">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
        </TabsList>
        
        <TabsContent value="twitter">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center border rounded bg-gray-50">
                <p className="text-muted-foreground">Twitter/X metrics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="instagram">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center border rounded bg-gray-50">
                <p className="text-muted-foreground">Instagram metrics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="linkedin">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center border rounded bg-gray-50">
                <p className="text-muted-foreground">LinkedIn metrics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center border rounded bg-gray-50">
                <p className="text-muted-foreground">Facebook metrics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiktok">
          <Card>
            <CardContent className="p-6">
              <div className="h-48 flex items-center justify-center border rounded bg-gray-50">
                <p className="text-muted-foreground">TikTok metrics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best content across platforms</CardDescription>
            </div>
            <Select defaultValue="impressions">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impressions">Impressions</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {[
              {
                title: "10 AI Tools Every Marketer Should Use in 2025",
                platform: "linkedin",
                date: "Mar 15",
                impressions: "24.5K",
                engagement: "1.8K"
              },
              {
                title: "How We Generated 10K Leads in 30 Days [Case Study]",
                platform: "twitter",
                date: "Mar 10",
                impressions: "18.2K",
                engagement: "2.1K"
              },
              {
                title: "5 Psychological Triggers That Boost Conversion Rates",
                platform: "instagram",
                date: "Mar 5",
                impressions: "15.8K",
                engagement: "987"
              }
            ].map((item, index) => (
              <div key={index} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.platform}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="font-medium mt-1">{item.title}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="font-medium">{item.impressions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="font-medium">{item.engagement}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
