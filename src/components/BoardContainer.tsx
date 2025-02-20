"use client";
import React, { useEffect } from "react";
import { subscribeToTaskUpdates } from "@/utils";
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

export default function BoardContainer() {
  const { openSheet } = useSheetStore();
  const searchParams = useSearchParams();
  const dataView = useDataViewStore((state) => state.dataView);
  const fetchAllData = useTaskStore((state) => state.fetchAllData);
  const loading = useTaskStore((state) => state.loading);

  useEffect(() => {
    fetchAllData();
    const unsubscribe = subscribeToTaskUpdates(fetchAllData);
    return () => unsubscribe();
  }, [fetchAllData]);

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
