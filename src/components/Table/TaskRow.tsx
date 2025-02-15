import React from "react";
import TaskCard from "../TaskCard";

const TaskRow = ({ task, index }) => {
  return <TaskCard task={task} index={index} />;
};

export default TaskRow;
