import { Task } from "@/types/Tasks";
import { create } from "zustand";
import { useTaskStore } from "@/store/useTaskStore";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { dataView, DataViewState } from "@/types/DataView";

// This store is used to filter and sort tasks based on the filters and sort options
// It uses the tasks from the useTaskStore and the filters and sort options from the useDataViewStore
// It also uses the custom columns from the useTaskStore to filter tasks based on custom fields
// The applyFilters function is used to filter and sort tasks based on the current filters and sort options
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
  currentPage: 1,
  pageSize: 10,
  setDataView: (dataView: dataView) => set({ dataView }),
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

  updateSelectedTasks: (updates: Partial<Task>) => {
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
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }), // Reset to first page on page size change
}));

export const useDataViewStore = createSelectorHooks(useDataViewStoreBase);
