import { Task } from "@/types/Tasks";
import { create } from "zustand";
import { useTaskStore } from "@/store/useTaskStore";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { useMemo } from "react";
import { CUSTOM_COLUMNS_KEY } from "@/constants/tasks";

interface DataViewState {
  dataView: "table" | "kanban";
  filteredTasksList: Task[];
  visibleCount: number;
  sortColumn: keyof Task | null;
  sortDirection: "asc" | "desc" | null;
  filters: {
    title: string;
    priority: string;
    status: string;
  };
  selectedIds: number[];
  toggleSelection: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
  setVisibleCount: (count: number | ((prev: number) => number)) => void;
  setSortColumn: (column: keyof Task) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setFilter: (filter: Partial<DataViewState["filters"]>) => void;
  setSortColumnAndDirection: (column: keyof Task) => void;
}

export const useDataViewStoreBase = create<DataViewState>((set, get) => ({
  dataView: "table",
  filteredTasksList: [],
  selectedIds: [],
  visibleCount: 10,
  sortColumn: null,
  sortDirection: null,
  filters: {
    title: "",
    priority: "",
    status: "",
  },
  setDataView: (dataView) => set({ dataView }),
  setVisibleCount: (fn) =>
    set((state) => ({
      visibleCount: typeof fn === "function" ? fn(state.visibleCount) : fn,
    })),
  setSortColumn: (column) => set({ sortColumn: column }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  setFilter: (filter) =>
    set((state) => ({
      filters: { ...state.filters, ...filter },
    })),
  toggleSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedIds.includes(id);
      return {
        selectedIds: isSelected
          ? state.selectedIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedIds, id],
      };
    });
  },

  selectAll: (ids) => set({ selectedIds: ids }),

  clearSelection: () => set({ selectedIds: [] }),

  updateSelectedTasks: (updates) => {
    const { selectedIds } = get();
    const { updateTask } = useTaskStore.getState();

    selectedIds.forEach((taskId) => updateTask(taskId, updates));
  },

  setSortColumnAndDirection: (column) => {
    const { sortColumn, sortDirection } = get();
    if (sortColumn === column) {
      set({ sortDirection: sortDirection === "asc" ? "desc" : "asc" });
    } else {
      set({ sortColumn: column, sortDirection: "asc" });
    }
  },
}));

export const useDataViewStore = createSelectorHooks(useDataViewStoreBase);

export const useFilteredTasks = () => {
  const { sortColumn, sortDirection, filters } = useDataViewStore();
  const allTasks = useTaskStore.getState().tasks;
  const customColumns = useTaskStore.getState().customColumns;

  const priorityOrder = ["none", "low", "medium", "high", "urgent"];

  return useMemo(() => {
    console.time("FilteringTasks");
    let filteredTasks = allTasks
      .filter((task) => !task.deleted)
      .filter((task) => {
        if (filters.title && !task.title.toLowerCase().includes(filters.title.toLowerCase()))
          return false;
        if (filters.priority && task.priority !== filters.priority) return false;
        if (filters.status && task.status !== filters.status) return false;

        // Only apply filters for columns that have filter enabled
        const activeFilters = customColumns.filter((column) => column.filter === true);

        for (const column of activeFilters) {
          if (
            filters[column.id] !== undefined &&
            filters[column.id] !== "" &&
            task[column.key] !== filters[column.id]
          ) {
            return false;
          }
        }

        return true;
      });

    if (sortColumn && sortColumn !== "assign" && sortColumn !== "sprint") {
      filteredTasks = filteredTasks.sort((a, b) => {
        if (sortColumn === "priority") {
          return sortDirection === "asc"
            ? priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
            : priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
        } else {
          if (a[sortColumn as keyof Task] < b[sortColumn as keyof Task])
            return sortDirection === "asc" ? -1 : 1;
          if (a[sortColumn as keyof Task] > b[sortColumn as keyof Task])
            return sortDirection === "asc" ? 1 : -1;
          return 0;
        }
      });
    }
    console.timeEnd("FilteringTasks");
    return filteredTasks;
  }, [allTasks, sortColumn, sortDirection, filters, customColumns]);
};
