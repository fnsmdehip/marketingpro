import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  ShoppingBag, 
  BarChart, 
  MessageSquare, 
  Mail, 
  Activity, 
  Users, 
  Layers
} from "lucide-react";

export default function ConversionTacticsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Conversion Tactics</h1>
        <p className="text-muted-foreground mt-2">
          Optimize your marketing funnel and increase conversion rates with data-driven tactics
        </p>
      </header>

      <Tabs defaultValue="optimization">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="optimization">Funnel Optimization</TabsTrigger>
          <TabsTrigger value="templates">Conversion Templates</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Funnel Analysis
                </CardTitle>
                <CardDescription>
                  Analyze your conversion funnel performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Identify bottlenecks and optimization opportunities in your marketing funnel.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Analysis</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                  Checkout Optimization
                </CardTitle>
                <CardDescription>
                  Improve your checkout conversion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize checkout flows with best practices and persuasive elements.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Recommendations</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Conversion Tracking
                </CardTitle>
                <CardDescription>
                  Set up and monitor conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track conversion rates and ROI across your marketing campaigns.
                </p>
                <Button variant="outline" size="sm" className="w-full">Configure Tracking</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                  Social Proof Templates
                </CardTitle>
                <CardDescription>
                  Leverage customer testimonials and reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Effective templates for showcasing social proof to boost conversions.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Templates</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  Email Conversion Sequences
                </CardTitle>
                <CardDescription>
                  High-converting email templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Proven email sequences for nurturing leads and driving conversions.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Sequences</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 h-5 w-5 text-primary" />
                  Landing Page Templates
                </CardTitle>
                <CardDescription>
                  High-converting page layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimized templates for landing pages that convert visitors into customers.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Templates</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-primary" />
                  A/B Testing Dashboard
                </CardTitle>
                <CardDescription>
                  Create and manage split tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Test different variations of your marketing assets to find the highest performers.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Dashboard</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Audience Segmentation
                </CardTitle>
                <CardDescription>
                  Test different audience segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create audience segments to test how different groups respond to your marketing.
                </p>
                <Button variant="outline" size="sm" className="w-full">Create Segments</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}