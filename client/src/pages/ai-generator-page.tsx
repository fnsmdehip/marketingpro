import { useState } from "react";
import { motion } from "framer-motion";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Copy, PlusCircle, Send, CheckCircle2, Download, Layout } from "lucide-react";
import { Link, useLocation } from "wouter";

type GeneratorType = "text" | "image" | "speech" | "video";

export default function AIGeneratorPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get AI providers data
  const { data: providers = [] } = useQuery({
    queryKey: ["/api/ai/providers"],
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<GeneratorType>("text");
  
  // State for models
  const [textModel, setTextModel] = useState("gemini-2.5-pro");
  const [imageModel, setImageModel] = useState("stable-diffusion-xl");
  const [speechModel, setSpeechModel] = useState("xtts-v2");
  const [videoModel, setVideoModel] = useState("damo-text-to-video");
  
  // State for parameters
  const [temperature, setTemperature] = useState(0.7);
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  
  // State for options
  const [textPurpose, setTextPurpose] = useState("social-post");
  const [imageSize, setImageSize] = useState("1024x1024");
  const [speechVoice, setSpeechVoice] = useState("default");
  const [videoLength, setVideoLength] = useState("5");
  
  // State for results
  const [textResult, setTextResult] = useState("");
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [speechResult, setSpeechResult] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  
  // Text generation mutation
  const generateTextMutation = useMutation({
    mutationFn: async (params: { prompt: string, model: string, temperature: number }) => {
      const res = await apiRequest("POST", "/api/ai/generate/text", params);
      return await res.json();
    },
    onSuccess: (data) => {
      setTextResult(typeof data.result === 'string' ? data.result : data.result.join(''));
      toast({
        title: "Text generated successfully",
        description: "You can now copy or use this text.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating text",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Image generation mutation
  const generateImageMutation = useMutation({
    mutationFn: async (params: { prompt: string, model: string, width?: number, height?: number, style?: string }) => {
      const res = await apiRequest("POST", "/api/ai/generate/image", params);
      return await res.json();
    },
    onSuccess: (data) => {
      setImageResult(typeof data.result === 'string' ? data.result : data.result[0]);
      toast({
        title: "Image generated successfully",
        description: "Your image is ready to use.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating image",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Speech generation mutation
  const generateSpeechMutation = useMutation({
    mutationFn: async (params: { text: string, voice: string, model?: string }) => {
      const res = await apiRequest("POST", "/api/ai/generate/speech", params);
      return await res.json();
    },
    onSuccess: (data) => {
      setSpeechResult(typeof data.result === 'string' ? data.result : data.result[0]);
      toast({
        title: "Speech generated successfully",
        description: "Your audio is ready to play.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating speech",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Function to handle text generation
  const handleGenerateText = () => {
    if (!textPrompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate text.",
        variant: "destructive",
      });
      return;
    }
    
    const finalPrompt = createPromptWithPurpose(textPrompt, textPurpose);
    
    generateTextMutation.mutate({
      prompt: finalPrompt,
      model: textModel,
      temperature: temperature,
    });
  };
  
  // Function to handle image generation
  const handleGenerateImage = () => {
    if (!imagePrompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      });
      return;
    }
    
    const [width, height] = imageSize.split('x').map(Number);
    
    generateImageMutation.mutate({
      prompt: imagePrompt,
      model: imageModel,
      width,
      height,
    });
  };
  
  // Function to handle speech generation
  const handleGenerateSpeech = () => {
    if (!speechText) {
      toast({
        title: "Text required",
        description: "Please enter text to convert to speech.",
        variant: "destructive",
      });
      return;
    }
    
    generateSpeechMutation.mutate({
      text: speechText,
      voice: speechVoice,
      model: speechModel,
    });
  };
  
  // Function to create a prompt with purpose context
  const createPromptWithPurpose = (prompt: string, purpose: string) => {
    switch (purpose) {
      case 'social-post':
        return `Create a social media post about: ${prompt}. Make it engaging, conversational, and include relevant hashtags.`;
      case 'email-campaign':
        return `Write an email campaign message about: ${prompt}. Make it persuasive with a clear call-to-action and professional tone.`;
      case 'blog-post':
        return `Write a blog post introduction about: ${prompt}. Make it informative, engaging, and SEO-friendly with approximately 150-200 words.`;
      case 'product-description':
        return `Create a compelling product description for: ${prompt}. Highlight key features, benefits, and create desire.`;
      default:
        return prompt;
    }
  };
  
  // Function to handle using text in scheduler
  const useTextInScheduler = () => {
    if (textResult) {
      updateSchedulerContent({
        title: textPrompt.substring(0, 50) + (textPrompt.length > 50 ? '...' : ''),
        body: textResult,
      });
      openScheduler();
    }
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you might want to show a toast or some UI feedback
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI Generator</h2>
            <p className="text-sm text-gray-500">
              Generate high-quality content using multiple AI models with intelligent fallbacks
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {providers.filter(p => p.status === 'active').length} active providers
            </span>
            <Button onClick={openScheduler}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Content
            </Button>
          </div>
        </div>
        
        {/* Provider Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {providers.slice(0, 4).map((provider) => (
            <Card key={provider.name}>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    provider.status === 'active' && provider.usage.percentage < 90
                      ? 'bg-green-400'
                      : provider.status === 'active' && provider.usage.percentage >= 90
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  } mr-2`}></div>
                  <div className="text-sm font-medium">{provider.name}</div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
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
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>{provider.usage.hourly}/{provider.usage.daily}</span>
                  <span>{provider.usage.percentage}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Generator Tabs */}
        <Tabs 
          defaultValue="text" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as GeneratorType)}
        >
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="speech">Speech</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>
          
          {/* Text Generation */}
          <TabsContent value="text">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Text Generator</CardTitle>
                    <CardDescription>
                      Create high-quality content for various purposes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="text-purpose">Purpose</Label>
                      <Select
                        value={textPurpose}
                        onValueChange={setTextPurpose}
                      >
                        <SelectTrigger id="text-purpose">
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social-post">Social Media Post</SelectItem>
                          <SelectItem value="email-campaign">Email Campaign</SelectItem>
                          <SelectItem value="blog-post">Blog Post</SelectItem>
                          <SelectItem value="product-description">Product Description</SelectItem>
                          <SelectItem value="ad-copy">Ad Copy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="text-prompt">Prompt</Label>
                      <Textarea
                        id="text-prompt"
                        placeholder="Enter your prompt here..."
                        value={textPrompt}
                        onChange={(e) => setTextPrompt(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Button 
                        onClick={handleGenerateText} 
                        disabled={isGeneratingText || !textPrompt}
                        className="w-full"
                      >
                        {isGeneratingText ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Result</CardTitle>
                    <CardDescription>
                      Your generated text will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGeneratingText ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p className="text-sm text-gray-500">Generating content...</p>
                      </div>
                    ) : textResult ? (
                      <div className="relative p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                        {textResult}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <p>Generated text will appear here</p>
                      </div>
                    )}
                  </CardContent>
                  {textResult && (
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(textResult)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        onClick={useTextInScheduler}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Use in Scheduler
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              <div>
                <ModelSelector
                  modelType="text"
                  selectedModel={textModel}
                  onSelectModel={setTextModel}
                  temperature={temperature}
                  onTemperatureChange={setTemperature}
                  disabled={isGeneratingText}
                />
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Prompt Tips</CardTitle>
                    <CardDescription>
                      How to write effective prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Be Specific</h4>
                      <p className="text-sm text-gray-500">
                        Include details about tone, audience, and format for better results.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Use Examples</h4>
                      <p className="text-sm text-gray-500">
                        Provide examples of the style or format you want to achieve.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Structure Your Request</h4>
                      <p className="text-sm text-gray-500">
                        Break down complex requests into clear sections.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Experiment with Temperature</h4>
                      <p className="text-sm text-gray-500">
                        Lower values (0.1-0.4) for factual content, higher (0.7-0.9) for creative.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Image Generation */}
          <TabsContent value="image">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Generator</CardTitle>
                    <CardDescription>
                      Create stunning images from text descriptions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="image-prompt">Prompt</Label>
                      <Textarea
                        id="image-prompt"
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image-size">Size</Label>
                        <Select
                          value={imageSize}
                          onValueChange={setImageSize}
                        >
                          <SelectTrigger id="image-size">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="512x512">512 x 512</SelectItem>
                            <SelectItem value="768x768">768 x 768</SelectItem>
                            <SelectItem value="1024x1024">1024 x 1024</SelectItem>
                            <SelectItem value="1024x768">1024 x 768 (Landscape)</SelectItem>
                            <SelectItem value="768x1024">768 x 1024 (Portrait)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image-style">Style</Label>
                        <Select defaultValue="realistic">
                          <SelectTrigger id="image-style">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="cartoon">Cartoon</SelectItem>
                            <SelectItem value="3d">3D Render</SelectItem>
                            <SelectItem value="abstract">Abstract</SelectItem>
                            <SelectItem value="sketch">Sketch</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateImage} 
                      disabled={isGeneratingImage || !imagePrompt}
                      className="w-full"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Image</CardTitle>
                    <CardDescription>
                      Your generated image will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full aspect-square rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {isGeneratingImage ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-sm text-gray-500">Generating image...</p>
                        </div>
                      ) : imageResult ? (
                        <img 
                          src={imageResult} 
                          alt="Generated content" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                          <p>Generated image will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {imageResult && (
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(imageResult || '', '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          updateSchedulerContent({
                            title: imagePrompt.substring(0, 50) + (imagePrompt.length > 50 ? '...' : ''),
                            body: imagePrompt,
                            mediaUrls: imageResult ? [imageResult] : []
                          });
                          openScheduler();
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Use in Scheduler
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              <div>
                <ModelSelector
                  modelType="image"
                  selectedModel={imageModel}
                  onSelectModel={setImageModel}
                  disabled={isGeneratingImage}
                />
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Image Prompt Tips</CardTitle>
                    <CardDescription>
                      How to write effective image prompts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Be Descriptive</h4>
                      <p className="text-sm text-gray-500">
                        Include details about subject, setting, lighting, colors, and mood.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Specify Style</h4>
                      <p className="text-sm text-gray-500">
                        Mention art styles like "photorealistic," "oil painting," or "digital art."
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Use Reference Artists</h4>
                      <p className="text-sm text-gray-500">
                        Include "in the style of [artist name]" for specific aesthetics.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Add Technical Details</h4>
                      <p className="text-sm text-gray-500">
                        Terms like "high resolution," "detailed," or "sharp focus" can improve quality.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Speech Generation */}
          <TabsContent value="speech">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Text-to-Speech Generator</CardTitle>
                    <CardDescription>
                      Convert text to natural-sounding speech
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="speech-text">Text</Label>
                      <Textarea
                        id="speech-text"
                        placeholder="Enter the text you want to convert to speech..."
                        value={speechText}
                        onChange={(e) => setSpeechText(e.target.value)}
                        rows={6}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="speech-voice">Voice</Label>
                      <Select
                        value={speechVoice}
                        onValueChange={setSpeechVoice}
                      >
                        <SelectTrigger id="speech-voice">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="male_1">Male 1</SelectItem>
                          <SelectItem value="male_2">Male 2</SelectItem>
                          <SelectItem value="female_1">Female 1</SelectItem>
                          <SelectItem value="female_2">Female 2</SelectItem>
                          <SelectItem value="narration">Narration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleGenerateSpeech} 
                      disabled={isGeneratingSpeech || !speechText}
                      className="w-full"
                    >
                      {isGeneratingSpeech ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Speech</CardTitle>
                    <CardDescription>
                      Your generated audio will appear here
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 rounded-md bg-gray-50 flex items-center justify-center">
                      {isGeneratingSpeech ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                          <p className="text-sm text-gray-500">Generating speech...</p>
                        </div>
                      ) : speechResult ? (
                        <audio controls className="w-full">
                          <source src={speechResult} />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                          <p>Generated audio will appear here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {speechResult && (
                    <CardFooter className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(speechResult || '', '_blank')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          updateSchedulerContent({
                            title: speechText.substring(0, 50) + (speechText.length > 50 ? '...' : ''),
                            body: speechText,
                            // In a real implementation, you might want to handle audio attachments
                          });
                          openScheduler();
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Use in Scheduler
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              <div>
                <ModelSelector
                  modelType="speech"
                  selectedModel={speechModel}
                  onSelectModel={setSpeechModel}
                  disabled={isGeneratingSpeech}
                />
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>TTS Best Practices</CardTitle>
                    <CardDescription>
                      Tips for optimal text-to-speech results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Use Natural Language</h4>
                      <p className="text-sm text-gray-500">
                        Write in a conversational style as if speaking to someone.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Add Punctuation</h4>
                      <p className="text-sm text-gray-500">
                        Include commas and periods to create natural pauses in speech.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Avoid Special Characters</h4>
                      <p className="text-sm text-gray-500">
                        Special characters and symbols might not be properly pronounced.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Test Short Segments</h4>
                      <p className="text-sm text-gray-500">
                        Start with shorter text segments to test voice and pacing.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Video Generation */}
          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle>Video Generator</CardTitle>
                <CardDescription>
                  Create short AI-generated videos from text descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="video-prompt">Prompt</Label>
                      <Textarea
                        id="video-prompt"
                        placeholder="Describe the video you want to generate..."
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="video-length">Length (seconds)</Label>
                        <Select
                          value={videoLength}
                          onValueChange={setVideoLength}
                        >
                          <SelectTrigger id="video-length">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 seconds</SelectItem>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem value="10">10 seconds</SelectItem>
                            <SelectItem value="15">15 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="video-model">Model</Label>
                        <Select
                          value={videoModel}
                          onValueChange={setVideoModel}
                        >
                          <SelectTrigger id="video-model">
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damo-text-to-video">DAMO Text-to-Video</SelectItem>
                            <SelectItem value="text-to-video-ms">Text-to-Video MS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                    
                    <div className="p-4 bg-yellow-50 rounded-md text-yellow-800 text-sm">
                      <div className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 mr-2 shrink-0" />
                        <p>
                          Video generation is an advanced feature that requires 
                          significant processing power. For best results, use 
                          clear and specific prompts describing the scene, action, 
                          and style you want to achieve.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <Label className="mb-2">Preview</Label>
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Video preview will appear here</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Video generation can take several minutes to complete.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
