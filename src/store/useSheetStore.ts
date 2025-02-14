import { create } from "zustand";

export type SheetMode = "view" | "edit" | "create" | null;

interface SheetState {
  isOpen: boolean;
  mode: SheetMode;
  taskId: string | number | null;
  openSheet: (mode: SheetMode, taskId?: number) => void;
  closeSheet: () => void;
  resetSheet: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  mode: null,
  taskId: null,
  
  openSheet: (mode, taskId = null) => set({ isOpen: true, mode, taskId }),
  closeSheet: () => {  
    window.history.replaceState(null, "", window.location.pathname); // Clears query
    set({ isOpen: false, mode: null, taskId: null });
  },
  resetSheet: () => set({ isOpen: false, mode: null, taskId: null }),
}));
