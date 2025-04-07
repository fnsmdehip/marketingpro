import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FunnelAnalysis from "@/components/marketing/funnel-analysis";
import CheckoutOptimization from "@/components/marketing/checkout-optimization";
import ConversionTracking from "@/components/marketing/conversion-tracking";
import { SiGoogleanalytics } from "react-icons/si";

export default function MarketingAnalytics() {
  const [activeTab, setActiveTab] = useState('funnel');

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-lg mr-3">
            <SiGoogleanalytics className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Marketing Analytics</h1>
            <p className="text-muted-foreground">
              Track and optimize your marketing performance
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Key marketing performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Monthly Visitors" 
              value="3,254" 
              changePercentage={12.5} 
              changeDirection="up"
            />
            <StatsCard 
              title="Conversion Rate" 
              value="7.3%" 
              changePercentage={2.1} 
              changeDirection="up"
            />
            <StatsCard 
              title="Avg. Session Duration" 
              value="3:42" 
              changePercentage={0.8} 
              changeDirection="up"
            />
            <StatsCard 
              title="Bounce Rate" 
              value="42%" 
              changePercentage={3.4} 
              changeDirection="down"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="checkout">Checkout Optimization</TabsTrigger>
          <TabsTrigger value="tracking">Conversion Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <FunnelAnalysis />
        </TabsContent>

        <TabsContent value="checkout" className="space-y-4">
          <CheckoutOptimization />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <ConversionTracking />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  changePercentage: number;
  changeDirection: 'up' | 'down';
}

function StatsCard({ title, value, changePercentage, changeDirection }: StatsCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className={`flex items-center mt-2 text-sm ${
        changeDirection === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {changeDirection === 'up' ? (
          <svg
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
        <span>{changePercentage}%</span>
      </div>
    </div>
  );
}