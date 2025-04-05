import { createContext, ReactNode, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";

type AIContextType = {
  providers: any[];
  isLoading: boolean;
  error: Error | null;
};

export const AIContext = createContext<AIContextType | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ["/api/ai/providers"],
  });

  return (
    <AIContext.Provider
      value={{
        providers: providers as any[],
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAIProviders() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAIProviders must be used within an AIProvider");
  }
  return context;
}