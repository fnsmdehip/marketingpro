import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
type ScheduleContent = {
  title?: string;
  body?: string;
  mediaUrl?: string;
};

// Context
type SchedulerContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: ScheduleContent;
  updateContent: (content: ScheduleContent) => void;
};

const SchedulerContext = createContext<SchedulerContextType | null>(null);

export function ContentSchedulerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ScheduleContent>({});

  const updateContent = (newContent: ScheduleContent) => {
    setContent((prev) => ({ ...prev, ...newContent }));
  };
  
  // Set the context in the service
  const contextValue = { open, setOpen, content, updateContent };
  // Effect to update the service with the latest context
  useEffect(() => {
    SchedulerService.setContext(contextValue);
  }, [open, content]);

  return (
    <SchedulerContext.Provider value={contextValue}>
      {children}
      <ContentSchedulerDialog />
    </SchedulerContext.Provider>
  );
}

// Custom hooks
export function useContentScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useContentScheduler must be used within a ContentSchedulerProvider");
  }
  return context;
}

// Create a scheduler service object instead of hooks
export const SchedulerService = {
  _context: null as SchedulerContextType | null,
  
  setContext(context: SchedulerContextType) {
    this._context = context;
  },
  
  openScheduler() {
    if (this._context) {
      this._context.setOpen(true);
    }
  },
  
  updateContent(content: ScheduleContent) {
    if (this._context) {
      this._context.updateContent(content);
    }
  }
};

// Dialog Component
function ContentSchedulerDialog() {
  const { open, setOpen, content } = useContentScheduler();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [mediaUrl, setMediaUrl] = useState("");
  const [activeTab, setActiveTab] = useState("compose");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get platforms data
  const { data: platforms = [] } = useQuery({
    queryKey: ["/api/platforms"],
  });
  
  // Schedule content mutation
  const scheduleContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/content", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Content scheduled",
        description: "Your content has been scheduled successfully.",
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error scheduling content",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Reset form when dialog opens
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    
    if (open && content) {
      setTitle(content.title || "");
      setBody(content.body || "");
      setMediaUrl(content.mediaUrl || "");
      setActiveTab("compose");
    }
  };
  
  // Handle schedule submission
  const handleSchedule = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content.",
        variant: "destructive",
      });
      return;
    }
    
    if (!body) {
      toast({
        title: "Content required",
        description: "Please enter content to schedule.",
        variant: "destructive",
      });
      return;
    }
    
    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date to schedule.",
        variant: "destructive",
      });
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number);
    const scheduleDate = new Date(date);
    scheduleDate.setHours(hours, minutes);
    
    scheduleContentMutation.mutate({
      title,
      body,
      platform,
      scheduleDate: scheduleDate.toISOString(),
      mediaUrl: mediaUrl || undefined,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
          <DialogDescription>
            Create and schedule content across your social platforms
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your content here..."
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="media">Media URL (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="media"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <div className="flex h-10 items-center border rounded-md pl-3 pr-1">
                  <Clock className="mr-2 h-4 w-4 opacity-50" />
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 border-0 bg-transparent p-0 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-2">Content Preview</h4>
                <div className="text-sm">
                  <p className="font-medium">{title || "No title"}</p>
                  <p className="text-gray-500 mt-1 line-clamp-2">{body || "No content"}</p>
                  {mediaUrl && (
                    <p className="text-xs text-blue-500 mt-1">{mediaUrl}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={scheduleContentMutation.isPending}>
            {scheduleContentMutation.isPending ? "Scheduling..." : "Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}