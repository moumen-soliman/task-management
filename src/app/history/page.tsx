"use client";
import { useTaskStore } from "@/store/useTaskStore";
import { ActivityEntry, useActivityStore } from "@/store/useActivityStore";
import { STORAGE_KEY } from "@/constants/tasks";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { History, Plus, Pencil, Trash2, Undo2 } from "lucide-react";
import SidebarReopen from "@/components/SidebarReopen";
import MobileNav from "@/components/MobileNav";

// Solid glyph backgrounds - they sit on top of the timeline and must mask it.
const ACTION_META = {
  created: {
    icon: Plus,
    verb: "created",
    color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
  },
  updated: {
    icon: Pencil,
    verb: "updated",
    color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950",
  },
  deleted: {
    icon: Trash2,
    verb: "deleted",
    color: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-950",
  },
  restored: {
    icon: Undo2,
    verb: "restored",
    color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950",
  },
} as const;

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function HistoryPage() {
  const entries = useActivityStore((s) => s.entries);
  const actionFilter = useActivityStore((s) => s.actionFilter);
  const query = useActivityStore((s) => s.query);
  const logActivity = useActivityStore((s) => s.logActivity);
  const tasks = useTaskStore((s) => s.tasks);
  const setTasks = useTaskStore((s) => s.setTasks);
  const { toast } = useToast();

  const visibleEntries = entries.filter((entry) => {
    if (actionFilter && entry.action !== actionFilter) return false;
    if (query) {
      const haystack = `#${entry.taskId} ${entry.taskTitle} ${entry.detail ?? ""}`.toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const restoreTask = (entry: ActivityEntry) => {
    if (!entry.snapshot) return;
    if (tasks.some((task) => task.id === entry.snapshot!.id)) {
      toast({ title: "Already restored", description: entry.taskTitle });
      return;
    }
    const next = [{ ...entry.snapshot, deleted: false }, ...tasks];
    setTasks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    logActivity({ action: "restored", taskId: entry.taskId, taskTitle: entry.taskTitle });
    toast({ title: "Task restored", description: entry.taskTitle });
  };

  return (
    <div className="p-4 pb-28">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <MobileNav />
          <SidebarReopen />
          <h1 className="text-lg font-semibold">History</h1>
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {visibleEntries.length} {visibleEntries.length === 1 ? "change" : "changes"}
          </span>
        </div>

        {visibleEntries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <History size={18} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {entries.length === 0 ? "No activity yet" : "Nothing matches these filters"}
              </p>
              <p className="text-xs text-muted-foreground">
                {entries.length === 0
                  ? "Changes you make to issues will show up here."
                  : "Try a different action filter or search."}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline - runs behind the action glyphs */}
            <div
              aria-hidden
              className="absolute bottom-4 left-[23px] top-4 w-px bg-border"
            />
            {visibleEntries.map((entry) => {
              const meta = ACTION_META[entry.action];
              const Icon = meta.icon;
              const restorable =
                entry.action === "deleted" &&
                entry.snapshot &&
                !tasks.some((task) => task.id === entry.snapshot!.id);

              return (
                <div key={entry.id} className="group flex items-center gap-3 px-3 py-3 text-sm">
                  {/* Action glyph - solid bg + ring masks the timeline behind it */}
                  <span
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ring-background ${meta.color}`}
                  >
                    <Icon size={13} />
                  </span>

                  {/* Line */}
                  <p className="min-w-0 flex-1 truncate">
                    <span className="font-medium">{entry.user}</span>{" "}
                    <span className="text-muted-foreground">{meta.verb}</span>{" "}
                    <span className="text-xs tabular-nums text-muted-foreground">
                      #{entry.taskId}
                    </span>{" "}
                    <span className="font-medium">{entry.taskTitle}</span>
                    {entry.detail && (
                      <span className="text-muted-foreground"> - {entry.detail}</span>
                    )}
                  </p>

                  {restorable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1.5 rounded-full pl-2 pr-2.5 text-xs transition-opacity focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      onClick={() => restoreTask(entry)}
                    >
                      <Undo2 size={13} /> Restore
                    </Button>
                  )}

                  <span className="shrink-0 whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                    {timeAgo(entry.ts)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
