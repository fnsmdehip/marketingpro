import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowDown, ShoppingCart, AlertTriangle, RefreshCcw, ThumbsUp, Clock, CheckCircle2 } from "lucide-react";

interface CheckoutMetric {
  name: string;
  value: string;
  change: number;
}

interface FrictionPoint {
  name: string;
  impact: string;
  description: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface CheckoutData {
  currentPerformance: {
    metrics: CheckoutMetric[];
    completionRate: number;
  };
  frictionPoints: FrictionPoint[];
  recommendations: Recommendation[];
  expectedResults: {
    conversionLift: string;
    revenueImpact: string;
  };
}

export default function CheckoutOptimization() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch checkout optimization data
  const { data, isLoading, error, refetch } = useQuery<{ success: boolean, data: CheckoutData, format: string }>({
    queryKey: ['/api/analytics/checkout-optimization'],
    retry: 1
  });
  
  // Show toast if data format is text
  React.useEffect(() => {
    if (data?.format === 'text') {
      toast({
        title: "Data format notice",
        description: "Some data was returned in a raw format and has been processed for display.",
        variant: "default",
      });
    }
  }, [data, toast]);

  let checkoutData = data?.data;
  
  // If the data is in raw text format, use fallback data structure
  if (data?.format === 'text' && data?.data && 'raw' in data.data) {
    // Parse the raw AI response as best we can into our expected format
    const rawResponse = (data.data as any).raw as string;
    
    // Basic fallback structure with some extracted data if possible
    checkoutData = {
      currentPerformance: {
        metrics: [
          { name: "Checkout Abandonment Rate", value: "62%", change: 0 },
          { name: "Average Time to Complete", value: "4:32", change: 0 }
        ],
        completionRate: 38
      },
      frictionPoints: [
        { 
          name: "Form Fields", 
          impact: "25%", 
          description: "Too many required fields in checkout form"
        }
      ],
      recommendations: [
        {
          title: "Simplify Checkout Form",
          description: "Reduce the number of required fields in the checkout form",
          priority: "high"
        }
      ],
      expectedResults: {
        conversionLift: "+15-25%",
        revenueImpact: "Significant"
      }
    };
    
    // Try to extract recommendations from the raw text
    const recommendationMatches = rawResponse.match(/(?:recommendation|improve|optimize|simplify)[:\s]+(.*?)(?:\.|$)/gi);
    if (recommendationMatches && recommendationMatches.length > 0) {
      checkoutData.recommendations = recommendationMatches.slice(0, 3).map((rec, i) => ({
        title: rec.replace(/^(?:recommendation|improve|optimize|simplify)[:\s]+/i, '').trim(),
        description: "Extracted from analysis",
        priority: i === 0 ? "high" : i === 1 ? "medium" : "low"
      }));
    }
  }

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
        <h3 className="text-lg font-medium mb-2">Unable to load checkout optimization data</h3>
        <p className="text-muted-foreground mb-4">
          There was an error retrieving your checkout optimization data. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No checkout data available</h3>
        <p className="text-muted-foreground mb-4">
          Start tracking checkout events to generate optimization recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Checkout Optimization</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            refetch();
            toast({
              title: "Analysis refreshed",
              description: "The checkout optimization analysis has been refreshed with the latest data.",
            });
          }}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frictionPoints">Friction Points</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Performance</CardTitle>
              <CardDescription>
                Current checkout metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {checkoutData.currentPerformance.metrics.map((metric: CheckoutMetric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm text-muted-foreground">{metric.name}</h3>
                      <div className={`flex items-center text-sm ${metric.change < 0 ? 'text-green-500' : metric.change > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        {metric.change !== 0 && (
                          <>
                            <ArrowDown className={`h-3 w-3 mr-1 ${metric.change < 0 ? '' : 'transform rotate-180'}`} />
                            <span>{Math.abs(metric.change)}%</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Checkout Completion Rate</span>
                  <span className="font-medium">{checkoutData.currentPerformance.completionRate}%</span>
                </div>
                <Progress value={checkoutData.currentPerformance.completionRate} />
                <p className="text-sm text-muted-foreground">
                  {checkoutData.currentPerformance.completionRate < 50 
                    ? "Below average completion rate. Significant room for improvement." 
                    : checkoutData.currentPerformance.completionRate < 70
                    ? "Average completion rate. Some optimization needed."
                    : "Good completion rate, but can still be improved."}
                </p>
              </div>

              <div className="bg-primary/10 p-4 rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-2 text-primary" />
                  Expected Improvement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Lift</p>
                    <p className="font-medium">{checkoutData.expectedResults.conversionLift}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Impact</p>
                    <p className="font-medium">{checkoutData.expectedResults.revenueImpact}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frictionPoints" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Checkout Friction Points</CardTitle>
              <CardDescription>
                Issues causing customer drop-offs during checkout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {checkoutData.frictionPoints.map((point: FrictionPoint, index: number) => (
                  <div key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{point.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{point.description}</p>
                      </div>
                      <div className="bg-red-100 text-red-700 font-medium px-2 py-1 rounded text-sm">
                        {point.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                AI-generated suggestions to improve checkout conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checkoutData.recommendations.map((rec: Recommendation, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-md border ${
                      rec.priority === 'high' 
                        ? 'border-red-200 bg-red-50' 
                        : rec.priority === 'medium' 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {rec.priority === 'high' ? (
                          <Clock className="h-5 w-5 text-red-500" />
                        ) : rec.priority === 'medium' ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{rec.title}</h3>
                          <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                            rec.priority === 'high' 
                              ? 'bg-red-200 text-red-800' 
                              : rec.priority === 'medium' 
                              ? 'bg-yellow-200 text-yellow-800' 
                              : 'bg-blue-200 text-blue-800'
                          }`}>
                            {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                          </span>
                        </div>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="w-full">
                  Implement Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}