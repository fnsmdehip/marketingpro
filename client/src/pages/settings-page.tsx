import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Bell, CreditCard, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [company, setCompany] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [contentReminders, setContentReminders] = useState(true);
  const [analyticsReports, setAnalyticsReports] = useState(true);
  
  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <DashboardLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
          <p className="text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="flex flex-col space-y-1">
                  <Button 
                    variant={activeTab === "profile" ? "default" : "ghost"} 
                    className="justify-start" 
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button 
                    variant={activeTab === "notifications" ? "default" : "ghost"} 
                    className="justify-start" 
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === "billing" ? "default" : "ghost"} 
                    className="justify-start" 
                    onClick={() => setActiveTab("billing")}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Separator className="my-2" />
                  <Button 
                    variant="ghost" 
                    className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          value={company} 
                          onChange={(e) => setCompany(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 items-center">
                        <span className="text-sm text-gray-500">Plan:</span>
                        <span className="font-medium">Pro Plan</span>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <span className="text-sm text-gray-500">Member Since:</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <span className="text-sm text-gray-500">Next Billing Date:</span>
                        <span className="font-medium">
                          {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">
                          Receive important account updates via email
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">
                          Receive news, updates, and offers from us
                        </p>
                      </div>
                      <Switch 
                        checked={marketingEmails} 
                        onCheckedChange={setMarketingEmails} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Content Reminders</h3>
                        <p className="text-sm text-gray-500">
                          Get reminded about scheduled content in advance
                        </p>
                      </div>
                      <Switch 
                        checked={contentReminders} 
                        onCheckedChange={setContentReminders} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Analytics Reports</h3>
                        <p className="text-sm text-gray-500">
                          Receive weekly performance reports via email
                        </p>
                      </div>
                      <Switch 
                        checked={analyticsReports} 
                        onCheckedChange={setAnalyticsReports} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your billing information and subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">Current Plan</h3>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-primary-700">Pro Plan</h4>
                          <p className="text-sm text-gray-600">$49.99/month, billed monthly</p>
                        </div>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                          Unlimited content scheduling
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                          Advanced AI content generation
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                          Analytics & reporting
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></div>
                          Multi-platform support
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs">
                          VISA
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-4">Billing History</h3>
                    <div className="divide-y divide-gray-200">
                      {[
                        { date: "Mar 01, 2025", amount: "$49.99", status: "Paid" },
                        { date: "Feb 01, 2025", amount: "$49.99", status: "Paid" },
                        { date: "Jan 01, 2025", amount: "$49.99", status: "Paid" }
                      ].map((invoice, index) => (
                        <div key={index} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{invoice.date}</p>
                            <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full mr-3 ${
                              invoice.status === "Paid" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {invoice.status}
                            </span>
                            <span className="font-medium">{invoice.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}