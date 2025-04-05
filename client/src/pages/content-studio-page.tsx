import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { useContentScheduler } from "@/hooks/use-content-scheduler";
import { TemplateGallery } from "@/components/studio/template-gallery";
import { UGCGenerator } from "@/components/ai/ugc-generator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAIProviders } from "@/hooks/use-ai-providers";
import { PlusCircle, Search, Zap } from "lucide-react";

type TabType = "templates" | "ugc-generator" | "viral-videos" | "carousel-maker";

export default function ContentStudioPage() {
  const { openScheduler } = useContentScheduler();
  const [activeTab, setActiveTab] = useState<TabType>("templates");
  const [searchQuery, setSearchQuery] = useState("");
  const { providers } = useAIProviders();
  
  // Quick action to create new content
  const handleNewContent = () => {
    openScheduler();
  };
  
  return (
    <DashboardLayout title="Content Studio">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Content Studio</h2>
            <p className="text-sm text-gray-500">
              Create and customize high-converting content for your campaigns
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search templates"
                className="pl-9 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleNewContent}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Content
            </Button>
          </div>
        </div>
        
        {/* AI Provider Status */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>AI Providers</CardTitle>
            <CardDescription>
              Current status of AI providers for content generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {providers.slice(0, 4).map((provider) => (
                <div 
                  key={provider.name}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    provider.status === 'active' && provider.usage.percentage < 90
                      ? 'bg-green-400'
                      : provider.status === 'active' && provider.usage.percentage >= 90
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  } mb-2`}></div>
                  <div className="text-sm font-medium">{provider.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{provider.usage.percentage}% used</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full ${
                        provider.usage.percentage < 70 
                          ? 'bg-primary-600' 
                          : provider.usage.percentage < 90
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`} 
                      style={{ width: `${provider.usage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Content Studio Tabs */}
        <Tabs 
          defaultValue="templates" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="templates">Content Templates</TabsTrigger>
            <TabsTrigger value="ugc-generator">UGC Generator</TabsTrigger>
            <TabsTrigger value="viral-videos">Viral Videos</TabsTrigger>
            <TabsTrigger value="carousel-maker">Carousel Maker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <TemplateGallery searchQuery={searchQuery} />
          </TabsContent>
          
          <TabsContent value="ugc-generator">
            <UGCGenerator />
          </TabsContent>
          
          <TabsContent value="viral-videos">
            <Card>
              <CardHeader>
                <CardTitle>Viral Video Templates</CardTitle>
                <CardDescription>
                  Create attention-grabbing videos using proven viral formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { 
                      title: "Hook & Tutorial", 
                      description: "Problem → Solution → Tutorial format", 
                      duration: "30-60s" 
                    },
                    { 
                      title: "Top 5 List", 
                      description: "Countdown of top industry tips", 
                      duration: "45-90s" 
                    },
                    { 
                      title: "Before & After", 
                      description: "Transformation showcase with results", 
                      duration: "15-30s" 
                    },
                    { 
                      title: "Day in the Life", 
                      description: "Behind-the-scenes authentic content", 
                      duration: "60-90s" 
                    },
                    { 
                      title: "Reaction Style", 
                      description: "Surprising reactions to products/services", 
                      duration: "20-40s" 
                    },
                    { 
                      title: "Expert Advice", 
                      description: "Authoritative tips in your niche", 
                      duration: "45-75s" 
                    }
                  ].map((template, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        <Zap className="h-10 w-10 text-primary-500" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{template.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {template.duration}
                          </span>
                          <Button size="sm" onClick={openScheduler}>Use Template</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="carousel-maker">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Carousel Maker</CardTitle>
                <CardDescription>
                  Create engaging multi-slide carousels that drive saves and shares
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { 
                      title: "How-To Guide", 
                      slides: 5,
                      description: "Step-by-step instructions in a visual format" 
                    },
                    { 
                      title: "Tips & Tricks", 
                      slides: 7,
                      description: "Collection of valuable tips for your audience" 
                    },
                    { 
                      title: "Before & After", 
                      slides: 2,
                      description: "Showcase transformations and results" 
                    },
                    { 
                      title: "FAQ Series", 
                      slides: 5,
                      description: "Answer common questions in your industry" 
                    }
                  ].map((template, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 border-b">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{template.title}</h3>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {template.slides} slides
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Engagement boosting format</span>
                        <Button size="sm" onClick={openScheduler}>Use Template</Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Carousel Best Practices</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      Start with an attention-grabbing cover slide that promises value
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      Keep design consistent across all slides for brand recognition
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      Include a clear CTA on the final slide
                    </li>
                    <li className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                      Use data or statistics to increase credibility
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
