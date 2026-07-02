export interface CreateTaskFormProps {
  mode: "create" | "edit";
  taskId?: number;
  task: z.infer<typeof taskSchema> | undefined;
  /** Overrides the default sheet-close behavior (e.g. when hosted in the ActionIsland). */
  onClose?: () => void;
}

export interface EditorButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}
