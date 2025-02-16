import React from "react";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter } from "next/navigation";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kanban, Table } from "lucide-react";
import DropdownFilter from "./DropdownFilter";
import CustomColumnForm from "./CustomColumnForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  const handleSortChange = (column: keyof Task, direction: "asc" | "desc" | null) => {
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
    <div className="md:flex flex-wrap items-center justify-between gap-4 py-5 space-x-5">
      <div>
        <Button onClick={handleAddTaskClick}>➕ Create Task</Button>
      </div>

      <div className="">
        <Input
          type="text"
          placeholder="Search by title"
          onChange={(e) => setFilter({ title: e.target.value })}
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
        onChange={(value) => handleSortChange("title", value as "asc" | "desc" | null)}
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
    </div>
  );
};

export default DataViewActionsBar;
