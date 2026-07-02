import TaskRow from "./TaskRow";
import { Task } from "@/types/Tasks";

const TableBody = ({ filteredTasks }: { filteredTasks: Task[] }) => {
  return (
    <div role="rowgroup" className="divide-y divide-border">
      {filteredTasks.length ? (
        filteredTasks.map((task) => (
          <TaskRow key={`${task.id}`} task={task} index={Number(task.id)} />
        ))
      ) : (
        <div className="py-16 text-center text-sm text-muted-foreground">No tasks found</div>
      )}
    </div>
  );
};

export default TableBody;
