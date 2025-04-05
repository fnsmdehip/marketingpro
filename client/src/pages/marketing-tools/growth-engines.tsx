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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowUpRight, 
  BarChart2, 
  FileText, 
  Globe, 
  BarChart, 
  Mail, 
  Plus, 
  Search, 
  Users, 
  Zap
} from "lucide-react";

export default function GrowthEngines() {
  const [selectedTab, setSelectedTab] = useState("seo");
  const [timeFrame, setTimeFrame] = useState("30d");
  
  return (
    <DashboardLayout title="Growth Engines">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Growth Engines</h2>
            <p className="text-sm text-gray-500">
              Scalable strategies to drive sustainable growth
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select 
              value={timeFrame} 
              onValueChange={setTimeFrame}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </div>
        
        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Website Traffic</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">24,582</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      18.3%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-md">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">New Subscribers</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">1,247</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      23.5%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
                </div>
                <div className="p-2 bg-green-50 rounded-md">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">3.8%</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      0.6%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-md">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer LTV</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-semibold">$284</h3>
                    <span className="ml-2 text-xs font-medium text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      7.2%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
                </div>
                <div className="p-2 bg-orange-50 rounded-md">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Growth Strategies Tabs */}
        <Tabs 
          defaultValue="seo" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="seo">SEO Strategy</TabsTrigger>
            <TabsTrigger value="content">Content Marketing</TabsTrigger>
            <TabsTrigger value="email">Email Automation</TabsTrigger>
            <TabsTrigger value="referral">Referral Program</TabsTrigger>
          </TabsList>
          
          {/* SEO Strategy Tab */}
          <TabsContent value="seo">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Keyword Performance</CardTitle>
                    <CardDescription>
                      Rankings and traffic for your top-performing keywords
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="w-1/3 font-medium text-sm">Keyword</div>
                        <div className="w-1/6 text-center font-medium text-sm">Position</div>
                        <div className="w-1/6 text-center font-medium text-sm">Change</div>
                        <div className="w-1/6 text-center font-medium text-sm">Traffic</div>
                        <div className="w-1/6 text-center font-medium text-sm">Difficulty</div>
                      </div>
                      
                      {[
                        {
                          keyword: "digital marketing strategy",
                          position: 3,
                          change: 2,
                          traffic: 860,
                          difficulty: 78
                        },
                        {
                          keyword: "content marketing tools",
                          position: 5,
                          change: 1,
                          traffic: 620,
                          difficulty: 65
                        },
                        {
                          keyword: "social media automation",
                          position: 4,
                          change: -1,
                          traffic: 540,
                          difficulty: 72
                        },
                        {
                          keyword: "email marketing templates",
                          position: 8,
                          change: 3,
                          traffic: 420,
                          difficulty: 58
                        },
                        {
                          keyword: "seo best practices 2025",
                          position: 6,
                          change: 0,
                          traffic: 380,
                          difficulty: 67
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div className="w-1/3 text-sm font-medium">{item.keyword}</div>
                          <div className="w-1/6 text-center text-sm">{item.position}</div>
                          <div className={`w-1/6 text-center text-sm ${
                            item.change > 0 ? 'text-green-600' :
                            item.change < 0 ? 'text-red-600' :
                            'text-gray-500'
                          }`}>
                            {item.change > 0 ? `+${item.change}` : item.change}
                          </div>
                          <div className="w-1/6 text-center text-sm">{item.traffic}</div>
                          <div className="w-1/6 text-center text-sm">
                            <div className="flex items-center justify-center">
                              <div className="w-full max-w-[80px] bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    item.difficulty < 50 ? 'bg-green-500' :
                                    item.difficulty < 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`} 
                                  style={{ width: `${item.difficulty}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Discover New Keywords
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Performance Audit</CardTitle>
                    <CardDescription>
                      Key factors affecting your search rankings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Page Speed</h4>
                          <span className="text-sm font-medium text-amber-600">78/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Improve mobile page speed by optimizing images and reducing JavaScript
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Content Quality</h4>
                          <span className="text-sm font-medium text-green-600">92/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          High-quality content with proper keyword usage and semantic relevance
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Backlink Profile</h4>
                          <span className="text-sm font-medium text-blue-600">83/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Strong domain authority with diverse backlinks from quality sites
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Technical SEO</h4>
                          <span className="text-sm font-medium text-amber-600">76/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Some issues with structured data and internal linking structure
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Mobile Optimization</h4>
                          <span className="text-sm font-medium text-green-600">95/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Excellent mobile experience with responsive design
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Full Audit Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Organic Search Growth</CardTitle>
                    <CardDescription>
                      Month-over-month organic traffic
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between">
                      {[12500, 13800, 13200, 15400, 18700, 24582].map((value, index) => {
                        const percentage = (value / 25000) * 100;
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-12 bg-primary-100 hover:bg-primary-200 transition-colors rounded-t"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">
                              {index === 0 ? 'Nov' : 
                               index === 1 ? 'Dec' : 
                               index === 2 ? 'Jan' : 
                               index === 3 ? 'Feb' : 
                               index === 4 ? 'Mar' : 'Apr'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>
                      Highest impact SEO improvements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Fix Core Web Vitals",
                          description: "Address Largest Contentful Paint issues on product pages",
                          impact: "High",
                          effort: "Medium"
                        },
                        {
                          title: "Improve Internal Linking",
                          description: "Add contextual links between related content",
                          impact: "Medium",
                          effort: "Low"
                        },
                        {
                          title: "Optimize Title Tags",
                          description: "Update title tags for 12 blog posts targeting high-value keywords",
                          impact: "Medium",
                          effort: "Low"
                        },
                        {
                          title: "Create Content Clusters",
                          description: "Develop pillar pages for main service categories",
                          impact: "High",
                          effort: "High"
                        },
                        {
                          title: "Fix Broken Backlinks",
                          description: "Reclaim 18 broken backlinks with 301 redirects",
                          impact: "Medium",
                          effort: "Low"
                        }
                      ].map((action, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{action.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                action.impact === 'High' ? 'bg-green-100 text-green-700' :
                                action.impact === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {action.impact}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                action.effort === 'Low' ? 'bg-green-100 text-green-700' :
                                action.effort === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {action.effort}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Content Marketing Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Content Performance</CardTitle>
                    <CardDescription>
                      Your top-performing content across channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="w-1/2 font-medium text-sm">Content</div>
                        <div className="w-1/6 text-center font-medium text-sm">Views</div>
                        <div className="w-1/6 text-center font-medium text-sm">Engagement</div>
                        <div className="w-1/6 text-center font-medium text-sm">Conversions</div>
                      </div>
                      
                      {[
                        {
                          title: "10 AI Tools Every Marketer Needs in 2025",
                          type: "blog",
                          views: 14280,
                          engagement: "8.3%",
                          conversions: 128
                        },
                        {
                          title: "How to Create a Content Calendar [Template]",
                          type: "guide",
                          views: 9650,
                          engagement: "12.4%",
                          conversions: 357
                        },
                        {
                          title: "B2B Content Marketing: The Ultimate Guide",
                          type: "ebook",
                          views: 7320,
                          engagement: "15.8%",
                          conversions: 412
                        },
                        {
                          title: "Marketing Automation Masterclass",
                          type: "webinar",
                          views: 6840,
                          engagement: "24.5%",
                          conversions: 286
                        },
                        {
                          title: "Social Media Strategy Template 2025",
                          type: "template",
                          views: 5930,
                          engagement: "18.2%",
                          conversions: 268
                        }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                          <div className="w-1/2">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${
                                item.type === 'blog' ? 'bg-blue-100 text-blue-600' :
                                item.type === 'guide' ? 'bg-green-100 text-green-600' :
                                item.type === 'ebook' ? 'bg-purple-100 text-purple-600' :
                                item.type === 'webinar' ? 'bg-red-100 text-red-600' :
                                'bg-amber-100 text-amber-600'
                              }`}>
                                <Zap className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-1/6 text-center">
                            <span className="text-sm">{item.views.toLocaleString()}</span>
                          </div>
                          <div className="w-1/6 text-center">
                            <span className="text-sm">{item.engagement}</span>
                          </div>
                          <div className="w-1/6 text-center">
                            <span className="text-sm">{item.conversions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Content Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Content Calendar</CardTitle>
                    <CardDescription>
                      Upcoming content scheduled for publication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Video Marketing Trends for Q3 2025",
                          type: "blog",
                          date: "May 10, 2025",
                          status: "In Progress",
                          author: "Alex Johnson"
                        },
                        {
                          title: "Ultimate Guide to Marketing Attribution",
                          type: "guide",
                          date: "May 15, 2025",
                          status: "Scheduled",
                          author: "Sarah Williams"
                        },
                        {
                          title: "SEO Masterclass: Advanced Techniques",
                          type: "webinar",
                          date: "May 22, 2025",
                          status: "Planning",
                          author: "Michael Chen"
                        },
                        {
                          title: "Customer Journey Mapping Workshop",
                          type: "workshop",
                          date: "May 28, 2025",
                          status: "Planning",
                          author: "Lisa Rodriguez"
                        },
                        {
                          title: "Email Automation Playbook",
                          type: "ebook",
                          date: "June 5, 2025",
                          status: "Planning",
                          author: "David Smith"
                        }
                      ].map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                                  item.type === 'blog' ? 'bg-blue-100 text-blue-700' :
                                  item.type === 'guide' ? 'bg-green-100 text-green-700' :
                                  item.type === 'webinar' ? 'bg-red-100 text-red-700' :
                                  item.type === 'workshop' ? 'bg-purple-100 text-purple-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {item.type}
                                </span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                              </div>
                              <h4 className="text-sm font-medium mt-1">{item.title}</h4>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500 mr-3">By {item.author}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                  item.status === 'Scheduled' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Content
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Content Strategy</CardTitle>
                    <CardDescription>
                      Performance by content type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">Blog Posts</h4>
                          <span className="text-sm text-gray-500">42% of traffic</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          3.2% conversion rate, 8.7 mins avg. time on page
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">Lead Magnets</h4>
                          <span className="text-sm text-gray-500">28% of traffic</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          18.5% conversion rate, high-value email captures
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">Video Content</h4>
                          <span className="text-sm text-gray-500">15% of traffic</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          6.7% conversion rate, 4.2 mins avg. watch time
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">Case Studies</h4>
                          <span className="text-sm text-gray-500">8% of traffic</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: "8%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          12.3% conversion rate, bottom-funnel content
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium">Webinars</h4>
                          <span className="text-sm text-gray-500">7% of traffic</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: "7%" }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          22.8% conversion rate, highest-value leads
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Content Opportunities</CardTitle>
                    <CardDescription>
                      Recommended content topics based on gaps
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          topic: "AI for Content Creation",
                          searchVolume: "8.2K/mo",
                          competition: "Medium",
                          contentType: "Guide"
                        },
                        {
                          topic: "Privacy Compliance in Marketing",
                          searchVolume: "5.7K/mo",
                          competition: "Low",
                          contentType: "Webinar"
                        },
                        {
                          topic: "Marketing Attribution Models",
                          searchVolume: "4.3K/mo",
                          competition: "Medium",
                          contentType: "Blog Series"
                        },
                        {
                          topic: "Social Commerce Strategies",
                          searchVolume: "7.1K/mo",
                          competition: "High",
                          contentType: "Case Study"
                        },
                        {
                          topic: "First-Party Data Collection",
                          searchVolume: "3.8K/mo",
                          competition: "Low",
                          contentType: "Template"
                        }
                      ].map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-sm font-medium">{item.topic}</h4>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500">{item.searchVolume}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full mx-2 ${
                                  item.competition === 'Low' ? 'bg-green-100 text-green-700' :
                                  item.competition === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {item.competition}
                                </span>
                              </div>
                            </div>
                            <div>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {item.contentType}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Search className="mr-2 h-4 w-4" />
                      Research More Topics
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Email Automation Tab */}
          <TabsContent value="email">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Email Automation Workflows</CardTitle>
                    <CardDescription>
                      Active email sequences and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {[
                        {
                          name: "Welcome Sequence",
                          status: "Active",
                          emails: 5,
                          subscribers: 3872,
                          openRate: 58.4,
                          clickRate: 24.7,
                          conversionRate: 12.3
                        },
                        {
                          name: "Lead Nurturing - Marketing Tools",
                          status: "Active",
                          emails: 7,
                          subscribers: 1564,
                          openRate: 42.8,
                          clickRate: 18.5,
                          conversionRate: 8.7
                        },
                        {
                          name: "Abandoned Cart Recovery",
                          status: "Active",
                          emails: 3,
                          subscribers: 946,
                          openRate: 45.2,
                          clickRate: 32.1,
                          conversionRate: 15.8
                        },
                        {
                          name: "Product Onboarding",
                          status: "Active",
                          emails: 6,
                          subscribers: 2341,
                          openRate: 51.3,
                          clickRate: 27.6,
                          conversionRate: 9.4
                        },
                        {
                          name: "Re-Engagement Campaign",
                          status: "Paused",
                          emails: 4,
                          subscribers: 1872,
                          openRate: 32.7,
                          clickRate: 13.9,
                          conversionRate: 4.8
                        }
                      ].map((workflow, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-all">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                            <div className="mb-4 lg:mb-0">
                              <div className="flex items-center">
                                <h4 className="text-base font-medium">{workflow.name}</h4>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                  workflow.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {workflow.status}
                                </span>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span>{workflow.emails} emails</span>
                                <span className="mx-2">•</span>
                                <span>{workflow.subscribers.toLocaleString()} subscribers</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-4">
                              <div className="text-center">
                                <div className="text-sm font-medium">{workflow.openRate}%</div>
                                <div className="text-xs text-gray-500">Open Rate</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">{workflow.clickRate}%</div>
                                <div className="text-xs text-gray-500">Click Rate</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">{workflow.conversionRate}%</div>
                                <div className="text-xs text-gray-500">Conversion</div>
                              </div>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Workflow
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Email Performance</CardTitle>
                    <CardDescription>
                      Recent campaign performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="w-2/5 font-medium text-sm">Campaign</div>
                        <div className="w-1/5 text-center font-medium text-sm">Sent</div>
                        <div className="w-1/5 text-center font-medium text-sm">Open Rate</div>
                        <div className="w-1/5 text-center font-medium text-sm">Click Rate</div>
                      </div>
                      
                      {[
                        {
                          title: "April Newsletter: Marketing Trends 2025",
                          date: "Apr 15, 2025",
                          sent: 5842,
                          openRate: 48.3,
                          clickRate: 12.7
                        },
                        {
                          title: "New Feature Announcement: AI Content Generator",
                          date: "Apr 8, 2025",
                          sent: 5918,
                          openRate: 62.5,
                          clickRate: 28.4
                        },
                        {
                          title: "Webinar Invitation: Content Strategy Masterclass",
                          date: "Mar 27, 2025",
                          sent: 4731,
                          openRate: 53.7,
                          clickRate: 31.9
                        },
                        {
                          title: "Spring Sale: 30% Off Premium Plans",
                          date: "Mar 20, 2025",
                          sent: 6124,
                          openRate: 58.9,
                          clickRate: 24.3
                        },
                        {
                          title: "Case Study: How Company X Increased Conversions by 210%",
                          date: "Mar 10, 2025",
                          sent: 3287,
                          openRate: 45.6,
                          clickRate: 18.2
                        }
                      ].map((campaign, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                          <div className="w-2/5">
                            <p className="text-sm font-medium">{campaign.title}</p>
                            <p className="text-xs text-gray-500">{campaign.date}</p>
                          </div>
                          <div className="w-1/5 text-center">
                            <span className="text-sm">{campaign.sent.toLocaleString()}</span>
                          </div>
                          <div className="w-1/5 text-center">
                            <span className={`text-sm ${
                              campaign.openRate > 50 ? 'text-green-600' :
                              campaign.openRate > 40 ? 'text-amber-600' :
                              'text-gray-600'
                            }`}>{campaign.openRate}%</span>
                          </div>
                          <div className="w-1/5 text-center">
                            <span className={`text-sm ${
                              campaign.clickRate > 25 ? 'text-green-600' :
                              campaign.clickRate > 15 ? 'text-amber-600' :
                              'text-gray-600'
                            }`}>{campaign.clickRate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Subscriber Growth</CardTitle>
                    <CardDescription>
                      List growth over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end justify-between">
                      {[4260, 4720, 5150, 5630, 6080, 6540].map((value, index) => {
                        const percentage = (value / 7000) * 100;
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-12 bg-primary-100 hover:bg-primary-200 transition-colors rounded-t"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1">
                              {index === 0 ? 'Nov' : 
                               index === 1 ? 'Dec' : 
                               index === 2 ? 'Jan' : 
                               index === 3 ? 'Feb' : 
                               index === 4 ? 'Mar' : 'Apr'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <p className="text-2xl font-semibold">6,540</p>
                        <p className="text-xs text-gray-500">Total subscribers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-green-600">+7.6%</p>
                        <p className="text-xs text-gray-500">Monthly growth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Opportunities</CardTitle>
                    <CardDescription>
                      Improve your email marketing performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "A/B Test Subject Lines",
                          description: "Test variations to improve open rates for the welcome sequence.",
                          impact: "Medium",
                          status: "Not Started"
                        },
                        {
                          title: "Segment Inactive Subscribers",
                          description: "Create a re-engagement campaign for subscribers who haven't opened emails in 90+ days.",
                          impact: "High",
                          status: "In Progress"
                        },
                        {
                          title: "Optimize Send Times",
                          description: "Analyze open rates by time of day to find optimal sending windows.",
                          impact: "Medium",
                          status: "Not Started"
                        },
                        {
                          title: "Update Email Templates",
                          description: "Redesign templates for better mobile responsiveness and click rates.",
                          impact: "High",
                          status: "Not Started"
                        },
                        {
                          title: "Implement Behavioral Triggers",
                          description: "Set up automation based on website behavior to increase relevance.",
                          impact: "High",
                          status: "Not Started"
                        }
                      ].map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.impact === 'High' ? 'bg-green-100 text-green-700' :
                                item.impact === 'Medium' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.impact} Impact
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Opportunities
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Referral Program Tab */}
          <TabsContent value="referral">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Referral Program Performance</CardTitle>
                    <CardDescription>
                      Overview of your referral program metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium">Referral Links Clicked</p>
                        <p className="text-2xl font-bold mt-1">3,847</p>
                        <p className="text-xs text-blue-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          24.3% vs previous period
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 font-medium">Successful Referrals</p>
                        <p className="text-2xl font-bold mt-1">682</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          18.7% vs previous period
                        </p>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-600 font-medium">Conversion Rate</p>
                        <p className="text-2xl font-bold mt-1">17.7%</p>
                        <p className="text-xs text-amber-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          1.2% vs previous period
                        </p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium">Rewards Claimed</p>
                        <p className="text-2xl font-bold mt-1">1,364</p>
                        <p className="text-xs text-purple-600 flex items-center mt-1">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          32.1% vs previous period
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-3">Top Referrers</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <div className="w-1/3 font-medium text-sm">User</div>
                          <div className="w-1/6 text-center font-medium text-sm">Links Shared</div>
                          <div className="w-1/6 text-center font-medium text-sm">Referrals</div>
                          <div className="w-1/6 text-center font-medium text-sm">Conversion</div>
                          <div className="w-1/6 text-center font-medium text-sm">Rewards</div>
                        </div>
                        
                        {[
                          {
                            name: "Sarah Johnson",
                            email: "sarah.j@example.com",
                            shared: 152,
                            referrals: 37,
                            conversion: "24.3%",
                            rewards: "$370"
                          },
                          {
                            name: "Michael Chen",
                            email: "mchen@example.com",
                            shared: 124,
                            referrals: 28,
                            conversion: "22.6%",
                            rewards: "$280"
                          },
                          {
                            name: "Emily Williams",
                            email: "emily.w@example.com",
                            shared: 97,
                            referrals: 25,
                            conversion: "25.8%",
                            rewards: "$250"
                          },
                          {
                            name: "David Rodriguez",
                            email: "drodriguez@example.com",
                            shared: 86,
                            referrals: 19,
                            conversion: "22.1%",
                            rewards: "$190"
                          },
                          {
                            name: "Jessica Kim",
                            email: "jkim@example.com",
                            shared: 73,
                            referrals: 16,
                            conversion: "21.9%",
                            rewards: "$160"
                          }
                        ].map((user, index) => (
                          <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                            <div className="w-1/3">
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <div className="w-1/6 text-center">
                              <span className="text-sm">{user.shared}</span>
                            </div>
                            <div className="w-1/6 text-center">
                              <span className="text-sm">{user.referrals}</span>
                            </div>
                            <div className="w-1/6 text-center">
                              <span className="text-sm">{user.conversion}</span>
                            </div>
                            <div className="w-1/6 text-center">
                              <span className="text-sm font-medium text-green-600">{user.rewards}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Referrers
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Sources</CardTitle>
                    <CardDescription>
                      Where your referral traffic is coming from
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          source: "Email Sharing",
                          count: 1682,
                          percentage: 43.7,
                          conversion: 19.8
                        },
                        {
                          source: "Social Media",
                          count: 967,
                          percentage: 25.1,
                          conversion: 14.3
                        },
                        {
                          source: "Direct Link",
                          count: 753,
                          percentage: 19.6,
                          conversion: 22.5
                        },
                        {
                          source: "Messaging Apps",
                          count: 328,
                          percentage: 8.5,
                          conversion: 15.2
                        },
                        {
                          source: "Embedded Widgets",
                          count: 117,
                          percentage: 3.1,
                          conversion: 9.4
                        }
                      ].map((source, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-medium">{source.source}</h4>
                              <div className="flex items-center mt-1">
                                <span className="text-xs text-gray-500">{source.count.toLocaleString()} clicks</span>
                                <span className="mx-2 text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{source.conversion}% conversion</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{source.percentage}%</span>
                              <div className="ml-4 w-[100px] bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${source.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Current Referral Program</CardTitle>
                    <CardDescription>
                      Your active referral incentives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <h4 className="font-medium">Double-Sided Reward</h4>
                      <div className="mt-2 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Referrer gets:</span>
                          <span className="text-sm font-medium">$10 credit per referral</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Friend gets:</span>
                          <span className="text-sm font-medium">20% off first month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Start date:</span>
                          <span className="text-sm font-medium">Jan 15, 2025</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" size="sm" className="w-full">
                          Edit Program
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Share Options</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-sm">Referral Link</span>
                          <Button variant="ghost" size="sm">
                            Copy Link
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-sm">Email Template</span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-sm">Social Media Posts</span>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="text-sm">Referral Widget</span>
                          <Button variant="ghost" size="sm">
                            Get Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Program Optimization</CardTitle>
                    <CardDescription>
                      Improve your referral program performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "A/B Test Incentives",
                          description: "Test different reward amounts to optimize conversion rates.",
                          status: "Not Started"
                        },
                        {
                          title: "Implement Tiered Rewards",
                          description: "Increase rewards for users who refer multiple friends.",
                          status: "Not Started"
                        },
                        {
                          title: "Simplify Sharing Process",
                          description: "Reduce steps in the sharing flow to increase participation.",
                          status: "In Progress"
                        },
                        {
                          title: "Improve Program Visibility",
                          description: "Add referral CTA to post-purchase flows and user dashboard.",
                          status: "Not Started"
                        },
                        {
                          title: "Create Referral Leaderboard",
                          description: "Gamify the experience with public recognition for top referrers.",
                          status: "Not Started"
                        }
                      ].map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Test
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}