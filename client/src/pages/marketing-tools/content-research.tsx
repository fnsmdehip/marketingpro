import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Globe,
  Search,
  Loader2,
  FileText,
  Newspaper,
  Target,
  Bookmark,
  ArrowRight,
  AlertTriangle,
  Copy,
  Save,
  Sparkles
} from "lucide-react";

export default function ContentResearchPage() {
  const { toast } = useToast();
  const [url, setUrl] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analyzed, setAnalyzed] = useState<boolean>(false);
  const [scrapedContent, setScrapedContent] = useState<string>("");
  const [analyzedData, setAnalyzedData] = useState<{
    summary: string;
    keyPoints: string[];
    marketingInsights: string[];
    toneAndStyle: string;
    strengths: string[];
    improvements: string[];
  }>({
    summary: "",
    keyPoints: [],
    marketingInsights: [],
    toneAndStyle: "",
    strengths: [],
    improvements: []
  });
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string>("");

  const scrapeAndAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisError("");

    try {
      // Step 1: Scrape content
      setAnalysisProgress(20);
      const scrapeResponse = await axios.post("/api/web-scraper", {
        url
      });

      if (!scrapeResponse.data.success) {
        throw new Error(scrapeResponse.data.error?.message || "Failed to scrape content");
      }

      const content = scrapeResponse.data.data;
      setScrapedContent(content);
      
      // Save to localStorage for use in prompt arsenal
      localStorage.setItem('scrapedContent', content);
      localStorage.setItem('lastScrapedURL', url);

      setAnalysisProgress(50);

      // Step 2: Analyze with AI
      const analysisPrompt = `
      Analyze this content scraped from "${url}":
      
      ${content.substring(0, 5000)}
      
      Provide a structured analysis with the following sections:
      1. A brief summary (max 3 sentences)
      2. Key points (5 bullet points)
      3. Marketing insights (how this content could be used for marketing)
      4. Tone and style analysis
      5. Content strengths (3 points)
      6. Potential improvements (3 points)
      
      Format your response in JSON with the following structure:
      {
        "summary": "...",
        "keyPoints": ["point1", "point2", "point3", "point4", "point5"],
        "marketingInsights": ["insight1", "insight2", "insight3"],
        "toneAndStyle": "...",
        "strengths": ["strength1", "strength2", "strength3"],
        "improvements": ["improvement1", "improvement2", "improvement3"]
      }
      
      Return ONLY the JSON object without any additional text or formatting.
      `;

      setAnalysisProgress(60);
      
      const analysisResponse = await axios.post("/api/ai/generate/text", {
        prompt: analysisPrompt,
        model: "deepseek/deepseek-chat-v3-0324:free",
        temperature: 0.3 // Use lower temperature for more factual results
      });

      setAnalysisProgress(90);

      if (!analysisResponse.data.success) {
        throw new Error(analysisResponse.data.error?.message || "Analysis failed");
      }

      // Parse the AI response as JSON
      try {
        const responseText = analysisResponse.data.data;
        // Find the JSON part in the response (in case AI added extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0]);
          setAnalyzedData(parsedData);
          setAnalyzed(true);
          setAnalysisProgress(100);
          
          toast({
            title: "Analysis complete",
            description: "Content has been analyzed successfully",
          });
        } else {
          throw new Error("Couldn't parse AI response as JSON");
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        
        // Fallback: Create a simplified analysis structure
        setAnalyzedData({
          summary: analysisResponse.data.data.substring(0, 200) + "...",
          keyPoints: ["Content was analyzed but structured data couldn't be extracted"],
          marketingInsights: ["Please see the raw content for insights"],
          toneAndStyle: "Analysis format error",
          strengths: ["Content successfully scraped"],
          improvements: ["Try analyzing a different URL"]
        });
        
        setAnalyzed(true);
        setAnalysisProgress(100);
        
        toast({
          title: "Analysis completed with formatting issues",
          description: "The content was analyzed but couldn't be properly structured"
        });
      }
    } catch (error) {
      console.error("Error in content analysis:", error);
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze content");
      setAnalysisProgress(0);
      
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "There was an error analyzing the content",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard"
    });
  };

  const useForPrompt = () => {
    toast({
      title: "Content saved for prompts",
      description: "The scraped content will be used as context in the Prompt Arsenal",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Content Research</h1>
        <p className="text-muted-foreground mt-2">
          Research and analyze web content for your marketing insights
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="mr-2 h-5 w-5 text-primary" />
            Web Content Analyzer
          </CardTitle>
          <CardDescription>
            Enter a URL to extract and analyze content for marketing insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="Enter website URL (e.g., https://example.com/blog/article)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={scrapeAndAnalyze}
              disabled={analyzing || !url}
              className="md:w-auto"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {analyzing && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Analyzing content...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}

          {analysisError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{analysisError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Newspaper className="mr-2 h-5 w-5 text-primary" />
                  Content Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered insights from the analyzed content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="insights">
                  <TabsList className="mb-4">
                    <TabsTrigger value="insights">Marketing Insights</TabsTrigger>
                    <TabsTrigger value="analysis">Content Analysis</TabsTrigger>
                    <TabsTrigger value="raw">Raw Content</TabsTrigger>
                  </TabsList>

                  <TabsContent value="insights">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Summary</h3>
                        <p className="text-muted-foreground">{analyzedData.summary}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-2">Marketing Insights</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analyzedData.marketingInsights.map((insight, index) => (
                            <li key={index} className="text-muted-foreground">{insight}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={useForPrompt}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Use for Prompts
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(analyzedData.summary)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Summary
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Key Points</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {analyzedData.keyPoints.map((point, index) => (
                            <li key={index} className="text-muted-foreground">{point}</li>
                          ))}
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-2">Tone and Style</h3>
                        <p className="text-muted-foreground">{analyzedData.toneAndStyle}</p>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Content Strengths</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {analyzedData.strengths.map((strength, index) => (
                              <li key={index} className="text-muted-foreground">{strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-2">Potential Improvements</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {analyzedData.improvements.map((improvement, index) => (
                              <li key={index} className="text-muted-foreground">{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="raw">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Raw Scraped Content</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(scrapedContent)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <Textarea 
                        className="font-mono text-sm h-[400px]" 
                        value={scrapedContent} 
                        readOnly 
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5 text-primary" />
                  Content Insights
                </CardTitle>
                <CardDescription>
                  Use these insights in your marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">How to use these insights:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Create targeted social media posts using key points</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Use the tone analysis to match your content style</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Address improvement areas in your competitive content</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                      <span className="text-sm text-muted-foreground">Generate AI content based on these insights</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Content Actions:</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={useForPrompt}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Use as Context in Prompt Arsenal
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Save className="mr-2 h-4 w-4" />
                      Save Analysis to Library
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Add URL to Bookmarks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!analyzed && !analyzing && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center p-10">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Enter a URL to analyze content</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Get AI-powered insights and marketing analysis from any web content.
              The analysis will provide key points, tone evaluation, and marketing opportunities.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Try analyzing blog posts, articles, product pages, or competitor content
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setUrl("https://blog.hubspot.com/marketing/content-marketing")}>
                Try Marketing Blog
              </Button>
              <Button variant="outline" onClick={() => setUrl("https://zapier.com/blog/ai-marketing-tools/")}>
                Try AI Marketing Article
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}