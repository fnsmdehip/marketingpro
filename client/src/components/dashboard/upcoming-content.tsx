import { useState } from "react";
import { useContentScheduler } from "@/hooks/use-content-scheduler";
import { format } from "date-fns";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Content } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export function UpcomingContent() {
  const { toast } = useToast();
  const { upcomingContent, isLoadingUpcoming, refreshUpcoming, openScheduler, updateSchedulerContent } = useContentScheduler();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const formatScheduledTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'needs-review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUpcoming();
    setIsRefreshing(false);
  };
  
  const handleEdit = (content: Content) => {
    updateSchedulerContent({
      ...content,
      platforms: Array.isArray(content.platforms) ? content.platforms : [],
      mediaUrls: Array.isArray(content.mediaUrls) ? content.mediaUrls : []
    });
    openScheduler();
  };
  
  // Delete content mutation
  const deleteContentMutation = useMutation({
    mutationFn: async (contentId: number) => {
      await apiRequest("DELETE", `/api/content/${contentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Content deleted",
        description: "The scheduled content has been removed"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  const handleDelete = (contentId: number) => {
    if (confirm("Are you sure you want to delete this content?")) {
      deleteContentMutation.mutate(contentId);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Upcoming Content</CardTitle>
          <CardDescription>Your scheduled posts for the next 7 days</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoadingUpcoming || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {upcomingContent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No upcoming content scheduled</p>
            <Button onClick={openScheduler}>Create New</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {upcomingContent.map((content) => (
              <div key={content.id} className="py-4">
                <div className="flex justify-between">
                  <div className="text-sm font-medium text-gray-500">
                    {formatScheduledTime(content.scheduledAt)}
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(content.status)}`}>
                      {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-900 line-clamp-2">{content.title}</p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{content.body}</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex">
                    {Array.isArray(content.platforms) && content.platforms.map((platform, idx) => (
                      <img 
                        key={idx}
                        src={platformIcons[platform.toLowerCase()] || platformIcons.twitter} 
                        alt={platform} 
                        className="h-6 w-6 rounded-full mr-1"
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(content)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(content.id)}
                      disabled={deleteContentMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingContent;
