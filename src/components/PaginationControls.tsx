import React, { useEffect, useState } from "react";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generatePageSizeOptions } from "@/utils";

export default function PaginationControls() {
  const { currentPage, pageSize, setCurrentPage, setPageSize } = useDataViewStore();
  const totalTasks = useTaskStore((state) => state.tasks.length);
  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize));
  const [page, setPage] = useState(currentPage);
  const pageSizeOptions = generatePageSizeOptions(totalTasks);

  useEffect(() => {
    setCurrentPage(page);
  }, [page, setCurrentPage]);

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md border-t flex items-center justify-between p-4 z-10">
      {/* Page Size Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Tasks per page:
        </span>
        <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="w-20 border rounded px-3 py-1 text-sm">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          variant="outline"
          className="p-2 rounded-md text-sm flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Previous
        </Button>

        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page <span className="font-semibold">{page}</span> of {totalPages}
        </span>

        <Button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          variant="outline"
          className="p-2 rounded-md text-sm flex items-center gap-1"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
