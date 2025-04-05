import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Image, Settings, BarChart2, Zap } from "lucide-react";
import { Link } from "wouter";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || user?.username}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild>
            <Link href="/content-studio">
              <Zap className="mr-2 h-4 w-4" /> Create Content
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Content Calendar</CardTitle>
            <CardDescription>Upcoming scheduled content</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : dashboardData?.upcomingContent?.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData.upcomingContent.slice(0, 3).map((content: any) => (
                  <li key={content.id} className="p-2 rounded-md border flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{content.title}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(content.scheduledAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center mb-2">No upcoming content scheduled</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/content-calendar">
                    <Calendar className="mr-2 h-4 w-4" /> Schedule Content
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Platform Connections</CardTitle>
            <CardDescription>Your connected social platforms</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : dashboardData?.platforms?.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2">
                {dashboardData.platforms.map((platform: any) => (
                  <li key={platform.id} className="p-2 rounded-md border flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {platform.platform.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{platform.platform}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center mb-2">No platforms connected</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Connect Platforms
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Credits</CardTitle>
            <CardDescription>Available AI generation credits</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : dashboardData?.aiProviders ? (
              <div className="space-y-3">
                {dashboardData.aiProviders.slice(0, 3).map((provider: any) => (
                  <div key={provider.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{provider.name}</span>
                      <span className="text-xs text-muted-foreground">{provider.usage.daily}/{provider.dailyLimit}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(provider.usage.daily / provider.dailyLimit) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/ai-generator">
                    <Zap className="mr-2 h-4 w-4" /> Generate AI Content
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-center mb-2">AI provider data not available</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/ai-generator">
                    <Zap className="mr-2 h-4 w-4" /> Try AI Generator
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Frequently used tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                <Link href="/content-calendar">
                  <Calendar className="h-6 w-6" />
                  <span>Calendar</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                <Link href="/content-studio">
                  <Image className="h-6 w-6" />
                  <span>Studio</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                <Link href="/ai-generator">
                  <Zap className="h-6 w-6" />
                  <span>AI Generator</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
                <Link href="/analytics">
                  <BarChart2 className="h-6 w-6" />
                  <span>Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}