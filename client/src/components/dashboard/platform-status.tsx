import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Platform = {
  id: number;
  userId: number;
  platform: string;
  username: string;
  status: string;
  createdAt: string;
};

export function PlatformStatus() {
  const { data: platforms = [], isLoading } = useQuery<Platform[]>({
    queryKey: ['/api/platforms'],
  });

  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

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

  // Available platforms for connection
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

  const handleConnect = (platform: string) => {
    setSelectedPlatform(platform);
    setConnectModalOpen(true);
    // In a real implementation, this would open OAuth flow
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Status</CardTitle>
          <CardDescription>Your connected social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Status</CardTitle>
        <CardDescription>Your connected social media accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <ul role="list" className="divide-y divide-gray-200">
          {platforms.length > 0 ? (
            platforms.map((platform) => (
              <li key={platform.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={platformIcons[platform.platform.toLowerCase()] || platformIcons.twitter} 
                          alt={platform.platform} 
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{platform.platform}</p>
                          <p className="text-sm text-gray-500">Connected as @{platform.username}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {platform.status === 'active' ? 'Active' : platform.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">No platforms connected yet</p>
              <Button variant="outline" onClick={() => setConnectModalOpen(true)}>
                Connect a platform
              </Button>
            </div>
          )}
        </ul>

        {platforms.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" onClick={() => setConnectModalOpen(true)}>
              Connect more platforms
            </Button>
          </div>
        )}

        {/* This would be replaced with a proper modal component in a real implementation */}
        {connectModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Connect a platform</h3>
              <div className="grid grid-cols-3 gap-4">
                {availablePlatforms.filter(p => 
                  !platforms.some(connected => connected.platform.toLowerCase() === p.id.toLowerCase())
                ).map(platform => (
                  <button 
                    key={platform.id} 
                    className="flex flex-col items-center p-3 border rounded hover:bg-gray-50"
                    onClick={() => handleConnect(platform.id)}
                  >
                    <img 
                      src={platformIcons[platform.id.toLowerCase()]} 
                      alt={platform.name} 
                      className="h-8 w-8 mb-2" 
                    />
                    <span className="text-sm">{platform.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setConnectModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PlatformStatus;
