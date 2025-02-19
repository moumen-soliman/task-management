import { STORAGE_KEY } from "@/constants/tasks";
import { TaskStore } from "@/types/Tasks";

export const userActions = (
  set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void,
  get: () => TaskStore
) => ({
  assignUserToTask: (taskId: number, userId: number) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.assign?.includes(userId)
        ? { ...task, assign: [...(task.assign || []), userId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
  removeUserFromTask: (taskId: number, userId: number) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, assign: task.assign.filter((id) => id !== userId) } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
  getAssignedUser: (userIds: number[]) => {
    return get().users.filter((user) => userIds?.includes(user.id));
  },
});
