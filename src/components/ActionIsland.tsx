"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Table,
  Kanban,
  Plus,
  X,
  ChevronDown,
  Search,
  Undo2,
  Redo2,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeDelete } from "@/components/ui/native-delete";
import { Input } from "@/components/ui/input";
import PriorityHandler from "./PriorityHandler";
import StatusHandler from "./StatusHandler";
import CustomColumnForm from "./CustomColumnForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { ActivityAction, useActivityStore } from "@/store/useActivityStore";
import { useToast } from "@/hooks/use-toast";
import { Priorities, Status } from "@/types/Tasks";

type IslandView = "idle" | "selection" | "history";

const HISTORY_ACTION_OPTIONS: { value: ActivityAction | ""; label: string }[] = [
  { value: "", label: "All activity" },
  { value: "created", label: "Created" },
  { value: "updated", label: "Updated" },
  { value: "deleted", label: "Deleted" },
  { value: "restored", label: "Restored" },
];

/**
 * Dynamic Island-style morph (per the animations.dev technique): the island
 * `layout`-morphs its width, the entering view scales/blurs in, and a duplicated
 * copy of the previous view crossfades out in an absolute overlay. Exit scale is
 * hardcoded per transition: exiting items scale TOWARD the next view's size
 * (shrinking island → scale down + tuck in; growing island → scale up).
 * Search is NOT a top-level view: it swaps in place of the filter cluster
 * inside the idle view, so the rest of the island keeps its context.
 */
const ANIMATION_VARIANTS: Record<string, { scale: number; scaleX?: number; bounce: number }> = {
  "idle-selection": { scale: 0.9, scaleX: 0.9, bounce: 0.3 },
  "selection-idle": { scale: 1.1, bounce: 0.3 },
  // history view is narrower than both issues views - exits scale toward it
  "idle-history": { scale: 0.9, scaleX: 0.9, bounce: 0.3 },
  "history-idle": { scale: 1.1, bounce: 0.3 },
  "selection-history": { scale: 0.9, scaleX: 0.9, bounce: 0.3 },
  "history-selection": { scale: 1.1, bounce: 0.3 },
};

const exitVariants = {
  exit: (custom: { scale: number; scaleX?: number }) => ({
    opacity: [1, 0],
    // starts ALREADY blurred - the exiting copy must never render a sharp frame
    filter: ["blur(4px)", "blur(8px)"],
    scale: custom?.scale ?? 0.9,
    ...(custom?.scaleX ? { scaleX: custom.scaleX } : {}),
  }),
};

interface PendingChanges {
  status?: Status;
  priority?: Priorities;
}

