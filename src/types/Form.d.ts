export interface CreateTaskFormProps {
  mode: "create" | "edit";
  taskId?: number;
  task: z.infer<typeof taskSchema> | undefined;
}

export interface EditorButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}
