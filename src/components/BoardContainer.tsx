"use client";
import React, { useEffect } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useSearchParams } from "next/navigation";
import Kanban from "@/components/Kanaban";
import Table from "./Table";
import DataViewActionsBar from "./DataViewActionsBar";
import { useDataViewStore } from "@/store/useDataViewStore";
import SelectedActionsAlert from "./SelectedActionsAlert";
import TaskDetailsModal from "./TaskDetailsModal";
import { FilteredTasksProvider } from "@/providers/FilteredTasksProvider";
import SkeletonTable from "./Table/SkeletonTable";
import { taskService } from "@/services/taskService";

export default function BoardContainer() {
  const { openSheet } = useSheetStore();
  const { setTasks, setUsers, setSprints, setCustomColumns, setLoading } = useTaskStore();
  const searchParams = useSearchParams();
  const dataView = useDataViewStore((state) => state.dataView);
  const loading = useTaskStore((state) => state.loading);

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
    <div className="p-4">
      <FilteredTasksProvider />
      <DataViewActionsBar />
      {loading ? <SkeletonTable /> : dataView?.includes("table") ? <Table /> : <Kanban />}
      <SelectedActionsAlert />
      <TaskDetailsModal />
    </div>
  );
}
