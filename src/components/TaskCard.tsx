import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "@/store/useTaskStore";
import AssignedUsers from "./AssignedUsers";
import { useDataViewStore } from "@/store/useDataViewStore";
import PriorityHandler from "./PriorityHandler";
import InfoLabel from "./InfoLabel";
import { Checkbox } from "@/components/ui/checkbox";
import TableActions from "@/components/Table/TableActions";
import { Input } from "./ui/input";
import { useTaskDetailsModalStore } from "@/store/useTaskDetailsModalStore";
import { Task } from "@/types/Tasks"; // Assuming you have a Task type defined in your types file

interface TaskCardProps {
  task: Task;
  index: number;
}

export default function TaskCard({ task, index }: TaskCardProps) {
  const { softDeleteTask, getAssignedUser, getSprintNames, moveTask, customColumns } =
    useTaskStore();
  const toggleSelection = useDataViewStore((state) => state.toggleSelection);
  const selectedIds = useDataViewStore((state) => state.selectedIds);
  const ref = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);

  // Add this function to ensure we have default values
  const startEditing = () => {
    setEditableTask({
      ...task,
      title: task.title || "",
      status: task.status || STATUS_LIST[0],
      priority: task.priority || PRIORITIES_LIST[0],
      // Ensure custom column values have defaults
      ...Object.fromEntries(
        customColumns.map((column) => [
          column.key,
          task[column.key] ?? (column.type === "checkbox" ? false : ""),
        ])
      ),
    });
    setIsEditing(true);
  };

  const dataView = useDataViewStore((state) => state.dataView);
  const { openModal } = useTaskDetailsModalStore();

  const [{ isDragging }, drag] =
    dataView === "kanban"
      ? useDrag({
          type: "TASK",
          item: { id: task.id, index, priority: task.priority },
          collect: (monitor) => ({
            isDragging: monitor.isDragging(),
          }),
          canDrag: dataView === "kanban",
        })
      : [{ isDragging: false }, () => {}]; // Default values to avoid errors

  const [{ isOver }, drop] =
    dataView === "kanban"
      ? useDrop({
          accept: "TASK",
          canDrop: () => dataView === "kanban", // Only allow dropping in Kanban view
          hover(item: { id: number; index: number; priority: string }) {
            if (item.id !== task.id && item.priority === task.priority) {
              // Reorder tasks within the same column
              moveTask(item.id, item.priority, index);
              item.index = index; // Update the dragged item's index
            }
          },
          drop(item: { id: number; priority: string }) {
            if (item.priority !== task.priority) {
              // Move task to a different column
              moveTask(item.id, task.priority, index);
            }
          },
          collect: (monitor) => ({
            isOver: monitor.isOver(),
          }),
        })
      : [{} as any, () => {}]; // Default values to avoid errors// Default values to avoid

  useEffect(() => {
    if (ref.current && dataView === "kanban") {
      drag(drop(ref.current));
    }
  }, [drag, drop, dataView]);

  const handleChange = (field: keyof typeof editableTask, value: any) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isEditing) return;

    // Check if the clicked element is an interactive element
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      e.stopPropagation(); // Prevent modal from opening
      return;
    }

    openModal(task);
  };
  if (dataView === "kanban") {
    return (
      <div
        ref={ref}
        data-task-id={task.id} // Add data attribute for task ID
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
                onCheckedChange={() => toggleSelection(task.id)}
              />
              <CardTitle className="font-semibold">{task.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm text-gray-600">
              <AssignedUsers getAssignedUser={getAssignedUser(task.assign?.map(Number))} />
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

  return (
    <tr
      key={`${index}-${task.id}`}
      onClick={handleCardClick}
      className={`cursor-pointer border-b h-12 table-fixed w-full hover:bg-gray-200 dark:hover:bg-gray-800 
        ${selectedIds.includes(task.id as number) ? "bg-gray-100 dark:bg-gray-800" : ""}`}
    >
      <td className="py-2 pl-2">
        <Checkbox
          checked={selectedIds.includes(task.id as number)}
          onClick={() => toggleSelection(task.id as number)}
        />
      </td>
      <td className="w-[420px] truncate whitespace-wrap overflow-hidden">
        {isEditing ? (
          <input
            type="text"
            value={editableTask.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        ) : (
          task.title
        )}
      </td>
      <td className="py-2 px-2">
        {isEditing ? (
          <Select
            onValueChange={(value) => handleChange("status", value)}
            value={editableTask.status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={editableTask.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <InfoLabel name={task.status} />
        )}
      </td>
      <td className="py-2 px-2">
        {isEditing ? (
          <Select
            onValueChange={(value) => handleChange("priority", value)}
            value={editableTask.priority}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={editableTask.priority} />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES_LIST.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <PriorityHandler priority={task.priority} />
        )}
      </td>
      <td className="py-2 px-4">
        <AssignedUsers
          assignedUserIds={task.assign?.map(Number)}
          getAssignedUser={getAssignedUser(task.assign?.map(Number))}
        />
      </td>
      <td className="py-2 px-4">
        <InfoLabel name={getSprintNames(task.sprints).join(", ") || "None"} />
      </td>
      {customColumns.map((column) => (
        <td key={column.key} className="py-2 px-4">
          {isEditing ? (
            column.type === "checkbox" ? (
              <Checkbox
                checked={!!editableTask[column.key]}
                onCheckedChange={(checked) => handleChange(column.key, checked)}
              />
            ) : (
              <Input
                type={column.type}
                value={editableTask[column.key] || ""}
                onChange={(e) => handleChange(column.key, e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            )
          ) : column.type === "checkbox" ? (
            <Checkbox checked={task[column.key]} disabled />
          ) : (
            task[column.key]
          )}
        </td>
      ))}
      <td className="py-2 px-4">
        <TableActions
          task={task}
          isEditing={isEditing}
          setIsEditing={(editing) => {
            if (editing) {
              startEditing();
            } else {
              setIsEditing(false);
            }
          }}
          softDeleteTask={softDeleteTask}
          editableTask={editableTask}
        />
      </td>
    </tr>
  );
}
