import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Loader2 } from "lucide-react";

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState("templates");

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/user"],
  });

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Studio</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Content
        </Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ugc">UGC Generator</TabsTrigger>
          <TabsTrigger value="videos">Video Creation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Content Templates</CardTitle>
              <CardDescription>
                Ready-made templates for various content types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Choose from professionally designed templates to speed up your content creation.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Blog Post", "Social Media", "Email Newsletter", "Video Script", "Product Description"].map((template) => (
                  <Card key={template} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{template}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4 px-4">
                      <Button className="w-full" variant="outline">Use Template</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ugc">
          <Card>
            <CardHeader>
              <CardTitle>UGC Generator</CardTitle>
              <CardDescription>
                Create user-generated style content with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center p-8">UGC Generator will be implemented soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Video Creation</CardTitle>
              <CardDescription>
                Generate video content for your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center p-8">Video Creation tools will be implemented soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
