import React, { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AssignedUsers from "@/components/AssignedUsers";
import InfoLabel from "@/components/InfoLabel";
import { Task } from "@/types/Tasks";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  selectedIds: Array<string | number>;
  toggleSelection: (id: number) => void;
  moveTask: (id: number, priority: string, reorder: boolean) => void;
  getAssignedUser: (ids: number[]) => string[];
  getSprintNames: (ids: number[]) => string[];
  openModal: (task: Task) => void;
}

export default function KanbanTaskCard({
  task,
  index,
  selectedIds,
  toggleSelection,
  moveTask,
  getAssignedUser,
  getSprintNames,
  openModal,
}: KanbanTaskCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, priority: task.priority },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    hover(item: { id: number; priority: string }) {
      if (item.id !== task.id && item.priority === task.priority) {
        moveTask(item.id, item.priority, true);
        // @ts-ignore-next-line
        item.index = index;
      }
    },
    drop(item: { id: number; priority: string }) {
      if (item.priority !== task.priority) {
        moveTask(item.id, task.priority, true);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drag(drop(ref.current));
    }
  }, [drag, drop]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      e.stopPropagation();
      return;
    }
    openModal(task);
  };

  return (
    <div
      ref={ref}
      data-task-id={task.id}
      className={`transition-all duration-150 ${isDragging ? "opacity-50" : ""} ${
        isOver ? "border-2 border-dashed border-blue-500" : ""
      }`}
    >
      <Card
        onClick={handleCardClick}
        className={`${selectedIds.includes(task.id) && "border-gray-500 "} ${
          isDragging ? "opacity-50" : ""
        } cursor-pointer hover:border-black`}
      >
        <CardHeader className="flex">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.includes(task.id)}
              onCheckedChange={() => toggleSelection(Number(task.id))}
            />
            <CardTitle className="font-semibold">{task.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600">
            <AssignedUsers
              assignedUserIds={task.assign?.map(Number)}
              getAssignedUser={getAssignedUser(task.assign?.map(Number))}
            />
          </CardDescription>
          <div className="flex gap-2 items-center pt-5">
            <InfoLabel name={`#${task.id}`} />
            {getSprintNames(task.sprints).map((sprint, index) => (
              <InfoLabel name={sprint} key={`${sprint}-${index}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
