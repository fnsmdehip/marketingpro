import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Image, 
  Copy, 
  Sparkles, 
  PenTool,
  SlidersHorizontal,
  BookOpen,
  Video,
  CheckCircle,
  MessageCircle,
  Save,
  Share2
} from "lucide-react";

export default function PromptArsenalPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Prompt Arsenal</h1>
        <p className="text-muted-foreground mt-2">
          Powerful AI prompts to supercharge your marketing content creation
        </p>
      </header>

      <Tabs defaultValue="social">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="ads">Ad Copy</TabsTrigger>
          <TabsTrigger value="visual">Visual Content</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Social Media Prompt Generator
                  </CardTitle>
                  <CardDescription>
                    Create engaging social media content with AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Platform</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Twitter/X</Button>
                      <Button variant="outline" size="sm">Instagram</Button>
                      <Button variant="outline" size="sm">Facebook</Button>
                      <Button variant="outline" size="sm">LinkedIn</Button>
                      <Button variant="outline" size="sm">TikTok</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Engagement Post</Button>
                      <Button variant="outline" size="sm">Product Promo</Button>
                      <Button variant="outline" size="sm">Story/Reel</Button>
                      <Button variant="outline" size="sm">Thread</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic or Keywords</label>
                    <Input placeholder="Enter topic or keywords" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Professional</Button>
                      <Button variant="outline" size="sm">Casual</Button>
                      <Button variant="outline" size="sm">Humorous</Button>
                      <Button variant="outline" size="sm">Inspirational</Button>
                      <Button variant="outline" size="sm">Educational</Button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Advanced Options
                    </Button>
                    <Button>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Saved Prompts</CardTitle>
                  <CardDescription>
                    Your favorite prompt templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Engagement Booster</h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Perfect for creating conversation-starter posts</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Twitter</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Engagement</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Product Launch</h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Template for announcing new products</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">All Platforms</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Promo</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-2">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Template Library
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                Generated Content
              </CardTitle>
              <CardDescription>
                Your AI-generated social media content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span className="font-medium">Twitter Engagement Post</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea 
                  className="min-h-[100px] mb-4"
                  value="Looking to level up your marketing game? 🚀

The one strategy most businesses overlook is consistency in their content calendar.

What's your biggest challenge with staying consistent?

#MarketingTips #ContentStrategy"
                  readOnly
                />
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Generated 2 minutes ago</div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenTool className="mr-2 h-5 w-5 text-primary" />
                Email Marketing Prompts
              </CardTitle>
              <CardDescription>
                Create high-converting email campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Select a prompt template to create engaging email content for your campaigns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Welcome Sequence</div>
                    <div className="text-sm text-muted-foreground">5-part email sequence for new subscribers</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Abandoned Cart</div>
                    <div className="text-sm text-muted-foreground">Reminder emails for shopping cart recovery</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Product Launch</div>
                    <div className="text-sm text-muted-foreground">Build anticipation for new products</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Re-engagement</div>
                    <div className="text-sm text-muted-foreground">Win back inactive subscribers</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Newsletter</div>
                    <div className="text-sm text-muted-foreground">Regular updates and valuable content</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Seasonal Promotion</div>
                    <div className="text-sm text-muted-foreground">Holiday and seasonal campaign templates</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Ad Copy Generator
              </CardTitle>
              <CardDescription>
                Create compelling ad copy for various platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate high-converting ad copy for your marketing campaigns across different platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Google Search Ads</div>
                    <div className="text-sm text-muted-foreground">Headlines and descriptions for search campaigns</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">Facebook/Instagram Ads</div>
                    <div className="text-sm text-muted-foreground">Engaging social media ad copy</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="text-left">
                    <div className="font-medium mb-1">YouTube Ad Scripts</div>
                    <div className="text-sm text-muted-foreground">Video ad scripts that convert</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5 text-primary" />
                Visual Content Prompts
              </CardTitle>
              <CardDescription>
                Create stunning visuals with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium mb-1">Product Imagery</div>
                      <div className="text-sm text-muted-foreground">Generate professional product visuals</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium mb-1">Social Media Graphics</div>
                      <div className="text-sm text-muted-foreground">Engaging images for social posts</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex items-center">
                    <Video className="h-8 w-8 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium mb-1">Video Content</div>
                      <div className="text-sm text-muted-foreground">Generate video ideas and storyboards</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4 px-4">
                  <div className="flex items-center">
                    <Image className="h-8 w-8 mr-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium mb-1">Banner Ads</div>
                      <div className="text-sm text-muted-foreground">Create eye-catching banner advertisements</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}