import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { useContentScheduler } from "@/hooks/use-content-scheduler";
import { CalendarView } from "@/components/calendar/calendar-view";
import { PlatformScheduler } from "@/components/calendar/platform-scheduler";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Calendar, List, Filter } from "lucide-react";

export default function ContentCalendarPage() {
  const { openScheduler } = useContentScheduler();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [filteredPlatform, setFilteredPlatform] = useState<string>("all");
  
  return (
    <DashboardLayout title="Content Calendar">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Content Calendar</h2>
            <p className="text-sm text-gray-500">
              Schedule and manage your content across all platforms
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-gray-500" />
              <Select 
                value={filteredPlatform} 
                onValueChange={setFilteredPlatform}
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={view === "calendar" ? "default" : "ghost"}
                size="sm" 
                onClick={() => setView("calendar")}
                className="rounded-none"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Calendar
              </Button>
              <Button 
                variant={view === "list" ? "default" : "ghost"}
                size="sm" 
                onClick={() => setView("list")}
                className="rounded-none"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
            
            <Button onClick={openScheduler}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Content
            </Button>
          </div>
        </div>
        
        {/* Calendar/List View */}
        <Card>
          {view === "calendar" ? (
            <CalendarView filteredPlatform={filteredPlatform} />
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Scheduled Content</h3>
                <Select defaultValue="upcoming">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="all">All Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="divide-y divide-gray-200">
                <ContentListItem 
                  title="How to 10x Your Marketing ROI with AI" 
                  platforms={["twitter", "instagram", "linkedin"]} 
                  date="Today, 3:00 PM" 
                  status="ready" 
                />
                <ContentListItem 
                  title="5 Psychological Triggers for Higher Conversion Rates" 
                  platforms={["twitter", "instagram"]} 
                  date="Tomorrow, 9:15 AM" 
                  status="needs-review" 
                />
                <ContentListItem 
                  title="Case Study: How We Generated 10,000 Leads in 30 Days" 
                  platforms={["twitter", "linkedin"]} 
                  date="Friday, 4:30 PM" 
                  status="ready" 
                />
                <ContentListItem 
                  title="The Future of Social Media Marketing in 2025" 
                  platforms={["twitter", "instagram", "linkedin", "facebook"]} 
                  date="Next Monday, 10:00 AM" 
                  status="draft" 
                />
                <ContentListItem 
                  title="7 AI Tools Every Marketer Should Be Using" 
                  platforms={["twitter", "linkedin"]} 
                  date="Next Wednesday, 2:30 PM" 
                  status="ready" 
                />
              </div>
            </div>
          )}
        </Card>
        
        {/* Platform-specific scheduling recommendations */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Platform-Specific Scheduling
          </h2>
          
          <Tabs defaultValue="twitter">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
            </TabsList>
            
            <TabsContent value="twitter">
              <PlatformScheduler platform="twitter" />
            </TabsContent>
            
            <TabsContent value="instagram">
              <PlatformScheduler platform="instagram" />
            </TabsContent>
            
            <TabsContent value="linkedin">
              <PlatformScheduler platform="linkedin" />
            </TabsContent>
            
            <TabsContent value="facebook">
              <PlatformScheduler platform="facebook" />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

// Platform icons mapping for content list
const platformIcons: Record<string, string> = {
  twitter: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
  instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
  linkedin: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
  facebook: "https://cdn-icons-png.flaticon.com/512/174/174848.png",
  tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png",
  youtube: "https://cdn-icons-png.flaticon.com/512/174/174883.png",
};

// Helper component for content list
interface ContentListItemProps {
  title: string;
  platforms: string[];
  date: string;
  status: "ready" | "needs-review" | "draft" | "published";
}

function ContentListItem({ title, platforms, date, status }: ContentListItemProps) {
  const statusColors = {
    ready: "bg-green-100 text-green-800",
    "needs-review": "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
    published: "bg-blue-100 text-blue-800",
  };
  
  const { openScheduler, updateSchedulerContent } = useContentScheduler();
  
  const handleEdit = () => {
    updateSchedulerContent({
      title,
      body: "", // This would normally come from the real content
      platforms,
      status,
    });
    openScheduler();
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between">
        <div className="text-sm font-medium text-gray-500">{date}</div>
        <div className="flex items-center">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-900">{title}</p>
      
      <div className="mt-2 flex items-center justify-between">
        <div className="flex">
          {platforms.map((platform) => (
            <img
              key={platform}
              src={platformIcons[platform]}
              alt={platform}
              className="h-6 w-6 rounded-full mr-1"
            />
          ))}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
