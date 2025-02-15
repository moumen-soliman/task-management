import { STORAGE_KEY } from "@/constants/tasks";

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
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  getTaskById: (taskId) => {
    return get().tasks.find((task) => task.id === taskId);
  },
  moveTask: (dragIndex, hoverIndex) => {
    const tasks = Array.from(get().tasks);
    const [draggedTask] = tasks.splice(dragIndex, 1);
    tasks.splice(hoverIndex, 0, draggedTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    set({ tasks });
  },
});
