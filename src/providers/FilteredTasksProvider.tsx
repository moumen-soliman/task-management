import { useEffect } from "react";
import { useFilteredTasksStore } from "@/store/useFilteredTasksStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useDataViewStore } from "@/store/useDataViewStore";
import { useShallow } from "zustand/shallow";

export const FilteredTasksProvider = () => {
  const applyFilters = useFilteredTasksStore((state) => state.applyFilters);
  const tasks = useTaskStore((state) => state.tasks);

  const { filters, sortColumn, sortDirection, currentPage, pageSize, dataView } = useDataViewStore(
    useShallow((state) => ({
      filters: state.filters,
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      dataView: state.dataView,
    }))
  );

  useEffect(() => {
    applyFilters();
  }, [tasks, filters, sortColumn, sortDirection, currentPage, pageSize, dataView]);

  return null;
};
