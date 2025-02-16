import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const taskColumns = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "assign", label: "Assign" },
  { key: "sprint", label: "Sprint" },
];

const TableHeader: React.FC = () => {
  const { selectedIds, selectAll, clearSelection } = useDataViewStore();
  const filteredTasks = useFilteredTasks(); // ✅ Get only visible tasks
  const isAllSelected = filteredTasks.length > 0 && selectedIds.length === filteredTasks.length;
  const { customColumns, removeCustomColumn, updateCustomColumnFilter } = useTaskStore();

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection(); // ✅ Unselect all
    } else {
      selectAll(filteredTasks.map((task) => task.id)); // ✅ Select only visible tasks
    }
  };

  const handleFilterChange = (columnKey, checked) => {
    updateCustomColumnFilter(columnKey, checked);
  };

  return (
    <thead className="border bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
      <tr className="h-12">
        <th className="w-12 border-b-2 border-gray-300 dark:border-gray-800 text-left pl-2">
          <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
        </th>
        {taskColumns.map((column) => (
          <th
            key={column.key}
            className="px-4 py-2 border-b-2 border-gray-300 dark:border-gray-800 text-left truncate"
          >
            {column.label}
          </th>
        ))}
        {customColumns.map((column) => (
          <th
            key={column.key}
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
                    onCheckedChange={(checked) => handleFilterChange(column.key, checked)}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => removeCustomColumn(column.key)}
                >
                  Delete
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
};

export default TableHeader;
