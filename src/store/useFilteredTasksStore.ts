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

const filterByTitle = (task: Task, titleFilter: string): boolean => {
  return !titleFilter || task.title.toLowerCase().includes(titleFilter.toLowerCase());
};

const filterByPriority = (task: Task, priorityFilter: string): boolean => {
  return !priorityFilter || task.priority === priorityFilter;
};

const filterByStatus = (task: Task, statusFilter: string): boolean => {
  return !statusFilter || task.status === statusFilter;
};

const filterByCustomColumns = (task: Task, filters: DataViewState["filters"], customColumns: any[]): boolean => {
  return customColumns
    .filter((column) => column.filter === true)
    .every((column) => {
      const filterValue = filters[column.id as unknown as keyof DataViewState["filters"]];
      if (filterValue === undefined || filterValue === "") return true;

      const taskValue = task[column.key];
      if (typeof taskValue === "string" && typeof filterValue === "string") {
        return taskValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      return taskValue === filterValue;
    });
};

const sortTasks = (tasks: Task[], sortColumn: string | null, sortDirection: string): Task[] => {
  if (!sortColumn || sortColumn === "assign" || sortColumn === "sprint") return tasks;

  return tasks.sort((a, b) => {
    if (sortColumn === "priority") {
      const priorityOrder = PRIORITIES_LIST;
      return sortDirection === "asc"
        ? priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
        : priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority);
    }

    const aValue = a[sortColumn as keyof Task];
    const bValue = b[sortColumn as keyof Task];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
};

const paginateTasks = (tasks: Task[], currentPage: number, pageSize: number): Task[] => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return tasks.slice(startIndex, endIndex);
};

// This store is used to filter and sort tasks based on the filters and sort options
// It uses the tasks from the useTaskStore and the filters and sort options from the useDataViewStore
// It also uses the custom columns from the useTaskStore to filter tasks based on custom fields
// The applyFilters function is used to filter and sort tasks based on the current filters and sort options
export const useFilteredTasksStore = create<FilteredTasksState>((set) => ({
  filteredTasks: [],

  applyFilters: () => {
    console.time("FilteringTasks");

    const allTasks = useTaskStore.getState().tasks;
    const customColumns = useTaskStore.getState().customColumns;
    const { sortColumn, sortDirection, filters, currentPage, pageSize, dataView } = useDataViewStore.getState();

    let filteredTasks = allTasks
      .filter((task) => !task.deleted)
      .filter((task) => filterByTitle(task, filters.title))
      .filter((task) => filterByPriority(task, filters.priority))
      .filter((task) => filterByStatus(task, filters.status))
      .filter((task) => filterByCustomColumns(task, filters, customColumns));

    filteredTasks = sortTasks(filteredTasks, typeof sortColumn === 'string' ? sortColumn : null, sortDirection as string);

    if (dataView === "table") {
      filteredTasks = paginateTasks(filteredTasks, currentPage, pageSize);
    }

    console.timeEnd("FilteringTasks");
    set({ filteredTasks });
  },
}));