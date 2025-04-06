import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ContentSchedulerProvider } from "./components/content/content-scheduler";
import { AIProvider } from "./hooks/use-ai-providers";
import { Toaster } from "./components/ui/toaster";

// For debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.log('Global error handler:', message, source, lineno, colno, error);
};

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ContentSchedulerProvider>
        <AIProvider>
          <App />
          <Toaster />
        </AIProvider>
      </ContentSchedulerProvider>
    </AuthProvider>
  </QueryClientProvider>
);
