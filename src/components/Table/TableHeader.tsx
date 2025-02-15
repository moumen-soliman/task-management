import React from "react";

interface TableHeaderProps {
  columns: {
    key: string;
    label: string;
  }[];
}

// Example columns for task management
const taskColumns = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "assign", label: "Assign" },
  { key: "sprint", label: "Sprint" },
];

const TableHeader: React.FC<TableHeaderProps> = () => {
  return (
    <thead>
      <tr>
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
