import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RightPanelTab = "metadata" | "related" | "summary" | "notes";

interface UiState {
  sidebarCollapsed: boolean;
  rightSidebarOpen: boolean;
  rightPanelTab: RightPanelTab;
  activeProjectId: string | null;
  uploadOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleRightSidebar: () => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setActiveProject: (id: string | null) => void;
  openUpload: () => void;
  setUploadOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      rightSidebarOpen: true,
      rightPanelTab: "metadata",
      activeProjectId: null,
      uploadOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      openUpload: () => set({ uploadOpen: true }),
      setUploadOpen: (open) => set({ uploadOpen: open }),
    }),
    {
      name: "papermind-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        rightSidebarOpen: state.rightSidebarOpen,
        rightPanelTab: state.rightPanelTab,
        activeProjectId: state.activeProjectId,
      }),
    },
  ),
);
