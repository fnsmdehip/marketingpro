import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AiGeneratorPage from "@/pages/ai-generator-page";
import ContentCalendarPage from "@/pages/content-calendar-page";
import ContentStudioPage from "@/pages/content-studio-page";
import AnalyticsPage from "@/pages/analytics-page";
import SettingsPage from "@/pages/settings-page";
import SubscribePage from "@/pages/subscribe-page";

// Marketing tools
import AutomationPage from "@/pages/marketing-tools/automation";
import ConversionTacticsPage from "@/pages/marketing-tools/conversion-tactics";
import GrowthEnginesPage from "@/pages/marketing-tools/growth-engines";
import PromptArsenalPage from "@/pages/marketing-tools/prompt-arsenal";
import WebScraperPage from "@/pages/marketing-tools/web-scraper-page";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/subscribe" component={SubscribePage} />
      
      {/* Protected routes - These would normally be protected */}
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/ai-generator" component={AiGeneratorPage} />
      <Route path="/content-calendar" component={ContentCalendarPage} />
      <Route path="/content-studio" component={ContentStudioPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={SettingsPage} />
      
      {/* Marketing tools */}
      <Route path="/marketing/automation" component={AutomationPage} />
      <Route path="/marketing/conversion-tactics" component={ConversionTacticsPage} />
      <Route path="/marketing/growth-engines" component={GrowthEnginesPage} />
      <Route path="/marketing/prompt-arsenal" component={PromptArsenalPage} />
      <Route path="/marketing/web-scraper" component={WebScraperPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