export default function ActionIsland() {
  const selectedIds = useDataViewStore((s) => s.selectedIds);
  const clearSelection = useDataViewStore((s) => s.clearSelection);
  const updateSelectedTasks = useDataViewStore((s) => s.updateSelectedTasks);
  const dataView = useDataViewStore((s) => s.dataView);
  const setDataView = useDataViewStore((s) => s.setDataView);
  const setFilter = useDataViewStore((s) => s.setFilter);
  const filters: { [key: string]: any } = useDataViewStore((s) => s.filters);
  const setSortColumn = useDataViewStore((s) => s.setSortColumn);
  const setSortDirection = useDataViewStore((s) => s.setSortDirection);
  const sortDirection = useDataViewStore((s) => s.sortDirection);
  const softDeleteTask = useTaskStore((s) => s.softDeleteTask);
  const undo = useTaskStore((s) => s.undo);
  const redo = useTaskStore((s) => s.redo);
  const openSheet = useSheetStore((s) => s.openSheet);
  const resetSheet = useSheetStore((s) => s.resetSheet);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  // History-view filters
  const actionFilter = useActivityStore((s) => s.actionFilter);
  const setActionFilter = useActivityStore((s) => s.setActionFilter);
  const query = useActivityStore((s) => s.query);
  const setQuery = useActivityStore((s) => s.setQuery);
  const clearActivity = useActivityStore((s) => s.clearActivity);
  const entriesCount = useActivityStore((s) => s.entries.length);

  const [searching, setSearching] = useState(false);
  const [pending, setPending] = useState<PendingChanges>({});

  const visible = pathname === "/" || pathname === "/history";
  const view: IslandView =
    pathname === "/history" ? "history" : selectedIds.length > 0 ? "selection" : "idle";
  const prevView = useRef<IslandView>(view);
  const [variantKey, setVariantKey] = useState("idle-selection");

  if (prevView.current !== view) {
    setVariantKey(`${prevView.current}-${view}`);
    prevView.current = view;
  }

  // Each view owns its own search - close it when the island morphs away.
  useEffect(() => {
    setSearching(false);
  }, [view]);

  const hasPending = pending.status !== undefined || pending.priority !== undefined;

  const handleNewTask = () => {
    resetSheet();
    openSheet("create");
  };

  const closeSearch = () => {
    setSearching(false);
    setFilter({ title: "" });
  };

  const handleSort = (direction: "asc" | "desc" | null) => {
    if (!direction) {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortColumn("title");
      setSortDirection(direction);
    }
  };

  const handleClearSelection = () => {
    clearSelection();
    setPending({});
  };

  const handleSave = () => {
    const count = selectedIds.length;
    updateSelectedTasks(pending);
    setPending({});
    toast({
      title: `${count} task${count > 1 ? "s" : ""} updated`,
      description: [
        pending.status && `status → ${pending.status.replaceAll("_", " ")}`,
        pending.priority && `priority → ${pending.priority}`,
      ]
        .filter(Boolean)
        .join(", "),
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.length;
    selectedIds.forEach((id) => softDeleteTask(id));
    handleClearSelection();
    toast({ title: `${count} task${count > 1 ? "s" : ""} deleted` });
  };

  // Optical alignment: the trailing chevron has built-in whitespace, so its side
  // gets 2px less padding than the text side (icon side = text side − 2px).
  const pickerButton = (label: string, staged = false) => (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 gap-1 rounded-full pl-2.5 pr-2 text-xs font-normal ${
        staged
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className="capitalize">{label}</span>
      <ChevronDown className="h-3 w-3 opacity-60" />
    </Button>
  );

  // Priority/status trigger: the glyph shows always; the word + chevron only from
  // sm up, so on phones (≤360px) these collapse to compact icon-only buttons.
  const metaPicker = (icon: React.ReactNode, label: string, staged = false) => (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 gap-1.5 rounded-full px-2 text-xs font-normal sm:pl-2.5 sm:pr-2 ${
        staged
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="hidden capitalize sm:inline">{label}</span>
      <ChevronDown className="hidden h-3 w-3 opacity-60 sm:block" />
    </Button>
  );

  const iconButton = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void,
    active = false
  ) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full outline-none transition-[transform,background-color,color] duration-200 ease-out focus-visible:scale-110 focus-visible:bg-muted active:scale-95 ${
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
    </button>
  );

  const separator = <div className="h-4 w-px shrink-0 bg-border" />;

  // Contextual swap values from make-interfaces-feel-better: opacity + scale + blur, spring bounce 0
  const swapMotion = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.9, filter: "blur(4px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: "blur(4px)" },
    transition: { type: "spring" as const, bounce: 0, duration: 0.35 },
  };

  const filtersCluster = (
    <motion.div key="filters" layout {...swapMotion} className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {metaPicker(
            <PriorityHandler
              priority={(filters.priority || "none") as Priorities}
              variant="compact"
            />,
            filters.priority || "Priority",
            !!filters.priority
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="min-w-[130px]">
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            onClick={() => setFilter({ priority: "" })}
          >
            All priorities
          </DropdownMenuItem>
          {PRIORITIES_LIST.map((priority) => (
            <DropdownMenuItem
              key={priority}
              className="cursor-pointer capitalize"
              onClick={() => setFilter({ priority })}
            >
              {priority}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {metaPicker(
            <StatusHandler
              status={(filters.status || "not_started") as Status}
              showLabel={false}
            />,
            filters.status ? filters.status.replaceAll("_", " ") : "Status",
            !!filters.status
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="min-w-[130px]">
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            onClick={() => setFilter({ status: "" })}
          >
            All statuses
          </DropdownMenuItem>
          {STATUS_LIST.map((status) => (
            <DropdownMenuItem
              key={status}
              className="cursor-pointer capitalize"
              onClick={() => setFilter({ status })}
            >
              {status.replaceAll("_", " ")}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="Sort"
            aria-label="Sort"
            className={`flex h-8 w-8 items-center justify-center rounded-full outline-none transition-[transform,background-color,color] duration-200 ease-out focus-visible:scale-110 focus-visible:bg-muted active:scale-95 ${
              sortDirection ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowUpDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="min-w-[130px]">
          <DropdownMenuItem
            className="cursor-pointer text-muted-foreground"
            onClick={() => handleSort(null)}
          >
            Default
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort("asc")}>
            Title A → Z
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSort("desc")}>
            Title Z → A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {iconButton(<Search size={15} />, "Search tasks", () => setSearching(true))}
    </motion.div>
  );

  const searchCluster = (
    <motion.div key="search" layout {...swapMotion} className="flex items-center gap-1">
      <Search size={15} className="ml-1.5 shrink-0 text-muted-foreground" />
      <Input
        autoFocus
        type="text"
        placeholder="Search tasks…"
        value={filters.title || ""}
        onChange={(e) => setFilter({ title: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSearch();
        }}
        className="h-8 w-52 border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      {iconButton(<X size={15} />, "Close search", closeSearch)}
    </motion.div>
  );

  const idleContent = (
    <div className="flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* View switcher */}
      <motion.div layout className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {iconButton(<Table size={15} />, "List view", () => setDataView("table"), dataView === "table")}
          {iconButton(<Kanban size={15} />, "Board view", () => setDataView("kanban"), dataView === "kanban")}
        </div>
        {separator}
      </motion.div>

      {/* Filters ⇄ search swap in place - the rest of the island keeps its context */}
      <AnimatePresence mode="popLayout" initial={false}>
        {searching ? searchCluster : filtersCluster}
      </AnimatePresence>

      <motion.div layout className="flex items-center gap-1">
        {/* Secondary controls — hidden on phones to keep the island in one hand */}
        <div className="hidden items-center gap-1 sm:flex">
          {separator}

          {/* Undo / redo */}
          {iconButton(<Undo2 size={15} />, "Undo", undo)}
          {iconButton(<Redo2 size={15} />, "Redo", redo)}
        </div>

        <Button
          onClick={handleNewTask}
          size="sm"
          aria-label="New task"
          className="h-8 gap-1 rounded-full px-2 text-xs transition-transform active:scale-[0.96] sm:pl-2.5 sm:pr-3"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">New task</span>
        </Button>
      </motion.div>
    </div>
  );

  const selectionContent = (
    <div className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-1 pl-1">
        <span className="whitespace-nowrap text-xs font-medium tabular-nums">
          {selectedIds.length} selected
        </span>
        {iconButton(<X size={13} />, "Clear selection", handleClearSelection)}
      </div>

      {separator}

      {/* Staged bulk pickers - nothing applies until Save */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {metaPicker(
            <StatusHandler status={pending.status ?? "not_started"} showLabel={false} />,
            pending.status ? pending.status.replaceAll("_", " ") : "Status",
            pending.status !== undefined
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="min-w-[130px]">
          {STATUS_LIST.map((status) => (
            <DropdownMenuItem
              key={status}
              className="cursor-pointer capitalize"
              onClick={() => setPending((p) => ({ ...p, status }))}
            >
              {status.replaceAll("_", " ")}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {metaPicker(
            <PriorityHandler priority={pending.priority ?? "none"} variant="compact" />,
            pending.priority ?? "Priority",
            pending.priority !== undefined
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="min-w-[130px]">
          {PRIORITIES_LIST.map((priority) => (
            <DropdownMenuItem
              key={priority}
              className="cursor-pointer capitalize"
              onClick={() => setPending((p) => ({ ...p, priority }))}
            >
              {priority}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save appears only once something is staged */}
      <AnimatePresence mode="popLayout" initial={false}>
        {hasPending && (
          <motion.div
            key="save"
            layout
            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            <Button
              onClick={handleSave}
              size="sm"
              className="h-8 gap-1 rounded-full pl-2.5 pr-3 text-xs transition-transform active:scale-[0.96]"
            >
              <Check size={14} /> Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {separator}

      <NativeDelete size="sm" onDelete={handleBulkDelete} className="[&_button]:rounded-full" />
    </div>
  );

  const historyActiveLabel =
    HISTORY_ACTION_OPTIONS.find((option) => option.value === actionFilter)?.label ??
    "All activity";

  const historyContent = (
    <div className="flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* Filters ⇄ search swap - same in-place pattern as the issues view */}
      <AnimatePresence mode="popLayout" initial={false}>
        {searching ? (
          <motion.div key="history-search" layout {...swapMotion} className="flex items-center gap-1">
            <Search size={15} className="ml-1.5 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              type="text"
              placeholder="Search activity…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSearching(false);
                  setQuery("");
                }
              }}
              className="h-8 w-52 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            {iconButton(<X size={15} />, "Close search", () => {
              setSearching(false);
              setQuery("");
            })}
          </motion.div>
        ) : (
          <motion.div key="history-filters" layout {...swapMotion} className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {pickerButton(historyActiveLabel, actionFilter !== "")}
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="center" className="min-w-[140px]">
                {HISTORY_ACTION_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value || "all"}
                    className="cursor-pointer"
                    onClick={() => setActionFilter(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {iconButton(<Search size={15} />, "Search activity", () => setSearching(true))}
          </motion.div>
        )}
      </AnimatePresence>

      {entriesCount > 0 && (
        <>
          <NativeDelete
            size="sm"
            buttonText="Clear"
            onDelete={clearActivity}
            className="[&_button]:rounded-full"
          />
        </>
      )}
    </div>
  );

  const content =
    view === "history" ? historyContent : view === "selection" ? selectionContent : idleContent;
  const exitTransition = ANIMATION_VARIANTS[variantKey] ?? ANIMATION_VARIANTS["selection-idle"];
  const bounce = shouldReduceMotion ? 0 : (ANIMATION_VARIANTS[variantKey]?.bounce ?? 0.3);

  return (
    <AnimatePresence initial={false}>
      {visible && (
    <motion.div
      key="island-root"
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
    >
      {/* Progressive blur under the island - from the sidebar's edge to the end
          of the screen, fading out upward so content melts into the nav area */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 h-28 backdrop-blur-md [mask-image:linear-gradient(to_top,black_25%,transparent)] md:left-[var(--sidebar-w,14rem)]"
      />
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 md:left-[calc(50%+var(--sidebar-w,14rem)/2)]">
      <motion.div
        layout={!shouldReduceMotion}
        transition={{ type: "spring", bounce, duration: 0.5 }}
        style={{ borderRadius: 999 }}
        className="mx-auto w-fit max-w-[calc(100vw-0.75rem)] overflow-hidden border border-border bg-card/95 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-card/80 md:max-w-[calc(100vw-var(--sidebar-w,14rem)-1rem)]"
      >
        {/* Active view - enter animation only */}
        <motion.div
          key={view}
          transition={{ type: "spring", bounce, duration: 0.5 }}
          initial={
            shouldReduceMotion
              ? false
              : { scale: 0.9, opacity: 0, filter: "blur(5px)", originX: 0.5, originY: 0.5 }
          }
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            originX: 0.5,
            originY: 0.5,
            transition: { delay: 0.05, type: "spring", bounce, duration: 0.5 },
          }}
        >
          {content}
        </motion.div>
      </motion.div>

      {/* Duplicated previous view - visible only while exiting (crossfade).
          Anchored to the bottom so both the pill and the tall details panel
          exit from the same origin the island grows from. */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center">
          <AnimatePresence mode="popLayout" custom={exitTransition}>
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              exit="exit"
              variants={exitVariants}
              // exits resolve faster and without bounce - softer than the enter
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="origin-bottom"
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      </div>
    </motion.div>
      )}
    </AnimatePresence>
  );
}
