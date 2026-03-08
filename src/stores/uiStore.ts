import { create } from "zustand";

interface UIState {
    sidebarOpen: boolean;
    activeToolTab: string | null;
    analysisLoading: boolean;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setActiveToolTab: (tab: string | null) => void;
    setAnalysisLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarOpen: true,
    activeToolTab: null,
    analysisLoading: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setActiveToolTab: (tab) => set({ activeToolTab: tab }),
    setAnalysisLoading: (loading) => set({ analysisLoading: loading }),
}));
