import React from "react";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter } from "next/navigation";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kanban, Table, X } from "lucide-react";
import DropdownFilter from "./DropdownFilter";
import CustomColumnForm from "./CustomColumnForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTaskStore } from "@/store/useTaskStore";

const DataViewActionsBar: React.FC = () => {
  const setFilter = useDataViewStore((state) => state.setFilter);
  const dataView = useDataViewStore((state) => state.dataView);
  const setDataView = useDataViewStore((state) => state.setDataView);
  const setSortColumn = useDataViewStore((state) => state.setSortColumn);
  const filters = useDataViewStore((state) => state.filters);
  const setSortDirection = useDataViewStore((state) => state.setSortDirection);
  const openSheet = useSheetStore((state) => state.openSheet);
  const resetSheet = useSheetStore((state) => state.resetSheet);
  const router = useRouter();
  const customColumns = useTaskStore((state) => state.customColumns);

  const handleSortChange = (column, direction) => {
    if (!direction) {
      setSortColumn(null);
      setSortDirection(null);
    } else {
      setSortColumn(column);
      setSortDirection(direction);
    }
  };

  const handleAddTaskClick = () => {
    resetSheet();
    openSheet("create");
    router.replace(window.location.pathname, { scroll: false });
  };

  return (
    <div className="md:grid grid-cols-7 flex-wrap items-center justify-between gap-4 py-5">
      <div>
        <Button onClick={handleAddTaskClick}>➕ Create Task</Button>
      </div>

      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search by title"
          value={filters.title || ""}
          onChange={(e) => setFilter({ title: e.target.value })}
        />
        <X
          className="absolute right-2 cursor-pointer"
          size={16}
          onClick={() => setFilter({ title: undefined })}
        />
      </div>

      <DropdownFilter
        label="Priorities"
        options={PRIORITIES_LIST}
        placeholder="All Priorities"
        value={filters.priority}
        onChange={(value) => setFilter({ priority: value })}
      />

      <DropdownFilter
        label="Statuses"
        options={STATUS_LIST}
        placeholder="All Statuses"
        value={filters.status}
        onChange={(value) => setFilter({ status: value })}
      />

      <DropdownFilter
        label="Sort by Title"
        options={["asc", "desc"]}
        placeholder="All"
        value={filters.title}
        onChange={(value) => handleSortChange("title", value)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Custom Field ▼</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-4 w-64">
          <CustomColumnForm />
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex">
        <Button
          variant="ghost"
          onClick={() => setDataView("table")}
          className={`transition-opacity ${dataView === "table" ? "opacity-100" : "opacity-50"}`}
        >
          <Table name="table" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setDataView("kanban")}
          className={`transition-opacity ${dataView === "kanban" ? "opacity-100" : "opacity-50"}`}
        >
          <Kanban name="kanban" />
        </Button>
      </div>

      {customColumns
        .filter((column) => column.filter)
        .map((column) => (
          <div key={`${column.id}-${column.key}`} className="relative flex items-center">
            {column.type === "checkbox" ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters[column.id] || false}
                  onChange={(e) => setFilter({ [column.id]: e.target.checked })}
                />
                <label className="ml-2">{column.label}</label>
                <X
                  className="absolute right-2 cursor-pointer"
                  size={16}
                  onClick={() => setFilter({ [column.id]: "" })}
                />
              </div>
            ) : (
              <Input
                type={column.type}
                placeholder={`Search by ${column.label}`}
                value={filters[column.id] || ""}
                onChange={(e) => setFilter({ [column.id]: e.target.value })}
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default DataViewActionsBar;
