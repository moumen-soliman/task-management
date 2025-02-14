import { create } from "zustand";

export type SheetMode = "view" | "edit" | "create" | null;

interface SheetState {
  isOpen: boolean;
  mode: SheetMode;
  taskId: number | null;
  openSheet: (mode: SheetMode, taskId?: number) => void;
  closeSheet: () => void;
}

export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  mode: null,
  taskId: null,
  
  openSheet: (mode, taskId = null) => set({ isOpen: true, mode, taskId }),
  closeSheet: () => set({ isOpen: false, mode: null, taskId: null }),
}));
