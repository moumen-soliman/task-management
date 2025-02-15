import React, { useEffect, useState } from "react";
import TaskRow from "./TaskRow";
import { useTaskStore } from "@/store/useTaskStore";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";

const TableBody = () => {
  const { visibleCount } = useDataViewStore();
  const filteredTasks = useFilteredTasks();

  return (
    <tbody>
      {filteredTasks.slice(0, visibleCount).map((task, index) => (
        <TaskRow
          key={`${task.id}-${index}`}
          task={task}
          index={index}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
