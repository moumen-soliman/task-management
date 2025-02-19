import { create } from "zustand";
import { useTaskStore } from "@/store/useTaskStore";
import { useDataViewStore } from "@/store/useDataViewStore";
import { PRIORITIES_LIST } from "@/constants/tasks";
import { Task } from "@/types/Tasks";
import { DataViewState } from "@/types/DataView";

interface FilteredTasksState {
  filteredTasks: Task[];
  applyFilters: () => void;
}

export const useFilteredTasksStore = create<FilteredTasksState>((set, get) => {
  return {
    filteredTasks: [],

    applyFilters: () => {
      console.time("FilteringTasks");
      const allTasks = useTaskStore.getState().tasks;
      const customColumns = useTaskStore.getState().customColumns;
      const { sortColumn, sortDirection, filters, currentPage, pageSize, dataView } =
        useDataViewStore.getState();

      const priorityOrder = PRIORITIES_LIST;

      let filteredTasks = allTasks
        .filter((task) => !task.deleted)
        .filter((task) => {
          if (filters.title && !task.title.toLowerCase().includes(filters.title.toLowerCase()))
            return false;
          if (filters.priority && task.priority !== filters.priority) return false;
          if (filters.status && task.status !== filters.status) return false;

          const activeFilters = customColumns.filter((column) => column.filter === true);

          for (const column of activeFilters) {
            if (
              filters[column.id as unknown as keyof DataViewState["filters"]] !== undefined &&
              filters[column.id as unknown as keyof DataViewState["filters"]] !== "" &&
              task[column.key] !== filters[column.id as unknown as keyof DataViewState["filters"]]
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

      if (dataView === "table") {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        filteredTasks = filteredTasks.slice(startIndex, endIndex);
      }

      console.timeEnd("FilteringTasks");
      set({ filteredTasks });
    },
  };
});
