"use client";
import React, { useEffect, createContext } from "react";
import { subscribeToTaskUpdates } from "@/utils";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter, useSearchParams } from "next/navigation";
import Kanban from "@/components/Kanaban";
import Table from "./Table";
import DataViewActionsBar from "./DataViewActionsBar";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";

export const TaskActionContext = createContext({ handleAddTaskClick: () => {} });

export default function BoardContainer() {
  const fetchAllData = useTaskStore((state) => state.fetchAllData);
  const searchParams = useSearchParams();
  const { openSheet } = useSheetStore();

  useEffect(() => {
    fetchAllData();
    const unsubscribe = subscribeToTaskUpdates(fetchAllData);
    return () => unsubscribe();
  }, [fetchAllData]);

  useEffect(() => {
    const taskId = searchParams.get("task");
    if (taskId && openSheet) {
      openSheet("edit", Number(taskId));
    }
  }, [searchParams, openSheet]);

  return (
    <div className="p-4">
        <DataViewActionsBar />
        <Table />
        <Kanban />
    </div>
  );
}
