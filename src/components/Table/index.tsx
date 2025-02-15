'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { subscribeToTaskUpdates } from "@/utils";
import { TaskActionContext } from "../BoardContainer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import InfiniteScrollHandler from "../InfiniteScrollHandler";

const Table: React.FC = () => {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <DndProvider backend={HTML5Backend}>
      <h2 className="text-2xl font-bold">Task Management v1</h2>
      <InfiniteScrollHandler indicator={tasks}>
        <table className="min-w-full">
          <TableHeader />
          <TableBody />
        </table>
      </InfiniteScrollHandler>
    </DndProvider>
  );
};

export default Table;