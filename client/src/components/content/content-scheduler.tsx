import { useEffect, useState } from "react";
import { useContentScheduler } from "@/hooks/use-content-scheduler";
import { useAIProviders } from "@/hooks/use-ai-providers";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformPreview } from "./platform-preview";

// Platform icons mapping
const platformIcons: Record<string, string> = {
  twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  x: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/174/174848.png",
  tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
  threads: "https://cdn-icons-png.flaticon.com/512/11478/11478232.png",
  pinterest: "https://cdn-icons-png.flaticon.com/512/174/174863.png",
  bluesky: "https://seeklogo.com/images/B/bluesky-logo-F30D174AE8-seeklogo.com.png"
};

// Available platforms
const availablePlatforms = [
  { id: "twitter", name: "Twitter/X" },
  { id: "instagram", name: "Instagram" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "facebook", name: "Facebook" },
  { id: "tiktok", name: "TikTok" },
  { id: "youtube", name: "YouTube" },
  { id: "threads", name: "Threads" },
  { id: "pinterest", name: "Pinterest" },
  { id: "bluesky", name: "Bluesky" }
];

export function ContentScheduler() {
  const { 
    isSchedulerOpen, 
    closeScheduler, 
    schedulerContent, 
    updateSchedulerContent,
    resetSchedulerContent,
    selectedPlatforms,
    togglePlatform,
    schedulingType,
    setSchedulingType,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    aiEnhancement,
    setAiEnhancement,
    enhanceContent,
    createContentMutation
  } = useContentScheduler();
  
  const { isGeneratingText } = useAIProviders();
  const [activeTab, setActiveTab] = useState("original");
  
  // Initialize form with scheduler content
  useEffect(() => {
    if (schedulerContent.id) {
      // If editing existing content, set platforms
      if (Array.isArray(schedulerContent.platforms) && schedulerContent.platforms.length > 0) {
        schedulerContent.platforms.forEach(platform => {
          togglePlatform(platform);
        });
      }
      
      // Set scheduling type and time if available
      if (schedulerContent.scheduleType) {
        setSchedulingType(schedulerContent.scheduleType as any);
      }
      
      if (schedulerContent.scheduledAt) {
        const date = new Date(schedulerContent.scheduledAt);
        setScheduledDate(date.toISOString().split('T')[0]);
        setScheduledTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
      }
    }
  }, [schedulerContent.id]);
  
  // Handle form submission
  const handleSubmit = () => {
    if (!schedulerContent.title || !schedulerContent.body) {
      alert("Please provide both title and content.");
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    
    // Prepare scheduled date if needed
    let scheduledAt = null;
    if (schedulingType === "later" && scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
    } else if (schedulingType === "optimal") {
      // For optimal, we would typically use the server to determine the best time
      // For now, just schedule 24 hours in the future
      scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    
    // Prepare status based on scheduling type
    const status = schedulingType === "now" ? "published" : "scheduled";
    
    // Submit the content
    createContentMutation.mutate({
      ...schedulerContent,
      userId: 0, // This will be set server-side from the authenticated user
      platforms: selectedPlatforms,
      scheduleType: schedulingType,
      scheduledAt: scheduledAt?.toISOString(),
      status,
    });
  };
  
  // Handle AI enhancement
  const handleEnhance = async () => {
    const enhancedContent = await enhanceContent(aiEnhancement);
    if (enhancedContent) {
      updateSchedulerContent({ body: enhancedContent });
    }
  };
  
  if (!isSchedulerOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Schedule Content</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button 
                      type="button" 
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={closeScheduler}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 relative flex-1 px-4 sm:px-6">
                <div className="absolute inset-0 px-4 sm:px-6">
                  <div className="h-full space-y-4">
                    {/* Content form */}
                    <div>
                      <Label htmlFor="content-title">Content Title</Label>
                      <Input 
                        id="content-title" 
                        value={schedulerContent.title || ""} 
                        onChange={(e) => updateSchedulerContent({ title: e.target.value })}
                        placeholder="Enter a title for internal reference" 
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content-body">Content</Label>
                      <Textarea 
                        id="content-body" 
                        value={schedulerContent.body || ""} 
                        onChange={(e) => updateSchedulerContent({ body: e.target.value })}
                        placeholder="What do you want to share?" 
                        className="mt-1" 
                        rows={4}
                      />
                    </div>
                    
                    {/* Platform selection */}
                    <div>
                      <Label>Select Platforms</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {availablePlatforms.map(platform => (
                          <label 
                            key={platform.id}
                            className={`relative flex flex-col items-center justify-center border rounded-md p-2 cursor-pointer hover:bg-gray-50 ${
                              selectedPlatforms.includes(platform.id) ? 'border-primary-500 bg-primary-50' : ''
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              className="absolute h-0 w-0 opacity-0" 
                              checked={selectedPlatforms.includes(platform.id)}
                              onChange={() => togglePlatform(platform.id)}
                            />
                            <span className={`absolute top-1 right-1 text-primary-600 ${selectedPlatforms.includes(platform.id) ? 'block' : 'hidden'}`}>
                              <Check className="h-4 w-4" />
                            </span>
                            <img 
                              src={platformIcons[platform.id.toLowerCase()]} 
                              alt={platform.name} 
                              className="h-8 w-8 mx-auto"
                            />
                            <span className="block text-xs mt-1 text-center">{platform.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Scheduling options */}
                    <div>
                      <Label>Scheduling Options</Label>
                      <RadioGroup 
                        value={schedulingType} 
                        onValueChange={(value) => setSchedulingType(value as "now" | "later" | "optimal")}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="now" id="schedule-now" />
                          <Label htmlFor="schedule-now">Post now</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="later" id="schedule-later" />
                          <Label htmlFor="schedule-later">Schedule for later</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="optimal" id="schedule-optimal" />
                          <Label htmlFor="schedule-optimal">Optimal time (AI recommended)</Label>
                        </div>
                      </RadioGroup>
                      
                      {schedulingType === "later" && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="schedule-date">Date</Label>
                            <Input 
                              type="date" 
                              id="schedule-date" 
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="schedule-time">Time</Label>
                            <Input 
                              type="time" 
                              id="schedule-time" 
                              value={scheduledTime}
                              onChange={(e) => setScheduledTime(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* AI enhancement */}
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">AI Enhancement</h3>
                        <div className="ml-4 flex-shrink-0">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={handleEnhance}
                            disabled={isGeneratingText || !schedulerContent.body}
                          >
                            {isGeneratingText ? 'Enhancing...' : 'Apply'}
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Select 
                          value={aiEnhancement} 
                          onValueChange={setAiEnhancement}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select enhancement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="optimize">Optimize for engagement</SelectItem>
                            <SelectItem value="rewrite">Rewrite for clarity</SelectItem>
                            <SelectItem value="emotions">Add emotional triggers</SelectItem>
                            <SelectItem value="hashtags">Generate optimal hashtags</SelectItem>
                            <SelectItem value="questions">Convert to engaging question</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Platform preview tabs */}
                    <div>
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="original">Original</TabsTrigger>
                          {selectedPlatforms.slice(0, 3).map(platform => (
                            <TabsTrigger key={platform} value={platform}>
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        <TabsContent value="original">
                          <div className="mt-4 bg-gray-100 rounded-md p-4 text-sm">
                            {schedulerContent.body || "Original content preview will appear here."}
                          </div>
                        </TabsContent>
                        
                        {selectedPlatforms.slice(0, 3).map(platform => (
                          <TabsContent key={platform} value={platform}>
                            <PlatformPreview 
                              platform={platform} 
                              content={schedulerContent.body || ""} 
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button 
                        variant="outline"
                        onClick={() => { resetSchedulerContent(); closeScheduler(); }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        disabled={createContentMutation.isPending}
                        onClick={handleSubmit}
                      >
                        {createContentMutation.isPending ? 'Scheduling...' : 'Schedule'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentScheduler;
