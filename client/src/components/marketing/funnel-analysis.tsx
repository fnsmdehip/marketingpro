import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronDown, ChevronUp, TrendingUp, AlertTriangle, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FunnelStage {
  name: string;
  visits: number;
  percentage: number;
}

interface Bottleneck {
  stageName: string;
  dropoff: number;
  improvementSuggestions: string[];
}

interface FunnelData {
  stages: FunnelStage[];
  bottlenecks: Bottleneck[];
  conversionRate: number;
  industry: {
    average: number;
    topPerformers: number;
  };
}

export default function FunnelAnalysis() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch funnel data
  const { data, isLoading, error, refetch } = useQuery<{ success: boolean, data: FunnelData }>({
    queryKey: ['/api/analytics/funnel', dateRange],
    retry: 1,
  });

  const funnelData = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-warning mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load funnel analysis</h3>
        <p className="text-muted-foreground mb-4">
          There was an error retrieving your funnel data. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!funnelData) {
    return (
      <div className="p-6 text-center">
        <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No funnel data available</h3>
        <p className="text-muted-foreground mb-4">
          Start publishing content to generate funnel analytics data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Funnel Analysis</h2>
        <div className="flex gap-2">
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
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
          <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Visitor flow through your marketing funnel stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.stages.map((stage, index) => (
                  <div key={stage.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{stage.name}</span>
                      <span className="font-medium">{stage.visits.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                    {index < funnelData.stages.length - 1 && (
                      <div className="flex justify-center">
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
                    <p className="text-2xl font-bold">{funnelData.conversionRate}%</p>
                  </div>
                  <div className="bg-primary/10 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm font-medium text-primary">
                        {funnelData.conversionRate > funnelData.industry.average ? 
                          `${((funnelData.conversionRate / funnelData.industry.average - 1) * 100).toFixed(1)}% above industry average` : 
                          `${((1 - funnelData.conversionRate / funnelData.industry.average) * 100).toFixed(1)}% below industry average`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bottlenecks" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Bottlenecks</CardTitle>
              <CardDescription>
                Areas of highest drop-off in your conversion funnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {funnelData.bottlenecks.map((bottleneck) => (
                  <div key={bottleneck.stageName} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{bottleneck.stageName}</h3>
                      <div className="flex items-center text-red-500">
                        <ChevronDown className="h-4 w-4 mr-1" />
                        <span className="font-medium">{bottleneck.dropoff}% drop-off</span>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Improvement Suggestions</h4>
                      <ul className="space-y-2">
                        {bottleneck.improvementSuggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start">
                            <span className="inline-block bg-white text-primary rounded-full h-5 w-5 flex-shrink-0 text-xs font-medium flex items-center justify-center mr-2 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button className="w-full">Generate AI-Powered Optimization Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
              <CardDescription>
                How your conversion rates compare to industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Your Conversion Rate</p>
                    <div className="h-4 bg-primary rounded-full" style={{ width: `${Math.min(100, funnelData.conversionRate * 4)}%` }}></div>
                    <p className="text-sm font-medium mt-1">{funnelData.conversionRate}%</p>
                  </div>
                  <div className="font-medium text-lg">{funnelData.conversionRate > funnelData.industry.average ? '>' : '<'}</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Industry Average</p>
                    <div className="h-4 bg-gray-300 rounded-full" style={{ width: `${Math.min(100, funnelData.industry.average * 4)}%` }}></div>
                    <p className="text-sm font-medium mt-1">{funnelData.industry.average}%</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Your Conversion Rate</p>
                    <div className="h-4 bg-primary rounded-full" style={{ width: `${Math.min(100, funnelData.conversionRate * 4)}%` }}></div>
                    <p className="text-sm font-medium mt-1">{funnelData.conversionRate}%</p>
                  </div>
                  <div className="font-medium text-lg">{funnelData.conversionRate > funnelData.industry.topPerformers ? '>' : '<'}</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Top Performers</p>
                    <div className="h-4 bg-green-400 rounded-full" style={{ width: `${Math.min(100, funnelData.industry.topPerformers * 4)}%` }}></div>
                    <p className="text-sm font-medium mt-1">{funnelData.industry.topPerformers}%</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Performance Analysis</h3>
                  <p className="text-sm">
                    {funnelData.conversionRate > funnelData.industry.average ? 
                      `Your conversion rate is ${((funnelData.conversionRate / funnelData.industry.average - 1) * 100).toFixed(1)}% higher than the industry average, which is excellent. To reach top performer status, focus on optimizing the bottlenecks identified in your funnel.` : 
                      `Your conversion rate is ${((1 - funnelData.conversionRate / funnelData.industry.average) * 100).toFixed(1)}% lower than the industry average. We recommend focusing on the bottlenecks identified in your funnel to improve performance.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}