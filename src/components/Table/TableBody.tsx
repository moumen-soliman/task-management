import TaskRow from "./TaskRow";
import { Task } from "@/types/Tasks";

const TableBody = ({ filteredTasks }: { filteredTasks: Task[] }) => {
  return (
    <tbody>
      {filteredTasks.length ? filteredTasks.map((task) => (
        <TaskRow key={`${task.id}`} task={task} index={Number(task.id)} />
      )) : (
        <tr className="text-center">
            <td colSpan={100} className="py-4 text-gray-500">
              No tasks found
            </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;
