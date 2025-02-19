import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { ScrollArea } from "../ui/scroll-area";
import PaginationControls from "../PaginationControls";
import { useFilteredTasksStore } from "@/store/useFilteredTasksStore";

export default function Table() {
  const filteredTasks = useFilteredTasksStore((state) => state.filteredTasks);

  return (
    <div className="relative w-full">
      <ScrollArea className="max-h-[80vh] w-full overflow-y-auto overflow-x-auto rounded-lg border snap-start">
        <div className="w-full overflow-scroll">
          <table
            aria-label="Tasks Tabl "
            className="min-w-full table-fixed border-collapse border border-gray-300 dark:border-gray-800"
          >
            <TableHeader filteredTasks={filteredTasks} />
            <TableBody filteredTasks={filteredTasks} />
          </table>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md border-t z-10">
        <PaginationControls />
      </div>
    </div>
  );
}
