import { useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";

const TaskColumn = ({
  status,
  moveTask,
  filteredTasks,
}: {
  status: string;
  moveTask: (taskId: number, newStatus: string) => void;
  filteredTasks: any[];
}) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: number; status: string }) => {
      moveTask(item.id, status);
    },
  });

  return (
    <ScrollArea ref={drop} key={status} className="flex-1 p-4 rounded-lg border h-[80vh]">
      <h2 className="text-xl font-bold mb-4 capitalize">{status.replaceAll("_", " ")}</h2>
      <div className="space-y-2">
        {filteredTasks
          ?.filter((task) => task.status === status)
          .map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </ScrollArea>
  );
};

export default TaskColumn;
