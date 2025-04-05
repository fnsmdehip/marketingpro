import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LayoutGrid,
  BarChart3,
  Image,
  Layers,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/", icon: <LayoutGrid className="h-5 w-5" /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Content Calendar", href: "/content-calendar", icon: <Calendar className="h-5 w-5" /> },
    { name: "Content Studio", href: "/content-studio", icon: <Layers className="h-5 w-5" /> },
    { name: "AI Generator", href: "/ai-generator", icon: <Image className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <div 
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        
        <motion.div 
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <span className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  MarketHQ
                </span>
              </a>
            </Link>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="px-4 py-6">
            {user && (
              <div className="mb-6 px-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location === item.href
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-primary/10"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col border-r border-gray-200">
        <div className="flex h-16 items-center justify-center border-b">
          <Link href="/">
            <a className="flex items-center">
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                MarketHQ
              </span>
            </a>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          {user && (
            <div className="mb-6 px-2">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    location === item.href
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary/10"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-x-4 border-b bg-white px-4 lg:hidden">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-1 justify-between">
            <h1 className="text-lg font-semibold">{title}</h1>
            
            <div className="flex items-center gap-x-3">
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
              >
                <Bell className="h-5 w-5" />
              </Button>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <a className="flex w-full cursor-pointer items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => logoutMutation.mutate()}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop header */}
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-16 lg:items-center lg:justify-between lg:border-b lg:bg-white lg:px-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          
          <div className="flex items-center gap-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <Button variant="ghost" className="h-9 w-9 p-0">
              <Bell className="h-5 w-5" />
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <a className="flex w-full cursor-pointer items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}