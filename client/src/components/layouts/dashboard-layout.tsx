import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Calendar,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title = "Dashboard" }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: location === "/dashboard",
    },
    {
      name: "AI Generator",
      href: "/ai-generator",
      icon: <Sparkles className="h-5 w-5" />,
      active: location === "/ai-generator",
    },
    {
      name: "Content Calendar",
      href: "/content-calendar",
      icon: <Calendar className="h-5 w-5" />,
      active: location === "/content-calendar",
    },
    {
      name: "Content Studio",
      href: "/content-studio",
      icon: <Zap className="h-5 w-5" />,
      active: location === "/content-studio",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      active: location === "/analytics",
    },
    // Tools submenu
    {
      name: "Marketing Tools",
      icon: <GraduationCap className="h-5 w-5" />,
      hasSubmenu: true,
      active: location.startsWith("/marketing"),
      submenu: [
        {
          name: "Automation",
          href: "/marketing/automation",
          active: location === "/marketing/automation",
        },
        {
          name: "Conversion Tactics",
          href: "/marketing/conversion-tactics",
          active: location === "/marketing/conversion-tactics",
        },
        {
          name: "Growth Engines",
          href: "/marketing/growth-engines",
          active: location === "/marketing/growth-engines",
        },
        {
          name: "Prompt Arsenal",
          href: "/marketing/prompt-arsenal",
          active: location === "/marketing/prompt-arsenal",
        },
        {
          name: "Web Scraper",
          href: "/marketing/web-scraper",
          active: location === "/marketing/web-scraper",
        },
        {
          name: "Content Research",
          href: "/marketing/content-research",
          active: location === "/marketing/content-research",
        },
      ],
    },
  ];

  const secondaryNavItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      active: location === "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <div className="flex flex-col flex-grow border-r bg-background pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/dashboard" className="flex items-center">
              <Zap className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl">Marketing Pro</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navItems.map((item, i) => (
                <div key={i}>
                  {item.hasSubmenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center w-full px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                            item.active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          )}
                        >
                          {item.icon}
                          <span className="ml-3 flex-1">{item.name}</span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56 ml-2">
                        {item.submenu?.map((subItem, j) => (
                          <DropdownMenuItem key={j} asChild>
                            <Link
                              href={subItem.href || "/"}
                              className={cn(
                                "w-full cursor-pointer",
                                subItem.active && "bg-primary/10 text-primary"
                              )}
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href || "/"}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="border-t pt-4 pb-4 px-2">
              <nav className="space-y-1">
                {secondaryNavItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
                <button
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted w-full"
                  onClick={() => console.log("logout")}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center">
          <Zap className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl">Marketing Pro</span>
        </Link>
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex justify-between items-center">
                <span className="flex items-center">
                  <Zap className="h-6 w-6 text-primary mr-2" />
                  <span className="font-bold">Marketing Pro</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileNav}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item, i) => (
                <div key={i}>
                  {item.hasSubmenu ? (
                    <div className="space-y-1">
                      <div className="py-2">
                        <div className="flex items-center px-2 py-2 text-sm font-medium">
                          {item.icon}
                          <span className="ml-3 font-bold">{item.name}</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.submenu?.map((subItem, j) => (
                            <Link
                              key={j}
                              href={subItem.href || "/"}
                              onClick={closeMobileNav}
                              className={cn(
                                "flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                                subItem.active
                                  ? "bg-primary/10 text-primary"
                                  : "text-foreground"
                              )}
                            >
                              <span className="ml-3">{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href || "/"}
                      onClick={closeMobileNav}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              <div className="border-t my-4"></div>
              {secondaryNavItems.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  onClick={closeMobileNav}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md group hover:bg-muted",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
              <button
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-foreground hover:bg-muted w-full"
                onClick={() => console.log("logout")}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-foreground mb-6">{title}</h1>
            </div>
            <div className="px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}