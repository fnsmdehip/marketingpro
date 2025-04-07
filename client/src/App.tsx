import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
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
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
      </Route>
      <Route path="/ai-generator">
        <ProtectedRoute path="/ai-generator" component={AiGeneratorPage} />
      </Route>
      <Route path="/content-calendar">
        <ProtectedRoute path="/content-calendar" component={ContentCalendarPage} />
      </Route>
      <Route path="/content-studio">
        <ProtectedRoute path="/content-studio" component={ContentStudioPage} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute path="/settings" component={SettingsPage} />
      </Route>
      
      {/* Marketing tools */}
      <Route path="/marketing/automation">
        <ProtectedRoute path="/marketing/automation" component={AutomationPage} />
      </Route>
      <Route path="/marketing/conversion-tactics">
        <ProtectedRoute path="/marketing/conversion-tactics" component={ConversionTacticsPage} />
      </Route>
      <Route path="/marketing/growth-engines">
        <ProtectedRoute path="/marketing/growth-engines" component={GrowthEnginesPage} />
      </Route>
      <Route path="/marketing/prompt-arsenal">
        <ProtectedRoute path="/marketing/prompt-arsenal" component={PromptArsenalPage} />
      </Route>
      <Route path="/marketing/web-scraper">
        <ProtectedRoute path="/marketing/web-scraper" component={WebScraperPage} />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
