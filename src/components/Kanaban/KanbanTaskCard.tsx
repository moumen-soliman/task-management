import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AssignedUsers from "@/components/AssignedUsers";
import StatusHandler from "@/components/StatusHandler";
import { Task } from "@/types/Tasks";
import { cn } from "@/lib/utils";

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
  getAssignedUser,
  getSprintNames,
  openModal,
}: KanbanTaskCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isSelected = selectedIds.includes(task.id);
  // Once anything is selected we're in "selection mode" - reveal every card's
  // checkbox so adding more doesn't require hovering each one.
  const selectionActive = selectedIds.length > 0;
  const sprintNames = getSprintNames(task.sprints);

  // Cards are drag-only; the column is the sole drop target (it renders the
  // placeholder and commits the insert), so there's no per-card drop here.
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, index, priority: task.priority },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drag(ref.current);
    }
  }, [drag]);

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
      className={`transition-opacity ${isDragging ? "opacity-50" : ""}`}
    >
      <Card
        onClick={handleCardClick}
        data-selected={isSelected}
        className="kanban-card group cursor-pointer rounded-lg border-0 bg-card p-3 active:scale-[0.98] data-[selected=true]:bg-muted/40"
      >
        {/* Title takes the full width - no reserved gutter. */}
        <div className="line-clamp-3 text-sm font-medium leading-snug text-foreground text-pretty">
          {task.title}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {/* Selection swaps in over the #id (same slot, no layout shift) - the
                same pattern as the table view. Revealed on hover; kept visible
                once a selection is active, when selected, or on touch. */}
            <span className="relative inline-flex min-w-4 items-center">
              <span
                className={cn(
                  "text-xs tabular-nums text-muted-foreground transition-opacity",
                  isSelected || selectionActive
                    ? "opacity-0"
                    : "group-hover:opacity-0 max-md:opacity-0"
                )}
              >
                #{task.id}
              </span>
              <Checkbox
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer transition-opacity max-md:h-[18px] max-md:w-[18px]",
                  isSelected || selectionActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 max-md:opacity-100"
                )}
                checked={isSelected}
                aria-label={isSelected ? "Deselect task" : "Select task"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(Number(task.id));
                }}
              />
            </span>
            <StatusHandler status={task.status} showLabel={false} />
            {sprintNames.length > 0 && (
              <span className="max-w-[120px] truncate rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {sprintNames.join(", ")}
              </span>
            )}
          </div>
          <AssignedUsers
            assignedUserIds={task.assign?.map(Number)}
            getAssignedUser={getAssignedUser(task.assign?.map(Number))}
            size="sm"
            showEmptyText={false}
          />
        </div>
      </Card>
    </div>
  );
}
