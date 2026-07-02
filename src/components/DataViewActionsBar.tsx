import React from "react";
import { useDataViewStore } from "@/store/useDataViewStore";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

/** Active custom-column filter chips - everything else lives in the ActionIsland. */
export default function DataViewActionsBar() {
  const setFilter = useDataViewStore((state) => state.setFilter);
  const filters: { [key: string]: any } = useDataViewStore((state) => state.filters);
  const customColumns = useTaskStore((state) => state.customColumns);

  const activeFilterColumns = customColumns.filter((column) => column.filter);

  if (activeFilterColumns.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
      {activeFilterColumns.map((column) => (
        <div key={`${column.id}-${column.key}`} className="flex items-center">
          {column.type === "checkbox" ? (
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1">
              <Checkbox
                checked={Boolean(filters[column.id as string | number as keyof typeof filters])}
                onCheckedChange={(checked) => setFilter({ [column.id]: checked })}
              />
              <Label className="text-xs">{column.name}</Label>
              <button
                type="button"
                aria-label={`Clear ${column.name} filter`}
                onClick={() => setFilter({ [column.id]: "" })}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <Input
              type={column.type}
              placeholder={column.name}
              value={
                column.type === "number"
                  ? Number(filters[column.id as string | number]) || ""
                  : filters[column.id as string | number] || ""
              }
              onChange={(e) =>
                setFilter({
                  [column.id]:
                    e.target.value === ""
                      ? ""
                      : column.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                })
              }
              className="h-8 w-40 text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}
