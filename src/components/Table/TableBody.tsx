import React, { useEffect, useState } from "react";
import TaskRow from "./TaskRow";
import { useTaskStore } from "@/store/useTaskStore";
import { useInView } from "react-intersection-observer";

const TableBody = ({ visibleCount }) => {
  const {
    tasks,
  } = useTaskStore();

  return (
    <tbody>
      {tasks.slice(0, visibleCount).map((task, index) => (
        <TaskRow
          key={`${task.id}-${index}`}
          task={task}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
