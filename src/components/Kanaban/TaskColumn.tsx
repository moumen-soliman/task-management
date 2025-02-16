import { useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";
import { Task } from "@/types/Tasks";

const TaskColumn = ({
  priority,
  moveTask,
  filteredTasks,
}: {
  priority: string;
  moveTask: (taskId: number, newPriority: string, isKanban: boolean) => void;
  filteredTasks: Task[];
}) => {
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
    <ScrollArea
      ref={drop}
      className={`flex-1 p-4 rounded-lg border h-[80vh] min-w-[320px] max-w-xs snap-start ${
        isOver ? "bg-gray-100 dark:bg-gray-800" : ""
      }`}
    >
      <h2 className="text-xl font-bold mb-4 capitalize">{priority.replaceAll("_", " ")}</h2>
      <div className="space-y-2">
        {filteredTasks
          ?.filter((task) => task.priority === priority)
          .map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </ScrollArea>
  );
};

export default TaskColumn;
