import { SheetState } from "@/types/Sheet";
import { create } from "zustand";

// This store is used to manage the state of the sheet component
// The sheet component is used to create, edit, or view tasks
export const useSheetStore = create<SheetState>((set) => ({
  isOpen: false,
  mode: null,
  taskId: null,
  taskDefaults: undefined,

  openSheet: (mode, taskOrId = null) => {
    set({
      isOpen: true,
      mode,
      taskId: typeof taskOrId === "number" ? taskOrId : null,
      taskDefaults: typeof taskOrId === "object" ? taskOrId : undefined,
    });
  },

  closeSheet: () => {
    window.history.replaceState(null, "", window.location.pathname);
    set({ isOpen: false, mode: null, taskId: null, taskDefaults: undefined });
  },

  resetSheet: () => set({ isOpen: false, mode: null, taskId: null, taskDefaults: undefined }),
}));
