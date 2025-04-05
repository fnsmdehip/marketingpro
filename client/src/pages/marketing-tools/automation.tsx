import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Cog, 
  Globe, 
  Mail, 
  MessageSquare, 
  Plus, 
  Zap
} from "lucide-react";

export default function Automation() {
  const [selectedTab, setSelectedTab] = useState("active");
  
  return (
    <DashboardLayout title="Automation">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Marketing Automation</h2>
            <p className="text-sm text-gray-500">
              Automate your marketing workflows and save time
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="ads">Ad Management</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Automation
            </Button>
          </div>
        </div>
        
        {/* Automation Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Automations</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">12</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      3
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous month</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Time Saved</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">26.5 hrs</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      4.2
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">this month</p>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Posts Scheduled</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">78</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">this month</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-md">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Platforms Connected</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">7</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">new integrations</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-md">
                  <Globe className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Automations Tabs */}
        <Tabs 
          defaultValue="active" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Automations</TabsTrigger>
            <TabsTrigger value="templates">Automation Templates</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          {/* Active Automations Tab */}
          <TabsContent value="active">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[
                  {
                    name: "Social Media Content Calendar",
                    description: "Automatically schedules posts to multiple platforms based on your content calendar.",
                    status: "Active",
                    lastRun: "5 hours ago",
                    platforms: ["Twitter/X", "LinkedIn", "Instagram", "Facebook"],
                    actions: 247,
                    timeSaved: "18.2 hrs"
                  },
                  {
                    name: "Email Drip Campaign",
                    description: "Sends a series of targeted emails to leads based on their behavior and engagement.",
                    status: "Active",
                    lastRun: "2 hours ago",
                    platforms: ["Email"],
                    actions: 532,
                    timeSaved: "12.7 hrs"
                  },
                  {
                    name: "Content Repurposing",
                    description: "Transforms long-form content into multiple formats for different platforms.",
                    status: "Active",
                    lastRun: "1 day ago",
                    platforms: ["Blog", "Social Media", "Newsletter"],
                    actions: 64,
                    timeSaved: "8.4 hrs"
                  },
                  {
                    name: "Lead Nurturing Workflow",
                    description: "Automates follow-ups with leads based on their interactions with your content.",
                    status: "Paused",
                    lastRun: "5 days ago",
                    platforms: ["Email", "CRM"],
                    actions: 187,
                    timeSaved: "5.3 hrs"
                  },
                  {
                    name: "Competitor Monitoring",
                    description: "Tracks competitors' content and social activity and sends daily digest reports.",
                    status: "Active",
                    lastRun: "12 hours ago",
                    platforms: ["Email", "Analytics"],
                    actions: 92,
                    timeSaved: "4.1 hrs"
                  }
                ].map((automation, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{automation.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {automation.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                            automation.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {automation.status}
                          </span>
                          <Switch checked={automation.status === 'Active'} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Platforms</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {automation.platforms.map((platform, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Actions</p>
                          <p className="text-sm font-medium mt-1">{automation.actions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time Saved</p>
                          <p className="text-sm font-medium mt-1">{automation.timeSaved}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">Last run: {automation.lastRun}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              View History
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Cog className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common automation tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New Content
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      Create Email Sequence
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Set Up Chat Bot
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="mr-2 h-4 w-4" />
                      Create Custom Workflow
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Platforms</CardTitle>
                    <CardDescription>
                      Manage your integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Twitter/X", connected: true, lastSync: "1 hour ago" },
                        { name: "Instagram", connected: true, lastSync: "3 hours ago" },
                        { name: "LinkedIn", connected: true, lastSync: "2 hours ago" },
                        { name: "Facebook", connected: true, lastSync: "3 hours ago" },
                        { name: "TikTok", connected: false, lastSync: "Never" },
                        { name: "Pinterest", connected: false, lastSync: "Never" },
                        { name: "Email Service", connected: true, lastSync: "30 minutes ago" }
                      ].map((platform, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">{platform.name}</p>
                            <p className="text-xs text-gray-500">Last sync: {platform.lastSync}</p>
                          </div>
                          <div className="flex items-center">
                            <Switch checked={platform.connected} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Connect New Platform
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Automation Health</CardTitle>
                    <CardDescription>
                      System status and issues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">System Status</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          All Systems Normal
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">API Rate Limits</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Good (72%)
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Scheduled Tasks</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          3 Pending
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Error Rate</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Low (0.3%)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Automation Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Social Media Content Calendar",
                  description: "Schedule content across multiple platforms with automatic posting at optimal times.",
                  category: "Social Media",
                  complexity: "Medium",
                  setupTime: "15-20 min"
                },
                {
                  name: "Welcome Email Sequence",
                  description: "Automatically send a series of welcome emails to new subscribers and track engagement.",
                  category: "Email",
                  complexity: "Easy",
                  setupTime: "10-15 min"
                },
                {
                  name: "Lead Nurturing Workflow",
                  description: "Qualify and nurture leads with personalized content based on their behavior and interests.",
                  category: "Lead Generation",
                  complexity: "Advanced",
                  setupTime: "25-30 min"
                },
                {
                  name: "Content Repurposing Workflow",
                  description: "Transform long-form content into multiple formats for different platforms automatically.",
                  category: "Content",
                  complexity: "Medium",
                  setupTime: "15-20 min"
                },
                {
                  name: "Competitive Analysis Report",
                  description: "Monitor competitors' content and social media activity with automated weekly reports.",
                  category: "Analytics",
                  complexity: "Medium",
                  setupTime: "15-20 min"
                },
                {
                  name: "Product Launch Campaign",
                  description: "Coordinate social posts, emails, and ads for a synchronized product launch.",
                  category: "Marketing Campaign",
                  complexity: "Advanced",
                  setupTime: "30-40 min"
                },
                {
                  name: "Content Performance Alerts",
                  description: "Get notified when content hits performance thresholds or requires attention.",
                  category: "Analytics",
                  complexity: "Easy",
                  setupTime: "5-10 min"
                },
                {
                  name: "Customer Review Monitoring",
                  description: "Track and respond to customer reviews across multiple platforms automatically.",
                  category: "Reputation Management",
                  complexity: "Medium",
                  setupTime: "15-20 min"
                },
                {
                  name: "Abandoned Cart Recovery",
                  description: "Automatically send reminders to users who abandoned their shopping carts.",
                  category: "E-commerce",
                  complexity: "Medium",
                  setupTime: "20-25 min"
                }
              ].map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription>
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-500">Category</span>
                        <span className="text-xs font-medium mt-1">{template.category}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-500">Complexity</span>
                        <span className="text-xs font-medium mt-1">{template.complexity}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                        <span className="text-xs text-gray-500">Setup Time</span>
                        <span className="text-xs font-medium mt-1">{template.setupTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Use Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Activity Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Automation Activity Log</CardTitle>
                <CardDescription>
                  Recent automation activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by automation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Automations</SelectItem>
                        <SelectItem value="social">Social Media Calendar</SelectItem>
                        <SelectItem value="email">Email Drip Campaign</SelectItem>
                        <SelectItem value="content">Content Repurposing</SelectItem>
                        <SelectItem value="leads">Lead Nurturing</SelectItem>
                        <SelectItem value="monitor">Competitor Monitoring</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    {[
                      {
                        automation: "Social Media Calendar",
                        event: "Post Published",
                        details: "LinkedIn post 'Marketing Automation Trends 2025' published successfully",
                        timestamp: "Today, 2:45 PM",
                        type: "success"
                      },
                      {
                        automation: "Email Drip Campaign",
                        event: "Email Sent",
                        details: "Welcome email #3 sent to 47 recipients",
                        timestamp: "Today, 1:30 PM",
                        type: "success"
                      },
                      {
                        automation: "Competitor Monitoring",
                        event: "Report Generated",
                        details: "Weekly competitor analysis report generated and emailed",
                        timestamp: "Today, 10:15 AM",
                        type: "success"
                      },
                      {
                        automation: "Content Repurposing",
                        event: "API Rate Limit",
                        details: "Instagram API rate limit reached, process paused for 15 minutes",
                        timestamp: "Today, 9:32 AM",
                        type: "warning"
                      },
                      {
                        automation: "Social Media Calendar",
                        event: "Post Failed",
                        details: "Twitter post failed to publish due to authentication issue",
                        timestamp: "Yesterday, 4:17 PM",
                        type: "error"
                      },
                      {
                        automation: "Lead Nurturing",
                        event: "Workflow Paused",
                        details: "Workflow paused manually by user admin@example.com",
                        timestamp: "Yesterday, 2:03 PM",
                        type: "info"
                      },
                      {
                        automation: "Email Drip Campaign",
                        event: "Sequence Completed",
                        details: "Onboarding sequence completed for 28 users",
                        timestamp: "Yesterday, 11:45 AM",
                        type: "success"
                      },
                      {
                        automation: "Social Media Calendar",
                        event: "Post Scheduled",
                        details: "12 posts scheduled across 4 platforms for next week",
                        timestamp: "Apr 3, 2025",
                        type: "info"
                      },
                      {
                        automation: "Competitor Monitoring",
                        event: "New Competitor",
                        details: "New competitor 'GrowthPro' added to monitoring list",
                        timestamp: "Apr 2, 2025",
                        type: "info"
                      },
                      {
                        automation: "Content Repurposing",
                        event: "Process Completed",
                        details: "Blog post 'Ultimate Guide to SEO' repurposed into 8 content pieces",
                        timestamp: "Apr 1, 2025",
                        type: "success"
                      }
                    ].map((log, index) => (
                      <div 
                        key={index} 
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full mr-2 ${
                                log.type === 'success' ? 'bg-green-500' :
                                log.type === 'error' ? 'bg-red-500' :
                                log.type === 'warning' ? 'bg-amber-500' :
                                'bg-blue-500'
                              }`}></span>
                              <span className="text-sm font-medium">{log.event}</span>
                              <span className="mx-2 text-gray-300">|</span>
                              <span className="text-sm text-gray-500">{log.automation}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                          </div>
                          <span className="text-xs text-gray-500">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previous</Button>
                <div className="text-sm text-gray-500">
                  Showing 1-10 of 143 logs
                </div>
                <Button variant="outline">Next</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}