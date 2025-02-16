import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataViewStore, useFilteredTasks } from "@/store/useDataViewStore";

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

  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection(); // ✅ Unselect all
    } else {
      selectAll(filteredTasks.map((task) => task.id)); // ✅ Select only visible tasks
    }
  };

  return (
    <thead>
      <tr>
        <th className="py-2 border-b-2 border-gray-300 text-left  pl-2">
          <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
        </th>
        {taskColumns.map((column) => (
          <th key={column.key} className="py-2 px-4 border-b-2 border-gray-300 text-left">
            {column.label}
          </th>
        ))}
        <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
