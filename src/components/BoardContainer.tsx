"use client";
import React, { useEffect, createContext, useState } from "react";
import { subscribeToTaskUpdates } from "@/utils";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter, useSearchParams } from "next/navigation";
import Kanban from "@/components/Kanaban";
import Table from "./Table";
import DataViewActionsBar from "./DataViewActionsBar";
import { useDataViewStore } from "@/store/useDataViewStore";

export const TaskActionContext = createContext({ handleAddTaskClick: () => {} });

export default function BoardContainer() {
  const dataView = useDataViewStore((state) => state.dataView);
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
      {dataView?.includes("table") ?  <Table /> :  <Kanban />}
    </div>
  );
}
