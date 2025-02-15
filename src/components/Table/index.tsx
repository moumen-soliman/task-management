'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { useInView } from "react-intersection-observer";
import { useSheetStore } from "@/store/useSheetStore";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { subscribeToTaskUpdates } from "@/utils";

const Table: React.FC = () => {
  const {
    tasks,
    fetchAllData,
  } = useTaskStore();

  const [visibleCount, setVisibleCount] = useState(10);
  const { openSheet, resetSheet } = useSheetStore();
  const { ref, inView } = useInView({ threshold: 1 });
  const { updateTask } = useTaskStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchAllData();
    const unsubscribe = subscribeToTaskUpdates(fetchAllData);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const taskId = searchParams.get("task");
    if (taskId && openSheet) {
      openSheet("edit", Number(taskId));
    }
  }, [searchParams]);


  useEffect(() => {
    if (inView && visibleCount < tasks.length) {
      setVisibleCount((prev) => prev + 10);
    }
  }, [inView, tasks.length]);
  const handleAddTaskClick = () => {
    resetSheet();
    openSheet("create");
    router.replace(window.location.pathname, { scroll: false });
  };

  return (
    <div>
      <button
        onClick={handleAddTaskClick}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add Task
      </button>
      <h2 className="text-2xl font-bold">Task Management v1</h2>
        <div>
        <table className="min-w-full">
            <TableHeader />
            <TableBody visibleCount={visibleCount} />
        </table>

        {/* Loader Trigger for Infinite Scrolling */}
        <div ref={ref} className="h-10 mt-4 text-center text-gray-500">
            {visibleCount < tasks.length ? "Loading more tasks..." : "No more tasks"}
        </div>
        </div>
    </div>
  );
};

export default Table;