"use client";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSheetStore } from "@/store/useSheetStore";
import { useTaskStore } from "@/store/useTaskStore";
import TaskForm from "./TaskForm";

export default function SheetPanel() {
  const { isOpen, mode, taskId, closeSheet, resetSheet } = useSheetStore();
  const { getTaskById } = useTaskStore();
  const task = getTaskById(taskId as number);

  const handleCloseSheet = () => {
    closeSheet();
    resetSheet();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleCloseSheet}>
      <SheetContent side="right" className="p-6 w-[700px] overflow-scroll max-w-full">
        <SheetTitle>
          {mode === "create" ? "Create Task" : task?.title}
        </SheetTitle>
        <TaskForm mode={mode as "create" | "edit"} task={task} />
      </SheetContent>
    </Sheet>
  );
}