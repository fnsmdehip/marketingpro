import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Rocket,
  Target,
  TrendingUp,
  Share2,
  Users,
  Mail,
  Search,
  Megaphone
} from "lucide-react";

export default function GrowthEnginesPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Growth Engines</h1>
        <p className="text-muted-foreground mt-2">
          Powerful tools and strategies to accelerate your business growth
        </p>
      </header>

      <Tabs defaultValue="acquisition">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-primary" />
                  SEO Growth
                </CardTitle>
                <CardDescription>
                  Organic search acquisition strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize your content for search engines to drive sustainable organic traffic.
                </p>
                <Button variant="outline" size="sm" className="w-full">Explore Strategies</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="mr-2 h-5 w-5 text-primary" />
                  Paid Acquisition
                </CardTitle>
                <CardDescription>
                  PPC and paid social strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize your paid advertising campaigns for maximum ROI and scale.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Campaigns</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Content Marketing
                </CardTitle>
                <CardDescription>
                  Content-driven growth strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create high-quality content that attracts and converts your target audience.
                </p>
                <Button variant="outline" size="sm" className="w-full">Content Planner</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  Email Engagement
                </CardTitle>
                <CardDescription>
                  Keep users engaged with email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create email campaigns that keep your audience engaged and coming back.
                </p>
                <Button variant="outline" size="sm" className="w-full">Email Campaigns</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Customer Success
                </CardTitle>
                <CardDescription>
                  Reduce churn and boost loyalty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Implement strategies to improve customer success and reduce churn rates.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Strategies</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Engagement Analytics
                </CardTitle>
                <CardDescription>
                  Measure and optimize engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Track user engagement metrics and identify opportunities for improvement.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Analytics</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="mr-2 h-5 w-5 text-primary" />
                  Referral Programs
                </CardTitle>
                <CardDescription>
                  Create viral referral campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Design and implement referral programs that incentivize customers to share.
                </p>
                <Button variant="outline" size="sm" className="w-full">Create Program</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Affiliate Marketing
                </CardTitle>
                <CardDescription>
                  Build a network of promoters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and manage affiliate programs to expand your marketing reach.
                </p>
                <Button variant="outline" size="sm" className="w-full">Manage Affiliates</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monetization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="mr-2 h-5 w-5 text-primary" />
                  Pricing Optimization
                </CardTitle>
                <CardDescription>
                  Optimize your pricing strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Test and optimize your pricing to maximize revenue and customer acquisition.
                </p>
                <Button variant="outline" size="sm" className="w-full">Pricing Analytics</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Upsell & Cross-sell
                </CardTitle>
                <CardDescription>
                  Increase customer lifetime value
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Implement strategies to increase revenue from existing customers.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Strategies</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}