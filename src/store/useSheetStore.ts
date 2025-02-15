import { SheetState } from "@/types/Sheet";
import { create } from "zustand";

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
