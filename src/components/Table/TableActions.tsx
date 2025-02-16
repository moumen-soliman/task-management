import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTaskStore } from "@/store/useTaskStore";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useRouter } from "next/navigation";
import { useSheetStore } from "@/store/useSheetStore";

const TableActions = ({ task, isEditing, setIsEditing, softDeleteTask, editableTask }) => {
  const updateTask = useTaskStore((state) => state.updateTask);
  const openSheet = useSheetStore((state) => state.openSheet);
  const router = useRouter();

  const handleSaveClick = () => {
    updateTask(task.id, editableTask);
    setIsEditing(false);
  };

  const handleTaskClick = (taskId: string) => {
    if (!isEditing && task) {
      openSheet("edit", Number(taskId));
      router.replace(`?task=${taskId}`, undefined);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center">
        {isEditing ? (
          <Button
            onClick={handleSaveClick}
            variant="outline"
            className="text-green-600 hover:bg-green-100 flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" /> Save
          </Button>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleTaskClick(task.id)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => softDeleteTask(task.id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableActions;
