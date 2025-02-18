import React, { useEffect, useState } from "react";
import TaskRow from "./TaskRow";
import { useFilteredTasks } from "@/store/useDataViewStore";

const TableBody = () => {
  const filteredTasks = useFilteredTasks();
  return (
    <tbody>
      {filteredTasks.map((task) => (
        <TaskRow key={`${task.id}`} task={task} index={task.id} />
      ))}
    </tbody>
  );
};

export default TableBody;
