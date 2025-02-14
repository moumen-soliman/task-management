"use client";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSheetStore } from "@/store/useSheetStore";
import { useTaskStore } from "@/store/useTaskStore";
import CreateTaskForm from "./CreateTaskForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { get } from "http";

export default function SheetPanel() {
  const { isOpen, mode, taskId, closeSheet } = useSheetStore();
  const { getTaskById } = useTaskStore();
  const task = getTaskById(taskId);

  const handleCloseSheet = () => {
    closeSheet();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleCloseSheet}>
      <SheetContent side="right" className="p-6 w-[700px] overflow-scroll max-w-full">
        <SheetTitle>
          {mode === "create" ? "Create Task" : task?.title}
        </SheetTitle>
        <CreateTaskForm mode={mode} taskId={taskId} task={task} />
      </SheetContent>
    </Sheet>
  );
}