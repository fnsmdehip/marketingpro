import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Calendar, 
  Package2, 
  Zap, 
  BarChart2, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Box, 
  Sparkles,
  LogOut,
  CreditCard,
  Crown
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavItem = ({ 
  href, 
  icon: Icon, 
  children, 
  onClick 
}: { 
  href?: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  onClick?: () => void;
}) => {
  const [location] = useLocation();
  const isActive = href ? location === href : false;
  
  const content = (
    <div
      className={cn(
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
        isActive 
          ? "bg-primary-50 text-primary-700" 
          : "text-gray-700 hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      <Icon 
        className={cn(
          "mr-3 h-6 w-6", 
          isActive 
            ? "text-primary-500" 
            : "text-gray-400 group-hover:text-gray-500"
        )} 
      />
      {children}
    </div>
  );
  
  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  
  return <button className="w-full text-left">{content}</button>;
};

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-white">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.4468" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-900">MarketingPro.ai</span>
          </div>
        </div>
        
        <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
          {/* Upgrade banner for free users */}
          {user?.plan === 'free' && (
            <div className="mx-3 mb-4 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <Crown className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Upgrade to Pro</h3>
                  <p className="text-xs mt-1 text-amber-700">Unlock unlimited posts, AI content & more.</p>
                  <Link href="/subscribe?plan=pro">
                    <a className="mt-2 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded bg-amber-500 text-white hover:bg-amber-600">
                      <CreditCard className="w-3 h-3 mr-1" />
                      Upgrade Now
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          <nav className="px-3 mt-5">
            <div className="space-y-1">
              <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
              <NavItem href="/content-calendar" icon={Calendar}>Content Calendar</NavItem>
              <NavItem href="/content-studio" icon={Package2}>Content Studio</NavItem>
              <NavItem href="/ai-generator" icon={Zap}>AI Generator</NavItem>
              <NavItem href="/analytics" icon={BarChart2}>Analytics</NavItem>
              <NavItem href="/settings" icon={Settings}>Settings</NavItem>
            </div>
            
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Marketing Tools
              </h3>
              <div className="mt-1 space-y-1">
                <NavItem href="/marketing-tools/conversion-tactics" icon={MessageSquare}>
                  Conversion Tactics
                </NavItem>
                <NavItem href="/marketing-tools/growth-engines" icon={TrendingUp}>
                  Growth Engines
                </NavItem>
                <NavItem href="/marketing-tools/automation" icon={Box}>
                  Automation
                </NavItem>
                <NavItem href="/marketing-tools/prompt-arsenal" icon={Sparkles}>
                  Prompt Arsenal
                </NavItem>
              </div>
            </div>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || ""} />
                  <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.username || "User"}</p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1) || "Free"} Plan</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
