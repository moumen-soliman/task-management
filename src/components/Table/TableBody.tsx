import TaskRow from "./TaskRow";
import { Task } from "@/types/Tasks";

const TableBody = ({ filteredTasks }: { filteredTasks: Task[] }) => {
  return (
    <tbody>
      {filteredTasks.map((task) => (
        <TaskRow key={`${task.id}`} task={task} index={Number(task.id)} />
      ))}
    </tbody>
  );
};

export default TableBody;
