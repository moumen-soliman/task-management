"use client";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSheetStore } from "@/store/useSheetStore";
import { useTaskStore } from "@/store/useTaskStore";
import CreateTaskForm from "./CreateTaskForm";

export default function SheetPanel() {
  const { isOpen, mode, taskId, closeSheet } = useSheetStore();
  const { tasks } = useTaskStore();

  const task = tasks.find((t) => t.id === taskId);

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent side="right" className="p-6 w-[700px] overflow-scroll max-w-full">
        <SheetTitle>
          {mode === "create" && "Create Task"}
        </SheetTitle>
        {mode === "create" && <CreateTaskForm />}
      </SheetContent>
    </Sheet>
  );
}