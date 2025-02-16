import { PRIORITIES_LIST, STORAGE_KEY, CUSTOM_COLUMNS_KEY } from "@/constants/tasks";
import { useDataViewStore } from "../useDataViewStore";

export const taskActions = (set, get) => ({
  addTask: (task) => {
    const newTask = { id: get().tasks.length + 1, ...task, deleted: false };
    const updatedTasks = [newTask, ...get().tasks];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  updateTask: (id, updatedTask) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  softDeleteTask: (id) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, deleted: true } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  undoDeleteTask: (id) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, deleted: false } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  updateTaskStatus: (taskId, newStatus) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  updateTaskPriority: (taskId, newPriority) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, priority: newPriority } : task
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      return { tasks: updatedTasks };
    });
  },
  getTaskById: (taskId) => {
    return get().tasks.find((task) => task.id === taskId);
  },

  addCustomColumn: (column) => {
    const existingColumns = JSON.parse(localStorage.getItem(CUSTOM_COLUMNS_KEY) || "[]");
    const newColumn = { ...column, id: existingColumns.length + 1 };
    const updatedColumns = [...get().customColumns, newColumn];
    set({ customColumns: updatedColumns });
    const mergedColumns = [...existingColumns, newColumn];
    localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(mergedColumns));

    get().tasks.forEach((task) => {
      const updatedTask = { ...task, [newColumn.key]: newColumn.defaultValue };
      get().updateTask(task.id, updatedTask);
    });
  },

  removeCustomColumn: (columnKey) => {
    const updatedColumns = get().customColumns.filter((col) => col.key !== columnKey);
    localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(updatedColumns));
    set({ customColumns: updatedColumns });

    const updatedTasks = get().tasks.map((task) => {
      const { [columnKey]: _, ...rest } = task;
      return rest;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  updateCustomColumn: (columnKey, newColumn) => {
    const updatedColumns = get().customColumns.map((col) =>
      col.key === columnKey ? newColumn : col
    );
    localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(updatedColumns));
    set({ customColumns: updatedColumns });
  },
  updateCustomColumnFilter: (columnKey, filterStatus, filterValue) => {
    const updatedColumns = get().customColumns.map((col) =>
      col.key === columnKey
        ? {
            ...col,
            filter: filterStatus,
            filterValue: filterStatus ? filterValue : undefined,
          }
        : col
    );
    localStorage.setItem(CUSTOM_COLUMNS_KEY, JSON.stringify(updatedColumns));
    set({ customColumns: updatedColumns });

    // Clear the filter value from DataViewStore when disabling filter
    if (!filterStatus) {
      const setFilter = useDataViewStore.getState().setFilter;

      setFilter({ [columnKey]: undefined });
    }
  },
  moveTask: (fromIndexOrId, toIndexOrPriority, isKanban) => {
    set((state) => {
      let tasks = [...state.tasks];

      if (isKanban && typeof toIndexOrPriority === "string") {
        // Kanban View: Change priority
        const taskIndex = tasks.findIndex((task) => task.id === fromIndexOrId);
        if (taskIndex !== -1) {
          tasks = tasks.map((task, index) =>
            index === taskIndex ? { ...task, priority: toIndexOrPriority } : task
          );
        }
      } else if (
        !isKanban &&
        typeof fromIndexOrId === "number" &&
        typeof toIndexOrPriority === "number"
      ) {
        // Table View: Change index
        if (
          fromIndexOrId < 0 ||
          fromIndexOrId >= tasks.length ||
          toIndexOrPriority < 0 ||
          toIndexOrPriority >= tasks.length
        ) {
          return state;
        }
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(fromIndexOrId, 1);
        updatedTasks.splice(toIndexOrPriority, 0, movedTask);
        tasks = updatedTasks;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return { tasks: [...tasks] };
    });
  },
});
