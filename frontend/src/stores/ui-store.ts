import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RightPanelTab = "metadata" | "related" | "summary" | "notes";

interface UiState {
  sidebarCollapsed: boolean;
  rightSidebarOpen: boolean;
  rightPanelTab: RightPanelTab;
  activeProjectId: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleRightSidebar: () => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setActiveProject: (id: string | null) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      rightSidebarOpen: true,
      rightPanelTab: "metadata",
      activeProjectId: null,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      setActiveProject: (id) => set({ activeProjectId: id }),
    }),
    {
      name: "papermind-ui",
    },
  ),
);
