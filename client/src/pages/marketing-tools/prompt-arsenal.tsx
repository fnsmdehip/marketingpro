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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAIProviders } from "@/hooks/use-ai-providers";
import { 
  BookOpen, 
  Box, 
  Copy, 
  Download, 
  Edit, 
  Loader2, 
  MessageSquare, 
  Plus, 
  Save, 
  Search, 
  Sparkles, 
  Star
} from "lucide-react";

export default function PromptArsenal() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("prompt-library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState(false);
  const [promptName, setPromptName] = useState("");
  const [promptText, setPromptText] = useState("");
  const [promptCategory, setPromptCategory] = useState("marketing");
  const { generateText, isGeneratingText } = useAIProviders();
  
  const promptLibrary = [
    {
      id: "content-ideas",
      name: "Content Ideas Generator",
      category: "marketing",
      prompt: "Generate 10 content ideas for [TOPIC] that would appeal to [AUDIENCE]. For each idea, include a compelling headline, brief description, and why it would resonate with the target audience.",
      createdAt: "Mar 10, 2025",
      uses: 87,
      rating: 4.8
    },
    {
      id: "social-captions",
      name: "Engaging Social Media Captions",
      category: "social",
      prompt: "Write 5 engaging social media captions for [PLATFORM] about [TOPIC]. Each caption should be between 50-100 characters, include relevant hashtags, and have a clear call-to-action. The tone should be [TONE].",
      createdAt: "Mar 15, 2025",
      uses: 124,
      rating: 4.6
    },
    {
      id: "value-proposition",
      name: "Value Proposition Generator",
      category: "copywriting",
      prompt: "Create a compelling value proposition for [PRODUCT/SERVICE] that addresses the pain points of [TARGET AUDIENCE]. The value proposition should be concise (20-30 words), highlight the unique benefits, and clearly explain why the customer should choose this over alternatives.",
      createdAt: "Mar 22, 2025",
      uses: 56,
      rating: 4.9
    },
    {
      id: "email-sequence",
      name: "Email Marketing Sequence",
      category: "email",
      prompt: "Design a 5-email nurture sequence for [PRODUCT/SERVICE] targeting [AUDIENCE]. For each email, provide a subject line, opening paragraph, main content outline, and call-to-action. The sequence should guide recipients from awareness to consideration to decision stages.",
      createdAt: "Apr 1, 2025",
      uses: 42,
      rating: 4.7
    },
    {
      id: "target-persona",
      name: "Customer Persona Development",
      category: "strategy",
      prompt: "Create a detailed customer persona for [BUSINESS TYPE]. Include demographic information, psychographic details, goals, challenges, objections, preferred communication channels, and buying decision process. This persona should represent the ideal customer for [PRODUCT/SERVICE].",
      createdAt: "Apr 5, 2025",
      uses: 31,
      rating: 4.5
    },
    {
      id: "headline-variations",
      name: "Headline A/B Test Variations",
      category: "copywriting",
      prompt: "Generate 10 headline variations for [TOPIC/PRODUCT] that would appeal to [AUDIENCE]. Create a mix of benefit-focused, curiosity-based, problem-solution, and emotional appeal headlines. Each headline should be under 12 words and optimized for high CTR.",
      createdAt: "Mar 28, 2025",
      uses: 64,
      rating: 4.4
    },
    {
      id: "blog-outline",
      name: "Comprehensive Blog Post Outline",
      category: "content",
      prompt: "Create a detailed outline for a 1,500-word blog post about [TOPIC] targeting [AUDIENCE]. Include a compelling introduction, 5-7 main sections with subpoints, data points to research, and a conclusion with next steps. Optimize the outline for both reader engagement and SEO for the keyword '[KEYWORD]'.",
      createdAt: "Mar 12, 2025",
      uses: 93,
      rating: 4.8
    },
    {
      id: "product-description",
      name: "Persuasive Product Description",
      category: "copywriting",
      prompt: "Write a persuasive product description for [PRODUCT] that would appeal to [TARGET AUDIENCE]. The description should be 200-250 words, highlight the key features and benefits, address potential objections, include sensory language, and end with a strong call-to-action.",
      createdAt: "Apr 3, 2025",
      uses: 38,
      rating: 4.7
    }
  ];
  
  const filteredPrompts = searchQuery
    ? promptLibrary.filter(prompt => 
        prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : promptLibrary;
  
  const currentPrompt = selectedPrompt 
    ? promptLibrary.find(p => p.id === selectedPrompt)
    : null;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };
  
  const savePrompt = () => {
    if (!promptName || !promptText) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and content for your prompt.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to the library.",
    });
    
    // In a real app, this would save to the backend
    setEditPrompt(false);
    setSelectedPrompt(null);
  };
  
  const handleCreateNew = () => {
    setSelectedPrompt(null);
    setPromptName("");
    setPromptText("");
    setPromptCategory("marketing");
    setEditPrompt(true);
  };
  
  const handleEditSelected = () => {
    if (currentPrompt) {
      setPromptName(currentPrompt.name);
      setPromptText(currentPrompt.prompt);
      setPromptCategory(currentPrompt.category);
      setEditPrompt(true);
    }
  };
  
  const handleGeneratePrompt = async () => {
    if (!promptName) {
      toast({
        title: "Missing information",
        description: "Please provide a prompt name or topic.",
        variant: "destructive"
      });
      return;
    }
    
    const result = await generateText({
      prompt: `Create a detailed and effective AI prompt for the following purpose: "${promptName}". The prompt should be for ${promptCategory} purposes. Make it specific, include placeholders in [BRACKETS] for customization, and structure it to get the best possible results from an AI system.`,
      model: "openai/gpt-4o",
      temperature: 0.7,
    });
    
    if (result.success && result.result) {
      setPromptText(typeof result.result === 'string' ? result.result : result.result.join(''));
    } else {
      toast({
        title: "Generation failed",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout title="Prompt Arsenal">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Prompt Arsenal</h2>
            <p className="text-sm text-gray-500">
              Your collection of powerful marketing prompts
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search prompts..."
                className="pl-9 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="prompt-library" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompt-library">Prompt Library</TabsTrigger>
            <TabsTrigger value="prompt-editor">Prompt Editor</TabsTrigger>
            <TabsTrigger value="prompt-techniques">Prompt Techniques</TabsTrigger>
          </TabsList>
          
          {/* Prompt Library Tab */}
          <TabsContent value="prompt-library">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Marketing Prompt Library</CardTitle>
                    <CardDescription>
                      Ready-to-use prompts for various marketing needs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredPrompts.map((prompt) => (
                        <Card 
                          key={prompt.id} 
                          className={`border hover:border-primary cursor-pointer transition-colors ${
                            selectedPrompt === prompt.id ? 'border-primary bg-primary-50' : ''
                          }`}
                          onClick={() => setSelectedPrompt(prompt.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-base">{prompt.name}</h3>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 mr-2">
                                    {prompt.category}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {prompt.uses} uses
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <Star className="h-3.5 w-3.5 text-amber-500 mr-1" />
                                <span className="text-xs font-medium">{prompt.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {prompt.prompt}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                {currentPrompt ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentPrompt.name}</CardTitle>
                      <CardDescription>
                        Created on {currentPrompt.createdAt} • {currentPrompt.uses} uses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap text-sm">
                        {currentPrompt.prompt}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <span className="text-xs text-gray-500">Category:</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                          {currentPrompt.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">Rating:</span>
                        <div className="flex items-center">
                          <Star className="h-3.5 w-3.5 text-amber-500 mr-1" />
                          <span className="text-xs font-medium">{currentPrompt.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <div className="flex space-x-2 w-full">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => copyToClipboard(currentPrompt.prompt)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleEditSelected}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                      <Button className="w-full">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Use with AI Generator
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Prompt Details</CardTitle>
                      <CardDescription>
                        Select a prompt to view details or create a new one
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                      <MessageSquare className="h-12 w-12 mb-4 text-gray-300" />
                      <p>Select a prompt from the library or create a new one to get started</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={handleCreateNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Prompt
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Prompt Categories</CardTitle>
                    <CardDescription>
                      Browse by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {["marketing", "copywriting", "social", "email", "content", "strategy"].map((category) => (
                        <div 
                          key={category}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => setSearchQuery(category)}
                        >
                          <span className="text-sm capitalize">{category}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
                            {promptLibrary.filter(p => p.category === category).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Prompt Editor Tab */}
          <TabsContent value="prompt-editor">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{editPrompt ? "Edit Prompt" : "Prompt Preview"}</CardTitle>
                    <CardDescription>
                      {editPrompt 
                        ? "Create or modify your prompt" 
                        : "View how your prompt will appear to AI models"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {editPrompt ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="promptName">Prompt Name</Label>
                          <Input
                            id="promptName"
                            placeholder="E.g., 'Blog Post Outline Generator'"
                            value={promptName}
                            onChange={(e) => setPromptName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="promptCategory">Category</Label>
                          <Select
                            value={promptCategory}
                            onValueChange={setPromptCategory}
                          >
                            <SelectTrigger id="promptCategory">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="copywriting">Copywriting</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="content">Content</SelectItem>
                              <SelectItem value="strategy">Strategy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="promptText">Prompt Text</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs"
                              onClick={handleGeneratePrompt}
                              disabled={isGeneratingText}
                            >
                              {isGeneratingText ? (
                                <>
                                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Generate with AI
                                </>
                              )}
                            </Button>
                          </div>
                          <Textarea
                            id="promptText"
                            placeholder="Enter your prompt here. Use [BRACKETS] for variables the user should replace."
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            rows={8}
                          />
                          <p className="text-xs text-gray-500">
                            Tip: Use [BRACKETS] for variables that can be customized for each use.
                          </p>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditPrompt(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={savePrompt}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Prompt
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="p-6 border rounded-lg mb-4">
                          {promptText ? (
                            <div className="whitespace-pre-wrap">{promptText}</div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Create or select a prompt to preview it here</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            onClick={() => setEditPrompt(true)}
                            disabled={!promptText}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Prompt
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Prompt Variables</CardTitle>
                    <CardDescription>
                      Common variables to include in your prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { variable: "[TOPIC]", description: "Main subject of the content" },
                        { variable: "[AUDIENCE]", description: "Target audience or persona" },
                        { variable: "[TONE]", description: "Writing tone (professional, casual, etc.)" },
                        { variable: "[GOAL]", description: "Objective of the content" },
                        { variable: "[KEYWORDS]", description: "SEO keywords to include" },
                        { variable: "[LENGTH]", description: "Content length (words, paragraphs)" },
                        { variable: "[FORMAT]", description: "Content format (blog, email, etc.)" },
                        { variable: "[PLATFORM]", description: "Platform where content will appear" }
                      ].map((item, index) => (
                        <div 
                          key={index} 
                          className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            if (editPrompt) {
                              setPromptText((prev) => prev + ' ' + item.variable);
                            }
                          }}
                        >
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.variable}</span>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Prompt Tips</CardTitle>
                    <CardDescription>
                      Best practices for effective prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Be Specific</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Clearly define what you want, including format, tone, length, and purpose.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Use Variables</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Include [PLACEHOLDERS] for elements that will change with each use.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Provide Context</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Help the AI understand who the content is for and why it's being created.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Give Examples</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          When possible, include examples of the type of output you want.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Structure Output</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Specify how you want the response structured (bullets, paragraphs, etc.).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Prompt Techniques Tab */}
          <TabsContent value="prompt-techniques">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Prompt Engineering Techniques</CardTitle>
                    <CardDescription>
                      Methods to improve your AI-generated content quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          name: "Chain-of-Thought Prompting",
                          description: "Ask the AI to work through a problem step by step, explaining its reasoning at each stage. This helps with complex marketing tasks like campaign planning or customer journey mapping.",
                          example: "Develop a marketing strategy for [PRODUCT]. First, analyze the target audience. Second, identify their pain points. Third, explain how the product solves these problems. Fourth, outline messaging pillars based on these insights. Finally, recommend 3 channels that would be most effective."
                        },
                        {
                          name: "Role-Based Prompting",
                          description: "Assign a specific role or expertise level to the AI to get responses from a particular perspective, which is especially useful for marketing content.",
                          example: "As an experienced CMO with 20 years in the [INDUSTRY] sector, analyze the following marketing campaign for [PRODUCT]. Identify strengths, weaknesses, and provide strategic recommendations for improvement."
                        },
                        {
                          name: "Format Specification",
                          description: "Clearly define the exact format you want the output in, including sections, headers, and structure. This ensures consistent, usable marketing content.",
                          example: "Create a detailed social media post for [PLATFORM] about [TOPIC]. Format as follows:\n- Headline: [compelling hook, under 10 words]\n- Body: [2-3 paragraphs, each under 50 words]\n- Hashtags: [5 relevant hashtags]\n- Call to Action: [clear instruction for viewer]"
                        },
                        {
                          name: "Persona-Based Prompting",
                          description: "Define audience personas for the AI to target, resulting in more tailored and effective marketing messages.",
                          example: "Write an email promoting [PRODUCT] to the following customer persona: [PERSONA DETAILS including demographics, pain points, goals, and communication preferences]. The email should address their specific challenges and show how our product solves them."
                        },
                        {
                          name: "Evaluation Criteria",
                          description: "Include specific criteria for how the response should be evaluated, which guides the AI to focus on what matters most.",
                          example: "Create ad copy for [PRODUCT] targeting [AUDIENCE]. The copy will be evaluated on these criteria: 1) Clarity of value proposition, 2) Emotional appeal, 3) Persuasiveness, 4) Call-to-action strength, and 5) Brand voice consistency."
                        }
                      ].map((technique, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="p-4 border-b bg-gray-50">
                            <h3 className="font-medium">{technique.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{technique.description}</p>
                          </div>
                          <div className="p-4">
                            <h4 className="text-sm font-medium mb-2">Example:</h4>
                            <div className="p-3 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                              {technique.example}
                            </div>
                            <div className="flex justify-end mt-3">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(technique.example)}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Example
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Library</CardTitle>
                    <CardDescription>
                      Learning materials for prompt engineering
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "The Marketer's Guide to Prompt Engineering",
                          type: "Ebook",
                          description: "Comprehensive guide to creating effective prompts specifically for marketing content."
                        },
                        {
                          title: "Prompt Engineering Masterclass",
                          type: "Video Course",
                          description: "10-part video series on advanced techniques for marketing professionals."
                        },
                        {
                          title: "Copywriting Prompts that Convert",
                          type: "Worksheet",
                          description: "Template library for sales and conversion-focused content generation."
                        },
                        {
                          title: "A/B Testing with AI: Prompt Variations",
                          type: "Case Study",
                          description: "Real-world examples of how prompt variations affect marketing outcomes."
                        }
                      ].map((resource, index) => (
                        <div 
                          key={index} 
                          className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start">
                            <div className="p-2 bg-primary-50 rounded mr-3">
                              <BookOpen className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{resource.title}</h4>
                              <div className="flex items-center mt-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {resource.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download All Resources
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Templates</CardTitle>
                    <CardDescription>
                      Ready-to-use prompt templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "AIDA Framework",
                          template: "Create a [MARKETING ASSET] for [PRODUCT] following the AIDA framework:\n\nAttention: Capture interest with a compelling hook about [BENEFIT]\nInterest: Build interest by explaining how [PRODUCT] addresses [PAIN POINT]\nDesire: Create desire by highlighting [KEY FEATURES] and their benefits\nAction: End with a clear call-to-action to [DESIRED ACTION]"
                        },
                        {
                          name: "PAS Framework",
                          template: "Write a [TYPE OF CONTENT] for [AUDIENCE] following the Problem-Agitation-Solution framework:\n\nProblem: Identify [PAIN POINT] that [AUDIENCE] experiences\nAgitation: Elaborate on the consequences of this problem and why it matters\nSolution: Introduce [PRODUCT/SERVICE] as the ideal solution, highlighting [KEY BENEFITS]"
                        },
                        {
                          name: "Feature-Benefit Matrix",
                          template: "Create a feature-benefit matrix for [PRODUCT] targeting [AUDIENCE]. For each of the following features, explain the corresponding benefit in customer-centric language:\n\n1. [FEATURE 1] → What specific benefit does this provide?\n2. [FEATURE 2] → How does this improve the customer's life/work?\n3. [FEATURE 3] → What problem does this solve?\n\nFor each pair, include a short, compelling statement that connects the feature to the emotional or practical value."
                        }
                      ].map((template, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">{template.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6"
                              onClick={() => copyToClipboard(template.template)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {template.template.split('\n')[0]}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Model Comparison</CardTitle>
                    <CardDescription>
                      Prompt performance by model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { model: "GPT-4o", strengths: "Best for complex marketing strategy, nuanced copywriting, and creative content", score: 95 },
                        { model: "Claude 3", strengths: "Excellent for detailed analysis, ethical considerations, and long-form content", score: 92 },
                        { model: "Gemini Pro", strengths: "Strong with factual content, research synthesis, and technical explanations", score: 89 },
                        { model: "Mistral Large", strengths: "Good balance of creativity and accuracy, efficient for routine marketing tasks", score: 87 }
                      ].map((model, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{model.model}</span>
                            <span className="text-sm">{model.score}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${model.score}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{model.strengths}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}