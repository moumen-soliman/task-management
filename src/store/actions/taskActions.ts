import { PRIORITIES_LIST, STORAGE_KEY, CUSTOM_COLUMNS_KEY } from "@/constants/tasks";
import { useDataViewStore } from "../useDataViewStore";

export const taskActions = (set, get) => ({
  addTask: (task) => {
    const tasks = get().tasks;
    const maxIndex = Math.max(...tasks.map((t) => t.index || 0), -1);
    const newTask = {
      id: tasks.length + 1,
      ...task,
      deleted: false,
      index: maxIndex + 1,
    };
    const updatedTasks = [newTask, ...tasks];
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
  updateTaskPriority: (taskId, newPriority, newIndex) => {
    set((state) => {
      let updatedTasks = [...state.tasks];
      const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return state;

      const task = updatedTasks[taskIndex];
      updatedTasks.splice(taskIndex, 1);

      // Get tasks in target priority column
      const targetColumnTasks = updatedTasks.filter((t) => t.priority === newPriority);

      // Calculate new index
      let insertAtIndex;
      if (newIndex !== undefined) {
        insertAtIndex = newIndex;
      } else {
        // If no index specified, put at end of target column
        insertAtIndex = targetColumnTasks.length;
      }

      // Reindex all tasks in the target column
      const baseIndex =
        targetColumnTasks.length > 0 ? Math.min(...targetColumnTasks.map((t) => t.index || 0)) : 0;

      targetColumnTasks.forEach((t, idx) => {
        t.index = baseIndex + idx;
      });

      // Insert task at correct position
      const updatedTask = {
        ...task,
        priority: newPriority,
        index: baseIndex + insertAtIndex,
      };

      // Find position in full array
      const insertPosition = updatedTasks.findIndex(
        (t) => t.priority === newPriority && (t.index || 0) > baseIndex + insertAtIndex
      );

      if (insertPosition === -1) {
        updatedTasks.push(updatedTask);
      } else {
        updatedTasks.splice(insertPosition, 0, updatedTask);
      }

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
