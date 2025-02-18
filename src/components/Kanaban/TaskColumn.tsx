"use client";
import { DndProvider, useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/Tasks";
import { useSheetStore } from "@/store/useSheetStore";
import { Button } from "@/components/ui/button";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTaskStore } from "@/store/useTaskStore";
import { useFilteredTasks } from "@/store/useDataViewStore";

export default function TaskColumn({ priority }: { priority: string }) {
  const openSheet = useSheetStore((state) => state.openSheet);
  const { updateTaskPriority } = useTaskStore();
  const filteredTasks = useFilteredTasks();

  const moveTask = (taskId: number, newPriority: string) => {
    updateTaskPriority(taskId, newPriority);
  };
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; priority: string }) => {
      if (item.priority !== priority) {
        moveTask(item.id, priority);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <ScrollArea
      ref={drop}
      className={`flex-1 p-4 rounded-lg border h-[85vh] min-w-[320px] max-w-xs snap-start ${
        isOver ? "bg-gray-100 dark:bg-gray-800" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2 sticky top-0 bg-background dark:bg-background-darker z-10">
        <h2 className="text-xl capitalize">{priority.replaceAll("_", " ")}</h2>
        <Button onClick={() => openSheet("create", { priority })}>➕ Create Task</Button>
      </div>
      <div className="space-y-2">
        {filteredTasks
          ?.filter((task) => task.priority === priority)
          .map((task) => <TaskCard index={task.id} key={task.id} task={task} />)}
      </div>
    </ScrollArea>
  );
}
