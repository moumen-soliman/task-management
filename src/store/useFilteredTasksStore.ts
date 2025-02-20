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

// This store is used to filter and sort tasks based on the filters and sort options
// It uses the tasks from the useTaskStore and the filters and sort options from the useDataViewStore
// It also uses the custom columns from the useTaskStore to filter tasks based on custom fields
// The applyFilters function is used to filter and sort tasks based on the current filters and sort options
export const useFilteredTasksStore = create<FilteredTasksState>((set) => {
  return {
    filteredTasks: [],

    applyFilters: () => {
      console.time("FilteringTasks");
      const allTasks = useTaskStore.getState().tasks;
      const customColumns = useTaskStore.getState().customColumns;
      const { sortColumn, sortDirection, filters, currentPage, pageSize, dataView, setCurrentPage } =
        useDataViewStore.getState();

      setCurrentPage(1); // Set currentPage to 1 when applying filters

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
            const filterValue = filters[column.id as unknown as keyof DataViewState["filters"]];
            if (filterValue !== undefined && filterValue !== "") {
              const taskValue = task[column.key];
    
             if (typeof taskValue === "string" && typeof filterValue === "string") {
                // For strings, perform case-insensitive comparison
                if (!taskValue.toLowerCase().includes(filterValue.toLowerCase())) {
                  return false;
                }
              } else {
                // Fallback for other types (direct comparison)
                if (taskValue !== filterValue) {
                  return false;
                }
              }
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
