"use client";

import { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { useTaskStore } from "@/store/useTaskStore";
import { useFilteredTasks } from "@/store/useDataViewStore";
import TaskColumn from "./TaskColumn";

const Kanban = () => {
  const { updateTaskPriority } = useTaskStore();
  const filteredTasks = useFilteredTasks();

  const moveTask = (taskId: number, newPriority: string) => {
    updateTaskPriority(taskId, newPriority);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 p-4 overflow-x-auto scroll-smooth snap-x snap-mandatory">
        {PRIORITIES_LIST.map((priority) => (
          <TaskColumn
            key={priority}
            priority={priority}
            moveTask={(taskId, priority) => moveTask(taskId, priority)}
            filteredTasks={filteredTasks}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default Kanban;
