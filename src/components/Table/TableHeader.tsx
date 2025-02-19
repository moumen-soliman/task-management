import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Settings, SortAscIcon, SortDescIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { TASK_COLUMNS } from "@/constants/tasks";

export default function TableHeader() {
  const {
    selectedIds,
    selectAll,
    clearSelection,
    sortColumn,
    sortDirection,
    setSortColumnAndDirection,
  } = useDataViewStore();
  const filteredTasks = useFilteredTasks();
  const isAllSelected = filteredTasks.length > 0 && selectedIds.length === filteredTasks.length;
  const { customColumns, removeCustomColumn, updateCustomColumnFilter } = useTaskStore();

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAll(filteredTasks.map((task) => Number(task.id)));
    }
  };

  const handleFilterChange = ({columnKey, checked} : 
    {columnKey: string, checked: boolean}
  ) => {
    updateCustomColumnFilter(columnKey, checked);
  };

  const handleSort = (columnKey: string) => {
    if (columnKey !== "assign" && columnKey !== "sprint") {
      setSortColumnAndDirection(columnKey);
    }
  };

  return (
    <thead className="border bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
      <tr className="h-12">
        <th className="w-12 border-b-2 border-gray-300 dark:border-gray-800 text-left pl-2">
          <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
        </th>
        {TASK_COLUMNS.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-2 border-b-2 border-gray-300 dark:border-gray-800 text-left truncate ${
              column.key !== "assign" && column.key !== "sprint" ? "cursor-pointer" : ""
            }`}
            onClick={() => handleSort(column.key)}
          >
            <div className="flex items-center gap-2">
              {column.label}
              { column.key !== "assign" && column.key !== "sprint" ? sortColumn === column.key ? sortDirection === "asc" ? <SortAscIcon /> : <SortDescIcon /> : <SortAscIcon className="opacity-20" /> : null }
            </div>
          </th>
        ))}
        {customColumns.map((column, index) => (
          <th
            key={`${column.key}-${index}`}
            className="px-4 py-2 border-b-2 border-gray-300 dark:border-gray-800 text-left truncate"
          >
            {column.label}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Settings className="h-4 w-4 inline-block ml-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                  <label htmlFor={`filter-${column.key}`}>Add to Filter</label>
                  <Checkbox
                    id={`filter-${column.key}`}
                    className="mr-2"
                    checked={column.filter || false}
                    onCheckedChange={(checked) => handleFilterChange({ columnKey: column.key, checked: checked as boolean })}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="cursor-pointer">
                  <ConfirmDeleteDialog onDelete={() => removeCustomColumn(column.key)} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </th>
        ))}
        <th className="w-24 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-800 text-left">
          Actions
        </th>
      </tr>
    </thead>
  );
}
