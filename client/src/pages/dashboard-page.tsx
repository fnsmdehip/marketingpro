import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import PlatformStatus from "@/components/dashboard/platform-status";
import UpcomingContent from "@/components/dashboard/upcoming-content";
import AIProviderCard from "@/components/dashboard/ai-provider-card";
import MarketingTools from "@/components/dashboard/marketing-tools";
import { useContentScheduler } from "@/hooks/use-content-scheduler";
import { Eye, BarChart2, DollarSign, Calendar, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardData {
  platforms: any[];
  upcomingContent: any[];
  aiProviders: any[];
}

export default function DashboardPage() {
  const { openScheduler } = useContentScheduler();
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout title="Dashboard">
      {/* Quick actions */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
        <Button onClick={openScheduler}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Content
        </Button>
      </div>

      {/* Stats cards */}
      <motion.div 
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Views"
            value="2,453"
            icon={<Eye className="h-6 w-6" />}
            iconBgColor="bg-primary-100"
            iconColor="text-primary-600"
            changeValue="12.5%"
            changeDirection="up"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Engagement Rate"
            value="4.8%"
            icon={<BarChart2 className="h-6 w-6" />}
            iconBgColor="bg-secondary-100"
            iconColor="text-secondary-600"
            changeValue="3.2%"
            changeDirection="up"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Conversion Rate"
            value="2.3%"
            icon={<DollarSign className="h-6 w-6" />}
            iconBgColor="bg-accent-100"
            iconColor="text-accent-600"
            changeValue="0.8%"
            changeDirection="up"
          />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform status */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PlatformStatus />
        </motion.div>

        {/* Upcoming content */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <UpcomingContent />
        </motion.div>
      </div>

      {/* AI Provider Status */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">AI Provider Status</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-3 py-12 flex justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : error ? (
            <div className="col-span-3 py-12 text-center text-red-500">
              Failed to load AI provider status
            </div>
          ) : (
            data?.aiProviders.map((provider, index) => (
              <motion.div
                key={provider.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <AIProviderCard provider={provider} />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Marketing Tools */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <MarketingTools />
      </motion.div>
    </DashboardLayout>
  );
}
