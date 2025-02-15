"use client";

import { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { STATUS_LIST } from "@/constants/tasks";
import { useTaskStore } from "@/store/useTaskStore";
import { useFilteredTasks } from "@/store/useDataViewStore";
import TaskColumn from "./TaskColumn";

const Kanban = () => {
  const { updateTaskStatus } = useTaskStore();
  const filteredTasks = useFilteredTasks();

  const moveTask = (taskId: number, newStatus: string) => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 p-4">
        {STATUS_LIST.map((status) => (
          <TaskColumn key={status} status={status} moveTask={moveTask} filteredTasks={filteredTasks} />
        ))}
      </div>
    </DndProvider>
  );
};

export default Kanban;
