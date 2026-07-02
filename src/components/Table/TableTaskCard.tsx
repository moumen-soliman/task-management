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
import StatusHandler from "@/components/StatusHandler";
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
}: TableTaskCardProps) {
  // Inline row editing is currently dormant (its pencil/actions triggers were
  // removed) - the branches below stay for when it returns.
  const [isEditing] = useState(false);
  const [editableTask, setEditableTask] = useState(task);

  const isSelected = selectedIds.includes(task.id);
  const sprintNames = getSprintNames(task.sprints);
  const sprintLabel = sprintNames.join(", ");

  const handleChange = (field: keyof typeof editableTask, value: any) => {
    setEditableTask({ ...editableTask, [field]: value });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isEditing) return;

    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("input")) {
      e.stopPropagation();
      return;
    }

    openModal(task);
  };

  return (
    <div
      role="row"
      key={`${index}-${task.id}`}
      data-selected={isSelected}
      onClick={handleCardClick}
      className="group flex h-11 cursor-pointer items-center gap-3 px-3 text-sm transition-colors hover:bg-muted/60 data-[selected=true]:bg-muted"
    >
      {/* Identifier - swaps to a checkbox on hover or when selected (Linear pattern) */}
      <div className="relative flex w-10 shrink-0 items-center justify-center">
        <span className="text-xs tabular-nums text-muted-foreground transition-opacity group-hover:opacity-0 group-data-[selected=true]:opacity-0">
          #{task.id}
        </span>
        <Checkbox
          className="absolute left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-data-[selected=true]:opacity-100"
          checked={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            toggleSelection(task.id as number);
          }}
        />
      </div>

      {/* Title - the only flexible cell; metadata columns after it stay aligned across rows */}
      {isEditing ? (
        <input
          type="text"
          value={editableTask.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm"
        />
      ) : (
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">{task.title}</span>
      )}

      {/* Priority */}
      <div className="flex w-6 shrink-0 justify-center">
        {isEditing ? (
          <Select onValueChange={(value) => handleChange("priority", value)} value={editableTask.priority}>
            <SelectTrigger className="h-8 w-[120px] text-xs capitalize">
              <SelectValue placeholder={editableTask.priority} />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES_LIST.map((priority) => (
                <SelectItem key={priority} value={priority} className="capitalize">
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <PriorityHandler priority={task.priority} variant="compact" />
        )}
      </div>

      {/* Status / process */}
      <div className="hidden w-28 shrink-0 sm:flex sm:items-center">
        {isEditing ? (
          <Select onValueChange={(value) => handleChange("status", value)} value={editableTask.status}>
            <SelectTrigger className="h-8 w-[140px] text-xs capitalize">
              <SelectValue placeholder={editableTask.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_LIST.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <StatusHandler status={task.status} />
        )}
      </div>

      {/* Custom columns */}
      {customColumns.map((column) => (
        <div key={column.key} className="hidden w-24 shrink-0 text-xs text-muted-foreground lg:block">
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
                className="h-8 w-24 rounded-md border px-2 text-xs"
              />
            )
          ) : column.type === "checkbox" ? (
            <Checkbox checked={task[column.key]} disabled />
          ) : (
            <span className="block max-w-[120px] truncate">{task[column.key]}</span>
          )}
        </div>
      ))}

      {/* Sprint - fixed-width cell (empty when none) so columns line up */}
      <div className="hidden w-28 shrink-0 md:flex md:items-center">
        {sprintLabel && (
          <span className="inline-flex max-w-full items-center truncate rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {sprintLabel}
          </span>
        )}
      </div>

      {/* Assignees - w-14 fits exactly 3 stacked sm circles (24 + 16 + 16px) */}
      <div className="w-14 shrink-0">
        <AssignedUsers
          assignedUserIds={task.assign?.map(Number)}
          getAssignedUser={getAssignedUser(task.assign?.map(Number))}
          size="sm"
          showEmptyText={false}
          max={3}
        />
      </div>

    </div>
  );
}
