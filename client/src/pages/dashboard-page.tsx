import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatDate, formatNumber } from "@/lib/utils";
import { BarChart3, Calendar, LineChart, PlusCircle, Zap } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch analytics would go here
  const { data: analyticsData } = useQuery({
    queryKey: ["/api/analytics/summary"],
    enabled: false, // Disabled until API is implemented
  });

  // This would normally come from an API, but for development purposes:
  const mockData = {
    stats: [
      { name: "Total Content", value: 24, change: "+12%", icon: <Zap className="h-4 w-4" /> },
      { name: "Published", value: 18, change: "+8%", icon: <Calendar className="h-4 w-4" /> },
      { name: "Engagement Rate", value: "3.2%", change: "+0.8%", icon: <BarChart3 className="h-4 w-4" /> },
      { name: "Click-through Rate", value: "2.4%", change: "+0.6%", icon: <LineChart className="h-4 w-4" /> },
    ],
    upcomingContent: [
      { id: 1, title: "Marketing Strategy Guide", platform: "Blog", scheduled: new Date(Date.now() + 86400000) },
      { id: 2, title: "Product Launch Announcement", platform: "Twitter", scheduled: new Date(Date.now() + 172800000) },
      { id: 3, title: "Industry Insights", platform: "LinkedIn", scheduled: new Date(Date.now() + 259200000) },
    ],
  };

  return (
    <DashboardLayout title="Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockData.stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Content</CardTitle>
                <Button asChild size="sm">
                  <Link href="/content-calendar">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule Content
                  </Link>
                </Button>
              </div>
              <CardDescription>Your upcoming content across all platforms</CardDescription>
            </CardHeader>
            <CardContent>
              {mockData.upcomingContent.length > 0 ? (
                <div className="space-y-4">
                  {mockData.upcomingContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-muted-foreground">{content.platform}</div>
                      </div>
                      <div className="text-sm">Scheduled for {formatDate(content.scheduled)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">No upcoming content scheduled</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/content-calendar">Schedule your first content</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used tools and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
                  <Link href="/ai-generator">
                    <Zap className="mb-2 h-6 w-6" />
                    <div className="font-medium">Generate Content</div>
                    <div className="text-xs text-muted-foreground mt-1">Create with AI</div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
                  <Link href="/content-calendar">
                    <Calendar className="mb-2 h-6 w-6" />
                    <div className="font-medium">Content Calendar</div>
                    <div className="text-xs text-muted-foreground mt-1">Schedule posts</div>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col items-center justify-center p-6">
                  <Link href="/analytics">
                    <BarChart3 className="mb-2 h-6 w-6" />
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground mt-1">Track performance</div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Summary</CardTitle>
              <CardDescription>Performance metrics from the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                  Detailed analytics and performance metrics will appear here once you have published content.
                </p>
                <Button asChild>
                  <Link href="/analytics">View Full Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>Your recently created and published content</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Content Library</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                  All your created content will appear here. Start by creating your first piece of content.
                </p>
                <Button asChild>
                  <Link href="/content-studio">Create New Content</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}