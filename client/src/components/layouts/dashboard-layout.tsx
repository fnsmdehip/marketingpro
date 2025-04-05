import { ReactNode } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { TopNav } from "@/components/ui/top-nav";
import { ContentScheduler } from "@/components/content/content-scheduler";
import { useContentScheduler } from "@/hooks/use-content-scheduler";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { isSchedulerOpen } = useContentScheduler();
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav title={title} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {isSchedulerOpen && <ContentScheduler />}
    </div>
  );
}

export default DashboardLayout;
