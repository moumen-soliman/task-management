import { Task } from "@/types/Tasks";
import { create } from "zustand";
import { useTaskStore } from "@/store/useTaskStore";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { useMemo } from "react";

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
  setVisibleCount: (count: number | ((prev: number) => number)) => void;
  setSortColumn: (column: keyof Task) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setFilter: (filter: Partial<DataViewState["filters"]>) => void;
}

export const useDataViewStoreBase = create<DataViewState>((set, get) => ({
  dataView: "table",
  filteredTasksList: [],
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
}));

export const useDataViewStore = createSelectorHooks(useDataViewStoreBase);

export const useFilteredTasks = () => {
  const { sortColumn, sortDirection, filters } = useDataViewStore();
  const allTasks = useTaskStore.getState().tasks;

  return useMemo(() => {
    console.time("FilteringTasks");
    let filteredTasks = allTasks.filter((task) => {

      if (filters.title && !task.title.toLowerCase().includes(filters.title.toLowerCase())) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.status && task.status !== filters.status) return false;
      return true;
    });

    if (sortColumn) {
        if (sortColumn === null) {
          filteredTasks = [...allTasks];
        } else {
          filteredTasks = filteredTasks.toSorted((a, b) => {
            if (a[sortColumn as keyof Task] < b[sortColumn as keyof Task]) return sortDirection === "asc" ? -1 : 1;
            if (a[sortColumn as keyof Task] > b[sortColumn as keyof Task]) return sortDirection === "asc" ? 1 : -1;
            return 0;
          });
        }
    }      
    console.timeEnd("FilteringTasks");
    return filteredTasks;
  }, [allTasks, sortColumn, sortDirection, filters]);
};
