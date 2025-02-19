import React from "react";
import TaskCard from "../TaskCard";
import { Task } from "@/types/Tasks";

const TaskRow = ({ task, index }: { task: Task; index: number }) => {
  return <TaskCard task={task} index={index} />;
};

export default TaskRow;
