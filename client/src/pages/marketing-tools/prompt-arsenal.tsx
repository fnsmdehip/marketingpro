import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  Share2,
  Loader2
} from "lucide-react";
import axios from "axios";

export default function PromptArsenalPage() {
  // State for form values
  const [platform, setPlatform] = useState("Twitter/X");
  const [contentType, setContentType] = useState("Engagement Post");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("Professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedContentType, setGeneratedContentType] = useState("");
  const [generationTime, setGenerationTime] = useState("");
  const { toast } = useToast();

  // Function to generate content using the AI API
  const generateContent = async () => {
    if (!keywords) {
      toast({
        title: "Missing information",
        description: "Please enter topic or keywords for your content",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // First check if there's scraped content in localStorage
      const scrapedContent = localStorage.getItem('scrapedContent');
      let contextualInfo = '';
      
      if (scrapedContent) {
        const lastScrapedURL = localStorage.getItem('lastScrapedURL') || 'a website';
        contextualInfo = `\nReference this content from ${lastScrapedURL} for context and facts (don't copy directly, just use relevant information):\n${scrapedContent.substring(0, 500)}...\n`;
        console.log("Added scraped content as context");
      }
      
      // Build the prompt based on selected options with detailed context
      const prompt = `Create a ${tone.toLowerCase()} ${platform} ${contentType.toLowerCase()} about "${keywords}".
      
      Platform-specific details:
      ${platform === "Twitter/X" ? "- Keep it under 280 characters\n- Use 1-2 relevant hashtags\n- Make it conversation-starting" : ""}
      ${platform === "Instagram" ? "- Visual-focused language\n- Include emoji suggestions for visual appeal\n- Consider where a CTA would go" : ""}
      ${platform === "LinkedIn" ? "- Professional tone with industry insights\n- Focus on value proposition\n- Include a question to drive engagement" : ""}
      ${platform === "Facebook" ? "- Conversational and community-focused\n- Slightly longer format is acceptable\n- Design for engagement metrics" : ""}
      ${platform === "TikTok" ? "- Ultra-concise and attention-grabbing\n- Trend-aware phrasing\n- Focus on hook within first sentence" : ""}
      
      Content requirements:
      - Make it engaging, shareable, and optimized for ${platform}
      - Use a ${tone.toLowerCase()} tone throughout
      - Include appropriate hashtags and calls to action
      - Focus on benefits rather than features
      - Create a compelling hook
      ${contextualInfo}
      
      The content should feel authentic and native to ${platform}, as if created by a marketing expert who specializes in this platform.`;
      
      // Call the API - our server will automatically add the context guidelines
      const response = await axios.post("/api/ai/generate/text", {
        prompt: prompt,
        model: "deepseek/deepseek-chat-v3-0324:free", // Using our DeepSeek provider
        temperature: 0.7
      });
      
      if (response.data.success) {
        setGeneratedContent(response.data.data);
        setGeneratedContentType(`${platform} ${contentType}`);
        setGenerationTime(new Date().toLocaleTimeString());
        
        toast({
          title: "Content generated!",
          description: "Your marketing content has been created successfully.",
        });
      } else {
        throw new Error(response.data.error?.message || "Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage = error instanceof Error ? error.message : "There was an error generating your content. Please try again.";
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };

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
                      {["Twitter/X", "Instagram", "Facebook", "LinkedIn", "TikTok"].map((p) => (
                        <Button 
                          key={p}
                          variant={platform === p ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setPlatform(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content Type</label>
                    <div className="flex flex-wrap gap-2">
                      {["Engagement Post", "Product Promo", "Story/Reel", "Thread"].map((type) => (
                        <Button 
                          key={type}
                          variant={contentType === type ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setContentType(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Topic or Keywords</label>
                    <Input 
                      placeholder="Enter topic or keywords" 
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {["Professional", "Casual", "Humorous", "Inspirational", "Educational"].map((t) => (
                        <Button 
                          key={t}
                          variant={tone === t ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setTone(t)}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Advanced Options
                    </Button>
                    <Button 
                      onClick={generateContent}
                      disabled={isGenerating || !keywords}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Content
                        </>
                      )}
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          setKeywords("marketing strategy tips");
                          setPlatform("Twitter/X");
                          setContentType("Engagement Post");
                          setTone("Inspirational");
                          toast({
                            title: "Template loaded",
                            description: "Engagement Booster template applied",
                          });
                        }}
                      >
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          setKeywords("new product announcement benefits");
                          setPlatform("Instagram");
                          setContentType("Product Promo");
                          setTone("Professional");
                          toast({
                            title: "Template loaded",
                            description: "Product Launch template applied",
                          });
                        }}
                      >
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
              {generatedContent ? (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                      <span className="font-medium">{generatedContentType}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
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
                    value={generatedContent}
                    readOnly
                  />
                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">Generated at {generationTime}</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateContent}
                      disabled={isGenerating}
                    >
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center text-muted-foreground">
                  <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>Your generated content will appear here</p>
                  <p className="text-sm mt-1">Fill out the form and click "Generate Content"</p>
                </div>
              )}
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