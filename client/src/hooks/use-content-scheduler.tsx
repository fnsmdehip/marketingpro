import { createContext, ReactNode, useContext, useState } from "react";

type ContentSchedulerContextType = {
  // Add content scheduler functionality if needed
};

export const ContentSchedulerContext = createContext<ContentSchedulerContextType | null>(null);

export function ContentSchedulerProvider({ children }: { children: ReactNode }) {
  return (
    <ContentSchedulerContext.Provider
      value={{
        // Add content scheduler value here
      }}
    >
      {children}
    </ContentSchedulerContext.Provider>
  );
}

export function useContentScheduler() {
  const context = useContext(ContentSchedulerContext);
  if (!context) {
    throw new Error("useContentScheduler must be used within a ContentSchedulerProvider");
  }
  return context;
}