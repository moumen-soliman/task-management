import { STORAGE_KEY } from "@/constants/tasks";

export const sprintActions = (set, get) => ({
  addTaskToSprint: (taskId, sprintId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.sprints?.includes(sprintId)
        ? { ...task, sprints: [...(task.sprints || []), sprintId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  removeTaskFromSprint: (taskId, sprintId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, sprints: task.sprints.filter((id) => id !== sprintId) } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  getSprintNames: (sprintIds) => {
    return get()
      .sprints.filter((sprint) => sprintIds?.includes(sprint.id))
      .map((sprint) => sprint.name);
  },
});
