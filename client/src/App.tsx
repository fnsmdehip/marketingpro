import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

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

// Create a client
const queryClient = new QueryClient();

// Marketing Tools Pages (commented out until implemented)
// import ConversionTactics from "@/pages/marketing-tools/conversion-tactics";
// import GrowthEngines from "@/pages/marketing-tools/growth-engines";
// import Automation from "@/pages/marketing-tools/automation";
// import PromptArsenal from "@/pages/marketing-tools/prompt-arsenal";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <DashboardPage />
      </Route>
      <Route path="/content-calendar">
        <ContentCalendarPage />
      </Route>
      <Route path="/content-studio">
        <ContentStudioPage />
      </Route>
      <Route path="/ai-generator">
        <AIGeneratorPage />
      </Route>
      <Route path="/analytics">
        <AnalyticsPage />
      </Route>
      <Route path="/settings">
        <SettingsPage />
      </Route>
      <Route path="/subscribe">
        <SubscribePage />
      </Route>
      
      {/* Marketing Tools (will implement these later) */}
      {/* <Route path="/marketing-tools/conversion-tactics">
        <ConversionTactics />
      </Route>
      <Route path="/marketing-tools/growth-engines">
        <GrowthEngines />
      </Route>
      <Route path="/marketing-tools/automation">
        <Automation />
      </Route>
      <Route path="/marketing-tools/prompt-arsenal">
        <PromptArsenal />
      </Route> */}
      
      {/* Fallback 404 */}
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
