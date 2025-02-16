import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";
import { useTaskStore } from "@/store/useTaskStore";

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
  const { customColumns, removeCustomColumn } = useTaskStore();

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection(); // ✅ Unselect all
    } else {
      selectAll(filteredTasks.map((task) => task.id)); // ✅ Select only visible tasks
    }
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
            <button onClick={() => removeCustomColumn(column.key)}>🗑️</button>
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
