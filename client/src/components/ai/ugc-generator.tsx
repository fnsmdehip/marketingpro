import { useState } from "react";
import { useAIProviders } from "@/hooks/use-ai-providers";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Download, Share2 } from "lucide-react";
import { ModelSelector } from "./model-selector";

export function UGCGenerator() {
  // State for tabs
  const [activeTab, setActiveTab] = useState<"image" | "video" | "speech">("image");
  
  // State for models
  const [imageModel, setImageModel] = useState("stable-diffusion-xl");
  const [videoModel, setVideoModel] = useState("damo-text-to-video");
  const [speechModel, setSpeechModel] = useState("xtts-v2");
  
  // State for prompts
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [speechText, setSpeechText] = useState("");
  
  // State for options
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageStyle, setImageStyle] = useState("realistic");
  const [videoDuration, setVideoDuration] = useState("5");
  const [videoStyle, setVideoStyle] = useState("cinematic");
  const [speechVoice, setSpeechVoice] = useState("default");
  
  // State for results
  const [imageResult, setImageResult] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<string | null>(null);
  const [speechResult, setSpeechResult] = useState<string | null>(null);
  
  // Get hooks for AI generation
  const { 
    generateImage, 
    generateVideo, 
    generateSpeech, 
    isGeneratingImage, 
    isGeneratingVideo, 
    isGeneratingSpeech 
  } = useAIProviders();
  
  // Handle image generation
  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      alert("Please enter a prompt for the image.");
      return;
    }
    
    try {
      const url = await generateImage({
        prompt: imagePrompt,
        model: imageModel,
        size: imageSize,
        style: imageStyle
      });
      
      setImageResult(url);
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };
  
  // Handle video generation
  const handleGenerateVideo = async () => {
    if (!videoPrompt) {
      alert("Please enter a prompt for the video.");
      return;
    }
    
    try {
      const url = await generateVideo({
        prompt: videoPrompt,
        model: videoModel,
        duration: videoDuration,
        style: videoStyle
      });
      
      setVideoResult(url);
    } catch (error) {
      console.error("Failed to generate video:", error);
    }
  };
  
  // Handle speech generation
  const handleGenerateSpeech = async () => {
    if (!speechText) {
      alert("Please enter text to convert to speech.");
      return;
    }
    
    try {
      const url = await generateSpeech({
        text: speechText,
        model: speechModel,
        voice: speechVoice
      });
      
      setSpeechResult(url);
    } catch (error) {
      console.error("Failed to generate speech:", error);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>UGC Generator</CardTitle>
        <CardDescription>
          Create professional user-generated content for your marketing campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="speech">Text-to-Speech</TabsTrigger>
          </TabsList>
          
          {/* Image Generation Tab */}
          <TabsContent value="image">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Prompt</Label>
                  <Textarea
                    id="image-prompt"
                    placeholder="Describe the image you want to create..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="image-style">Style</Label>
                    <Select
                      value={imageStyle}
                      onValueChange={setImageStyle}
                    >
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
                
                <ModelSelector
                  modelType="image"
                  selectedModel={imageModel}
                  onSelectModel={setImageModel}
                  disabled={isGeneratingImage}
                />
                
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
                  ) : "Generate Image"}
                </Button>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-2">
                  <Label>Result</Label>
                </div>
                <div className="border rounded-md bg-gray-50 aspect-square flex items-center justify-center overflow-hidden">
                  {isGeneratingImage ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-gray-500">Generating your image...</p>
                    </div>
                  ) : imageResult ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={imageResult} 
                        alt="Generated content" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 right-2 flex space-x-2">
                        <Button size="sm" variant="secondary" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" title="Share">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Your generated image will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Video Generation Tab */}
          <TabsContent value="video">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-prompt">Prompt</Label>
                  <Textarea
                    id="video-prompt"
                    placeholder="Describe the video you want to create..."
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-duration">Duration (seconds)</Label>
                    <Select
                      value={videoDuration}
                      onValueChange={setVideoDuration}
                    >
                      <SelectTrigger id="video-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 seconds</SelectItem>
                        <SelectItem value="5">5 seconds</SelectItem>
                        <SelectItem value="10">10 seconds</SelectItem>
                        <SelectItem value="15">15 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-style">Style</Label>
                    <Select
                      value={videoStyle}
                      onValueChange={setVideoStyle}
                    >
                      <SelectTrigger id="video-style">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="cartoon">Cartoon</SelectItem>
                        <SelectItem value="3d">3D Animation</SelectItem>
                        <SelectItem value="vlog">Vlog Style</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <ModelSelector
                  modelType="video"
                  selectedModel={videoModel}
                  onSelectModel={setVideoModel}
                  disabled={isGeneratingVideo}
                />
                
                <Button 
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !videoPrompt}
                  className="w-full"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : "Generate Video"}
                </Button>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-2">
                  <Label>Result</Label>
                </div>
                <div className="border rounded-md bg-gray-50 aspect-video flex items-center justify-center overflow-hidden">
                  {isGeneratingVideo ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-gray-500">Generating your video...</p>
                      <p className="text-xs text-gray-400 mt-1">This may take a few minutes</p>
                    </div>
                  ) : videoResult ? (
                    <div className="relative w-full h-full">
                      <video 
                        src={videoResult}
                        controls
                        className="w-full h-full"
                      />
                      <div className="absolute bottom-2 right-2 flex space-x-2">
                        <Button size="sm" variant="secondary" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" title="Share">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Your generated video will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Text-to-Speech Tab */}
          <TabsContent value="speech">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="speech-text">Text</Label>
                  <Textarea
                    id="speech-text"
                    placeholder="Enter the text you want to convert to speech..."
                    value={speechText}
                    onChange={(e) => setSpeechText(e.target.value)}
                    rows={6}
                  />
                </div>
                
                <div className="space-y-2">
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
                
                <ModelSelector
                  modelType="speech"
                  selectedModel={speechModel}
                  onSelectModel={setSpeechModel}
                  disabled={isGeneratingSpeech}
                />
                
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
                  ) : "Generate Speech"}
                </Button>
              </div>
              
              <div className="flex flex-col">
                <div className="mb-2">
                  <Label>Result</Label>
                </div>
                <div className="border rounded-md bg-gray-50 p-6 flex flex-col items-center justify-center h-64">
                  {isGeneratingSpeech ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-sm text-gray-500">Generating your audio...</p>
                    </div>
                  ) : speechResult ? (
                    <div className="w-full">
                      <audio controls className="w-full mb-4">
                        <source src={speechResult} />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="secondary" title="Download">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="secondary" title="Share">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Your generated audio will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 flex justify-between">
        <div>
          AI-powered UGC generator with multiple provider support
        </div>
        <div>
          Using{" "}
          {activeTab === "image" ? imageModel : 
          activeTab === "video" ? videoModel : 
          speechModel}
        </div>
      </CardFooter>
    </Card>
  );
}

export default UGCGenerator;
