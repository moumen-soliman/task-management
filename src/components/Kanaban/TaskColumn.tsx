import { useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";
import { useSheetStore } from "@/store/useSheetStore";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/useTaskStore";
import { Priorities } from "@/types/Tasks";
import { useFilteredTasksStore } from "@/store/useFilteredTasksStore";

export default function TaskColumn({ priority }: { priority: string }) {
  const openSheet = useSheetStore((state) => state.openSheet);
  const { updateTaskPriority } = useTaskStore();
  const filteredTasks = useFilteredTasksStore((state) => state.filteredTasks);

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; priority: string }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      const dropTargetIndex = calculateDropIndex(clientOffset?.y || 0);

      // If the task is dropped in the same column, reorder it
      if (item.priority === priority) {
        updateTaskPriority(item.id, priority as Priorities, dropTargetIndex);
      } else {
        // If the task is dropped in a different column, move it to the new column
        updateTaskPriority(item.id, priority as Priorities, dropTargetIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const calculateDropIndex = (clientY: number) => {
    const tasksInColumn = filteredTasks
      .filter((task) => task.priority === priority && !task.deleted)
      .sort((a, b) => (a.index || 0) - (b.index || 0));

    const columnElement = document.querySelector(`[data-priority="${priority}"]`);
    if (!columnElement) return tasksInColumn.length;

    const columnRect = columnElement.getBoundingClientRect();
    const relativeY = clientY - columnRect.top;

    // Calculate the drop index based on the position of the task cards
    for (let i = 0; i < tasksInColumn.length; i++) {
      const taskElement = document.querySelector(`[data-task-id="${tasksInColumn[i].id}"]`);
      if (taskElement) {
        const taskRect = taskElement.getBoundingClientRect();
        const taskMidpoint = taskRect.top - columnRect.top + taskRect.height / 2;

        if (relativeY < taskMidpoint) {
          return i; // Drop above this task
        }
      }
    }

    // If dropped below all tasks, place at the end
    return tasksInColumn.length;
  };

  return (
    <ScrollArea
      // @ts-ignore-next-line
      ref={drop}
      data-priority={priority}
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
          ?.filter((task) => task.priority === priority && !task.deleted)
          .sort((a, b) => (a.index || 0) - (b.index || 0))
          .map((task) => (
            <TaskCard
              index={task.index || 0}
              key={task.id}
              task={task}
              data-task-id={task.id} // Add data attribute for task ID
            />
          ))}
      </div>
    </ScrollArea>
  );
}
