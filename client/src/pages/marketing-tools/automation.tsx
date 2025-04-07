import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Code, Zap, BellPlus, Clock, MailCheck, Bot, Flag } from "lucide-react";

export default function AutomationPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Marketing Automation</h1>
        <p className="text-muted-foreground mt-2">
          Automate your marketing tasks and workflows to save time and improve efficiency
        </p>
      </header>

      <Tabs defaultValue="workflows">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Content Publication
                </CardTitle>
                <CardDescription>
                  Automatically publish content across your connected platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Set up rules to publish content at optimal times based on your audience activity.
                </p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellPlus className="mr-2 h-5 w-5 text-primary" />
                  Engagement Responses
                </CardTitle>
                <CardDescription>
                  Auto-respond to comments and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create AI-powered responses to engage with your audience.
                </p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MailCheck className="mr-2 h-5 w-5 text-primary" />
                  Email Sequences
                </CardTitle>
                <CardDescription>
                  Automate email marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create drip campaigns and follow-up sequences for leads and customers.
                </p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="mr-2 h-5 w-5 text-primary" />
                  Custom Workflow
                </CardTitle>
                <CardDescription>
                  Build your own automated workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create complex custom workflows with our visual builder.
                </p>
                <Button variant="outline" size="sm" className="w-full">Create Workflow</Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button>
              <Zap className="mr-2 h-4 w-4" /> Create New Workflow
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flag className="mr-2 h-5 w-5 text-primary" />
                  Event Triggers
                </CardTitle>
                <CardDescription>
                  Actions triggered by specific events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create triggers based on user actions, content performance, or external events.
                </p>
                <Button variant="outline" size="sm" className="w-full">Manage Triggers</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-primary" />
                  AI Detection
                </CardTitle>
                <CardDescription>
                  Smart triggers powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Leverage AI to detect patterns and trigger appropriate actions automatically.
                </p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Time-Based Triggers
                </CardTitle>
                <CardDescription>
                  Schedule actions at specific times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create schedules for recurring tasks and automated actions.
                </p>
                <Button variant="outline" size="sm" className="w-full">Manage Schedules</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}