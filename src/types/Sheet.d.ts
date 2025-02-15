export type SheetMode = "view" | "edit" | "create" | null;

export interface SheetState {
  isOpen: boolean;
  mode: SheetMode;
  taskId: string | number | null;
  openSheet: (mode: SheetMode, taskId?: number) => void;
  closeSheet: () => void;
  resetSheet: () => void;
}
