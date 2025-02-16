import React from "react";
import TaskRow from "./TaskRow";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";

const TableBody = () => {
  const { visibleCount } = useDataViewStore();
  const filteredTasks = useFilteredTasks();

  return (
    <tbody>
      {filteredTasks.slice(0, visibleCount).map((task) => (
        <TaskRow key={`${task.id}`} task={task} index={task.id} />
      ))}
    </tbody>
  );
};

export default TableBody;
