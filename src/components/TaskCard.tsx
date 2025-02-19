import React from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useTaskDetailsModalStore } from "@/store/useTaskDetailsModalStore";
import { Task } from "@/types/Tasks";
import KanbanTaskCard from "./Kanaban/KanbanTaskCard";
import TableTaskCard from "./Table/TableTaskCard";

interface TaskCardProps {
  task: Task;
  index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const { softDeleteTask, getAssignedUser, getSprintNames, moveTask, customColumns } =
    useTaskStore();
  const toggleSelection = useDataViewStore((state) => state.toggleSelection);
  const selectedIds = useDataViewStore((state) => state.selectedIds);
  const dataView = useDataViewStore((state) => state.dataView);
  const { openModal } = useTaskDetailsModalStore();

  if (dataView === "kanban") {
    return (
      <KanbanTaskCard
        task={task}
        index={index}
        selectedIds={selectedIds}
        toggleSelection={toggleSelection}
        moveTask={moveTask}
        getAssignedUser={getAssignedUser}
        getSprintNames={getSprintNames}
        openModal={openModal}
      />
    );
  }

  return (
    <TableTaskCard
      task={task}
      index={index}
      selectedIds={selectedIds}
      toggleSelection={toggleSelection}
      getAssignedUser={getAssignedUser}
      getSprintNames={getSprintNames}
      openModal={openModal}
      customColumns={customColumns}
      softDeleteTask={softDeleteTask}
      moveTask={moveTask}
    />
  );
}
