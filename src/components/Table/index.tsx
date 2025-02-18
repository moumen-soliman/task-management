"use client";

import React from "react";
import { useTaskStore } from "@/store/useTaskStore";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import InfiniteScrollHandler from "../InfiniteScrollHandler";
import { ScrollArea } from "../ui/scroll-area";

export default function Table(){
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <DndProvider backend={HTML5Backend}>
      <ScrollArea className="max-h-[80vh] w-full overflow-y-auto overflow-x-auto rounded-lg border snap-start">
        <div className="w-full overflow-scroll">
          <InfiniteScrollHandler indicator={tasks}>
            <table className="min-w-full table-fixed border-collapse border border-gray-300 dark:border-gray-800">
              <TableHeader />
              <TableBody />
            </table>
          </InfiniteScrollHandler>
        </div>
      </ScrollArea>
    </DndProvider>
  );
};