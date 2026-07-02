"use client";
import React, { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useSearchParams } from "next/navigation";
import Kanban from "@/components/Kanaban";
import Table from "./Table";
import DataViewActionsBar from "./DataViewActionsBar";
import { useDataViewStore } from "@/store/useDataViewStore";
import SidebarReopen from "./SidebarReopen";
import MobileNav from "./MobileNav";
import StatusHandler from "./StatusHandler";
import { FilteredTasksProvider } from "@/providers/FilteredTasksProvider";
import SkeletonTable from "./Table/SkeletonTable";
import { taskService } from "@/services/taskService";

export default function BoardContainer() {
  const { openSheet } = useSheetStore();
  const { setTasks, setUsers, setSprints, setCustomColumns, setLoading } = useTaskStore();
  const searchParams = useSearchParams();
  const dataView = useDataViewStore((state) => state.dataView);
  const loading = useTaskStore((state) => state.loading);
  const tasks = useTaskStore((state) => state.tasks);

  const liveTasks = tasks.filter((task) => !task.deleted);
  const stats = {
    total: liveTasks.length,
    completed: liveTasks.filter((task) => task.status === "completed").length,
    inProgress: liveTasks.filter((task) => task.status === "in_progress").length,
    notStarted: liveTasks.filter((task) => task.status === "not_started").length,
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [tasks, users, sprints] = await Promise.all([
        taskService.fetchTasks(),
        taskService.fetchUsers(),
        taskService.fetchSprints(),
      ]);
      setTasks(tasks);
      setUsers(users);
      setSprints(sprints);
      setCustomColumns(taskService.fetchCustomColumns());
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const taskId = searchParams.get("task");
    if (taskId) {
      openSheet?.("edit", Number(taskId));
    }
  }, [searchParams, openSheet]);

  return (
    <div>
      <div className="p-4">
      <FilteredTasksProvider />

      {/* Page header - title + live status stats */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <MobileNav />
        <SidebarReopen />
        <h1 className="text-lg font-semibold">Issues</h1>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-xs tabular-nums text-muted-foreground">
          <span>{stats.total} Issues</span>
          <span className="flex items-center gap-1.5">
            <StatusHandler status="in_progress" showLabel={false} />
            {stats.inProgress} <span className="hidden lg:inline">In progress</span>
          </span>
          <span className="flex items-center gap-1.5">
            <StatusHandler status="completed" showLabel={false} />
            {stats.completed} <span className="hidden lg:inline">Completed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <StatusHandler status="not_started" showLabel={false} />
            {stats.notStarted} <span className="hidden lg:inline">Not started</span>
          </span>
        </div>
      </div>

      <DataViewActionsBar />
      </div>
      {loading ? <SkeletonTable /> : dataView?.includes("table") ? <Table />: <Kanban />}
    </div>
  );
}
