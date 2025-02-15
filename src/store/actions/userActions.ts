import { STORAGE_KEY } from "@/constants/tasks";

export const userActions = (set, get) => ({
  assignUserToTask: (taskId, userId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.assign?.includes(userId)
        ? { ...task, assign: [...(task.assign || []), userId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  removeUserFromTask: (taskId, userId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, assign: task.assign.filter((id) => id !== userId) } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  getAssignedUser: (userIds) => {
    return get().users.filter((user) => userIds?.includes(user.id));
  },
});
