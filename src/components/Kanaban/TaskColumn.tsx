import React, { useCallback, useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskCard from "@/components/TaskCard";
import PriorityHandler from "@/components/PriorityHandler";
import { useSheetStore } from "@/store/useSheetStore";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Priorities } from "@/types/Tasks";
import { useFilteredTasksStore } from "@/store/useFilteredTasksStore";
import { cn } from "@/lib/utils";

interface DragItem {
  id: number;
  index: number;
  priority: string;
}

export default function TaskColumn({ priority }: { priority: string }) {
  const openSheet = useSheetStore((state) => state.openSheet);
  const { updateTaskPriority } = useTaskStore();
  const filteredTasks = useFilteredTasksStore((state) => state.filteredTasks);

  // Cards in this column, in their persisted order - the single source of truth
  // for both rendering and the drop-index math so the placeholder lands exactly
  // where the drop will insert.
  const columnTasks = (filteredTasks ?? [])
    .filter((task) => task.priority === priority && !task.deleted)
    .sort((a, b) => (a.index || 0) - (b.index || 0));

  // null = nothing hovering; otherwise the slot the dragged card would land in.
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // Which slot does clientY fall into? (index of the card whose midpoint the
  // cursor is above; length = after the last card). Measured from the live DOM.
  const calculateDropIndex = useCallback(
    (clientY: number) => {
      const columnElement = document.querySelector(`[data-priority="${priority}"]`);
      if (!columnElement) return columnTasks.length;
      const columnTop = columnElement.getBoundingClientRect().top;
      const relativeY = clientY - columnTop;

      for (let i = 0; i < columnTasks.length; i++) {
        const taskElement = document.querySelector(`[data-task-id="${columnTasks[i].id}"]`);
        if (taskElement) {
          const rect = taskElement.getBoundingClientRect();
          const midpoint = rect.top - columnTop + rect.height / 2;
          if (relativeY < midpoint) return i;
        }
      }
      return columnTasks.length;
    },
    [priority, columnTasks]
  );

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    hover: (_item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      // setState bails out when the index is unchanged, so this is cheap even
      // though hover fires on every pointer move.
      if (offset) setDropIndex(calculateDropIndex(offset.y));
    },
    drop: (item: DragItem, monitor) => {
      const offset = monitor.getClientOffset();
      const targetIndex = offset ? calculateDropIndex(offset.y) : columnTasks.length;
      updateTaskPriority(item.id, priority as Priorities, targetIndex);
      setDropIndex(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Drag left the column (or ended) - retract the placeholder.
  useEffect(() => {
    if (!isOver) setDropIndex(null);
  }, [isOver]);

  const placeholder = (
    <div
      aria-hidden
      className="h-16 shrink-0 rounded-lg border border-dashed border-primary/50 bg-primary/[0.06] duration-150 animate-in fade-in-0 zoom-in-95"
    />
  );

  return (
    <div className="group/col flex h-[80vh] w-[300px] shrink-0 snap-start flex-col">
      {/* Header - Linear-style: priority glyph, name, count, hover-reveal add */}
      <div className="mb-2 flex items-center gap-2 px-1">
        <PriorityHandler priority={priority as Priorities} variant="compact" />
        <h2 className="text-sm font-semibold capitalize text-foreground">
          {priority.replaceAll("_", " ")}
        </h2>
        <span className="text-xs tabular-nums text-muted-foreground">{columnTasks.length}</span>
        <button
          type="button"
          onClick={() => openSheet("create", { priority })}
          aria-label={`Add issue to ${priority}`}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 outline-none transition-[opacity,transform,background-color,color] duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:opacity-100 active:scale-95 group-hover/col:opacity-100 max-md:opacity-100"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* List - the sole drop target; transparent lane, cards carry the depth */}
      <ScrollArea
        // @ts-ignore-next-line
        ref={drop}
        data-priority={priority}
        className={cn(
          "min-h-0 flex-1 rounded-xl px-1 transition-colors",
          isOver && "bg-muted/50"
        )}
      >
        <div className="space-y-2 py-1 pb-16">
          {columnTasks.map((task, i) => (
            <React.Fragment key={task.id}>
              {dropIndex === i && placeholder}
              <TaskCard
                index={task.index || 0}
                task={task}
                data-task-id={task.id} // Add data attribute for task ID
              />
            </React.Fragment>
          ))}
          {/* Dropping below the last card */}
          {dropIndex === columnTasks.length && placeholder}

          {/* Empty state - a quiet way to add the first issue to the column */}
          {columnTasks.length === 0 && dropIndex === null && (
            <button
              type="button"
              onClick={() => openSheet("create", { priority })}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/70 py-6 text-xs text-muted-foreground outline-none transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground focus-visible:border-border focus-visible:bg-muted/40"
            >
              <Plus size={14} /> New issue
            </button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
