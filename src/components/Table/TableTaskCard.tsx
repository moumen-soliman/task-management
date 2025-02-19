import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import AssignedUsers from "@/components/AssignedUsers";
import InfoLabel from "@/components/InfoLabel";
import TableActions from "@/components/Table/TableActions";
import { Input } from "@/components/ui/input";
import { Task } from "@/types/Tasks";
import PriorityHandler from "../PriorityHandler";

interface TableTaskCardProps {
  task: Task;
  index: number;
  selectedIds: Array<string | number>;
  toggleSelection: (id: number) => void;
  getAssignedUser: (ids: number[]) => string[];
  getSprintNames: (ids: number[]) => string[];
  openModal: (task: Task) => void;
  customColumns: any[];
  softDeleteTask: (id: string | number) => void;
  moveTask: (id: number, priority: string, reorder: boolean) => void;
}

export default function TableTaskCard({
  task,
  index,
  selectedIds,
  toggleSelection,
  getAssignedUser,
  getSprintNames,
  openModal,
  customColumns,
  softDeleteTask,
}: TableTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);

  const startEditing = () => {
    setEditableTask({
      ...task,
      title: task.title || "",
      status: task.status || STATUS_LIST[0],
      priority: task.priority || PRIORITIES_LIST[0],
      ...Object.fromEntries(
        customColumns.map((column) => [
          column.key,
          task[column.key] ?? (column.type === "checkbox" ? false : ""),
        ])
      ),
    });
    setIsEditing(true);
  };

  const handleChange = (field: keyof typeof editableTask, value: any) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    if (isEditing) return;

    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      e.stopPropagation();
      return;
    }

    openModal(task);
  };

  return (
    <tr
      key={`${index}-${task.id}`}
      onClick={handleCardClick}
      className={`cursor-pointer border-b h-12 table-fixed w-full hover:bg-gray-200 dark:hover:bg-gray-800 
        ${selectedIds.includes(task.id) ? "bg-gray-100 dark:bg-gray-800" : ""}`}
    >
      <td className="py-2 pl-2">
        <Checkbox
          checked={selectedIds.includes(task.id)}
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
