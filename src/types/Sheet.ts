export interface SheetState {
  isOpen: boolean;
  mode: "create" | "edit" | null;
  taskId: number | null;
  taskDefaults?: Partial<Task>;

  openSheet: (mode: "create" | "edit", taskOrId?: number | Partial<Task> | null) => void;
  closeSheet: () => void;
  resetSheet: () => void;
}
