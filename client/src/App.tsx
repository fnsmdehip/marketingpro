import { Switch, Route } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Pages
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
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
