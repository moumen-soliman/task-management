import { create } from "zustand";

interface SidebarState {
  width: number;
  collapsed: boolean;
  setWidth: (width: number) => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  width: 224,
  collapsed: false,
  setWidth: (width) => set({ width }),
  setCollapsed: (collapsed) => set({ collapsed }),
}));
