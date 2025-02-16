import { useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/Tasks";
import { useSheetStore } from "@/store/useSheetStore";
import { Button } from "@/components/ui/button";

const TaskColumn = ({
  priority,
  moveTask,
  filteredTasks,
}: {
  priority: string;
  moveTask: (taskId: number, newPriority: string, isKanban: boolean) => void;
  filteredTasks: Task[];
}) => {
  const openSheet = useSheetStore((state) => state.openSheet);
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; priority: string }) => {
      if (item.priority !== priority) {
        moveTask(item.id, priority, true);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div>
      <ScrollArea
        ref={drop}
        className={`flex-1 p-4 rounded-lg border h-[80vh] min-w-[320px] max-w-xs snap-start ${
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
            .map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskColumn;
