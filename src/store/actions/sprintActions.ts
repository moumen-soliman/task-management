import { STORAGE_KEY } from "@/constants/tasks";
import { TaskStore } from "@/types/Tasks";

export const sprintActions = (
  set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void,
  get: () => TaskStore
) => ({
  addTaskToSprint: (taskId: number, sprintId: number) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.sprints?.includes(sprintId)
        ? { ...task, sprints: [...(task.sprints || []), sprintId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
  removeTaskFromSprint: (taskId: number, sprintId: number) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, sprints: task.sprints.filter((id) => id !== sprintId) } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
  getSprintNames: (sprintIds: number[]) => {
    return get()
      .sprints.filter((sprint) => sprintIds?.includes(sprint.id))
      .map((sprint) => sprint.name);
  },
});
