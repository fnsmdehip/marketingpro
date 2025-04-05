import { create } from "zustand";
import { Content } from "@shared/schema";
import { ReactNode } from "react";

interface ContentSchedulerState {
  isOpen: boolean;
  initialContent: Partial<Content>;
  openScheduler: () => void;
  closeScheduler: () => void;
  updateSchedulerContent: (content: Partial<Content>) => void;
}

export const useContentScheduler = create<ContentSchedulerState>((set) => ({
  isOpen: false,
  initialContent: {},
  
  openScheduler: () => set({ isOpen: true }),
  closeScheduler: () => set({ isOpen: false, initialContent: {} }),
  updateSchedulerContent: (content: Partial<Content>) => set((state: ContentSchedulerState) => ({ 
    initialContent: { ...state.initialContent, ...content } 
  })),
}));

// Provider component for use in the app
export function ContentSchedulerProvider({ children }: { children: ReactNode }) {
  // This is a context provider wrapper for the Zustand store
  // It doesn't need to do anything except render its children
  // since Zustand works by direct imports rather than React context
  return <>{children}</>;
}