import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  AlertTriangle, 
  ArrowUpDown, 
  Check, 
  Copy, 
  Code, 
  PlusCircle,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Pixel {
  name: string;
  id: string;
  status: string;
  events: string[];
}

interface ConversionEvent {
  name: string;
  value: number | string;
  trackingCode: string;
}

interface PerformanceMetrics {
  costPerAcquisition: string;
  conversionRate: string;
  returnOnAdSpend: string;
}

interface TrackingConfiguration {
  pixels: Pixel[];
  conversionEvents: ConversionEvent[];
  performanceMetrics: PerformanceMetrics;
}

export default function ConversionTracking() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pixels');
  const [isAddPixelOpen, setIsAddPixelOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Fetch conversion tracking configuration
  const { data, isLoading, error, refetch } = useQuery<{ success: boolean, data: TrackingConfiguration }>({
    queryKey: ['/api/analytics/conversion-tracking'],
    retry: 1,
  });

  const trackingConfig = data?.data;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-10 w-10 text-warning mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Unable to load conversion tracking data</h3>
        <p className="text-muted-foreground mb-4">
          There was an error retrieving your tracking configuration. Please try again.
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!trackingConfig) {
    return (
      <div className="p-6 text-center">
        <Code className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No tracking configuration available</h3>
        <p className="text-muted-foreground mb-4">
          Set up tracking pixels and conversion events to start monitoring your marketing performance.
        </p>
        <Button onClick={() => setIsAddPixelOpen(true)}>Add First Tracking Pixel</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conversion Tracking</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddEventOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsAddPixelOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Pixel
          </Button>
        </div>
      </div>

      {trackingConfig.performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Cost Per Acquisition</h3>
                <p className="text-2xl font-bold">{trackingConfig.performanceMetrics.costPerAcquisition}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversion Rate</h3>
                <p className="text-2xl font-bold">{trackingConfig.performanceMetrics.conversionRate}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Return on Ad Spend</h3>
                <p className="text-2xl font-bold">{trackingConfig.performanceMetrics.returnOnAdSpend}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pixels">Tracking Pixels</TabsTrigger>
          <TabsTrigger value="events">Conversion Events</TabsTrigger>
        </TabsList>

        <TabsContent value="pixels" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Installed Tracking Pixels</CardTitle>
              <CardDescription>
                Manage third-party tracking pixels for your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trackingConfig.pixels.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tracking pixels configured yet</p>
                  <Button className="mt-4" onClick={() => setIsAddPixelOpen(true)}>Add Tracking Pixel</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trackingConfig.pixels.map((pixel) => (
                    <div key={pixel.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{pixel.name}</h3>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              pixel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {pixel.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">ID: {pixel.id}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Switch checked={pixel.status === 'active'} />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Tracked Events</h4>
                        <div className="flex flex-wrap gap-2">
                          {pixel.events.map((event, index) => (
                            <div key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                              {event}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Events</CardTitle>
              <CardDescription>
                Define and manage conversion events for your marketing funnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trackingConfig.conversionEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No conversion events configured yet</p>
                  <Button className="mt-4" onClick={() => setIsAddEventOpen(true)}>Add Conversion Event</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trackingConfig.conversionEvents.map((event, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Value: {typeof event.value === 'string' ? event.value : `$${event.value}`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="icon" onClick={() => copyToClipboard(event.trackingCode)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Implementation Code</h4>
                        <div className="bg-gray-50 p-3 rounded-md text-sm font-mono relative">
                          {event.trackingCode}
                          <button 
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => copyToClipboard(event.trackingCode)}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Pixel Dialog */}
      <Dialog open={isAddPixelOpen} onOpenChange={setIsAddPixelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracking Pixel</DialogTitle>
            <DialogDescription>
              Add a new tracking pixel to monitor your marketing campaigns.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pixel-type">Pixel Type</Label>
              <Select defaultValue="facebook">
                <SelectTrigger>
                  <SelectValue placeholder="Select pixel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook Pixel</SelectItem>
                  <SelectItem value="google">Google Analytics</SelectItem>
                  <SelectItem value="tiktok">TikTok Pixel</SelectItem>
                  <SelectItem value="twitter">Twitter Pixel</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Insight Tag</SelectItem>
                  <SelectItem value="custom">Custom Pixel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pixel-id">Pixel ID</Label>
              <Input id="pixel-id" placeholder="Enter your pixel ID" />
            </div>
            <div className="space-y-2">
              <Label>Default Events</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pageview" defaultChecked />
                  <label
                    htmlFor="pageview"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    PageView
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="addtocart" defaultChecked />
                  <label
                    htmlFor="addtocart"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    AddToCart
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="purchase" defaultChecked />
                  <label
                    htmlFor="purchase"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Purchase
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPixelOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Pixel added",
                  description: "Your tracking pixel has been added successfully.",
                });
                setIsAddPixelOpen(false);
              }}
            >
              Add Pixel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Conversion Event</DialogTitle>
            <DialogDescription>
              Create a new conversion event to track user actions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input id="event-name" placeholder="e.g., Newsletter Signup" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-value">Event Value</Label>
              <Input id="event-value" placeholder="e.g., 10" type="number" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dynamic-value" />
              <label
                htmlFor="dynamic-value"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Use dynamic value (from order value)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Event added",
                  description: "Your conversion event has been added successfully.",
                });
                setIsAddEventOpen(false);
              }}
            >
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Checkbox component
function Checkbox(props: React.ComponentPropsWithoutRef<"input"> & { id: string }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        {...props}
      />
    </div>
  );
}