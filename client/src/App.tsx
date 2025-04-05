import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ContentSchedulerProvider } from "@/hooks/use-content-scheduler";
import { AIProvider } from "@/hooks/use-ai-providers";
import { ProtectedRoute } from "./lib/protected-route";

// Pages
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ContentCalendarPage from "@/pages/content-calendar-page";
import ContentStudioPage from "@/pages/content-studio-page";
import AIGeneratorPage from "@/pages/ai-generator-page";
import AnalyticsPage from "@/pages/analytics-page";
import SettingsPage from "@/pages/settings-page";
import SubscribePage from "@/pages/subscribe-page";
import NotFound from "@/pages/not-found";

// Marketing Tools Pages
import ConversionTactics from "@/pages/marketing-tools/conversion-tactics";
import GrowthEngines from "@/pages/marketing-tools/growth-engines";
import Automation from "@/pages/marketing-tools/automation";
import PromptArsenal from "@/pages/marketing-tools/prompt-arsenal";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/content-calendar" component={ContentCalendarPage} />
      <ProtectedRoute path="/content-studio" component={ContentStudioPage} />
      <ProtectedRoute path="/ai-generator" component={AIGeneratorPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/subscribe" component={SubscribePage} />
      
      {/* Marketing Tools */}
      <ProtectedRoute path="/marketing-tools/conversion-tactics" component={ConversionTactics} />
      <ProtectedRoute path="/marketing-tools/growth-engines" component={GrowthEngines} />
      <ProtectedRoute path="/marketing-tools/automation" component={Automation} />
      <ProtectedRoute path="/marketing-tools/prompt-arsenal" component={PromptArsenal} />
      
      {/* Fallback 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ContentSchedulerProvider>
          <AIProvider>
            <Router />
            <Toaster />
          </AIProvider>
        </ContentSchedulerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
