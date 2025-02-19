import React from "react";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useSheetStore } from "@/store/useSheetStore";
import { useRouter } from "next/navigation";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, Kanban, Undo2, Redo2, X } from "lucide-react";
import DropdownFilter from "./DropdownFilter";
import CustomColumnForm from "./CustomColumnForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTaskStore } from "@/store/useTaskStore";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Task } from "@/types/Tasks";

export default function DataViewActionsBar() {
  const undo = useTaskStore((state) => state.undo);
  const redo = useTaskStore((state) => state.redo);
  const setFilter = useDataViewStore((state) => state.setFilter);
  const dataView = useDataViewStore((state) => state.dataView);
  const setDataView = useDataViewStore((state) => state.setDataView);
  const setSortColumn = useDataViewStore((state) => state.setSortColumn);
  const filters: { [key: string]: any } = useDataViewStore((state) => state.filters);
  const setSortDirection = useDataViewStore((state) => state.setSortDirection);
  const sortDirection = useDataViewStore((state) => state.sortDirection);
  const openSheet = useSheetStore((state) => state.openSheet);
  const resetSheet = useSheetStore((state) => state.resetSheet);
  const router = useRouter();
  const customColumns = useTaskStore((state) => state.customColumns);

  const handleSortChange = ({column, direction} : {column: keyof Task, direction: "asc" | "desc"}) => {
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
    <Card className="p-4 space-y-4 shadow-md rounded-xl mb-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button onClick={handleAddTaskClick} className="px-4 py-2 font-semibold">
          ➕ Create Task
        </Button>

        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search by title"
            value={filters.title || ""}
            onChange={(e) => setFilter({ title: e.target.value })}
          />
          {filters.title && (
            <X
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              size={16}
              onClick={() => setFilter({ title: undefined })}
            />
          )}
        </div>

        <DropdownFilter placeholder="Select Priority" options={PRIORITIES_LIST} value={filters.priority} onChange={(value) => setFilter({ priority: value })} />
        <DropdownFilter placeholder="Select Status"  options={STATUS_LIST} value={filters.status} onChange={(value) => setFilter({ status: value })} />
        <DropdownFilter placeholder="Sort Direction" options={["asc", "desc"]} value={sortDirection} onChange={(value) => handleSortChange({ column: "title", direction: value as "asc" | "desc" })} />
      </div>
      
      <Separator />

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={undo} title="Undo">
            <Undo2 size={16} className="mr-2" /> Undo
          </Button>
          <Button variant="outline" onClick={redo} title="Redo">
            <Redo2 size={16} className="mr-2" /> Redo
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Custom Field ▼</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4 w-64">
            <CustomColumnForm />
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => setDataView("table")}
            className={`transition-opacity ${dataView === "table" ? "opacity-100" : "opacity-50"}`}
          >
            <Table size={20} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => setDataView("kanban")}
            className={`transition-opacity ${dataView === "kanban" ? "opacity-100" : "opacity-50"}`}
          >
            <Kanban size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {customColumns.filter((column) => column.filter).map((column) => (
            <div key={`${column.id}-${column.key}`} className="relative flex items-center space-x-2">
            {column.type === "checkbox" ? (
              <div className="flex justify-between items-center gap-2 border border-gray rounded-md p-2 w-full">
                <div className="flex items-center gap-2">

                <Checkbox
                  checked={Boolean(filters[column.id as string | number as keyof typeof filters])}
                  onCheckedChange={(checked) => setFilter({ [column.id]: checked })}
                />              
                <Label>{column.label}</Label>
              </div>
              <X
                className="cursor-pointer"
                size={16}
                onClick={() => setFilter({ [column.id]: "" })}
              />
              </div>
            ) : (
                <div className="relative w-full max-w-sm">
                <Input
                  type={column.type}
                  placeholder={`Search by ${column.label}`}
                  value={column.type === "number" ? Number(filters[column.id as string | number]) || "" : filters[column.id as string | number] || ""}
                  onChange={(e) => setFilter({ [column.id]: e.target.value === "" ? "" : column.type === "number" ? Number(e.target.value) : e.target.value })}
                />
                </div>
            )}
            </div>
        ))}
      </div>
    </Card>
  );
}
