import { create } from "zustand";
import {SPRINT_STORAGE_KEY, STORAGE_KEY, USER_STORAGE_KEY} from "@/constants/tasks";
import {Priorities, Status, TaskStore} from "@/types/Tasks";
import { loadFromStorageOrFetch } from "@/utils";

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  users: [],
  sprints: [],
  loading: true,

// Fetch all data from the server
  fetchAllData: async () => {
    set({ loading: true });
    
    const [tasks, users, sprints] = await Promise.all([
        loadFromStorageOrFetch(STORAGE_KEY, '/api/tasks'),
        loadFromStorageOrFetch(USER_STORAGE_KEY, '/api/users'),
        loadFromStorageOrFetch(SPRINT_STORAGE_KEY, '/api/sprints')
    ]);

    set({ tasks, users, sprints, loading: false });
  },

  // Add a new task
  addTask: (task) => {
    console.log(task)
    const newTask = { id: get().tasks.length + 1, ...task, deleted: false };
    const updatedTasks = [newTask, ...get().tasks];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    // get().addTaskToSprint(newTask.id, task.sprints[0]);
    // newTask.assign.forEach((userId) => get().assignUserToTask(newTask.id, userId));
    set({ tasks: updatedTasks });
  },

  // Update an existing task
  updateTask: (id, updatedTask) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, ...updatedTask } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

//  Soft delete a task
  softDeleteTask: (id) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, deleted: true } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

// Undo a soft-deleted task
  undoDeleteTask: (id) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === id ? { ...task, deleted: false } : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Assign a user to a task
  assignUserToTask: (taskId, userId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.assign?.includes(userId)
        ? { ...task, assign: [...(task.assign || []), userId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Remove a user from a task
  removeUserFromTask: (taskId, userId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId
        ? { ...task, assign: task.assign.filter((id) => id !== userId) }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Add a task to a sprint
  addTaskToSprint: (taskId, sprintId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId && !task.sprints?.includes(sprintId)
        ? { ...task, sprints: [...(task.sprints || []), sprintId] }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

    // Remove a task from a sprint
  removeTaskFromSprint: (taskId, sprintId) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId
        ? { ...task, sprints: task.sprints.filter((id) => id !== sprintId) }
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Resolve sprint names for a given task's sprint IDs
  getSprintNames: (sprintIds) => {
    return get()
      .sprints.filter((sprint) => sprintIds?.includes(sprint.id))
      .map((sprint) => sprint.name);
  },

    // Resolve user names for a given task's user IDs
  getAssignedUserNames: (userIds) => {
    return get()
      .users.filter((user) => userIds?.includes(user.id))
      .map((user) => user.name);
  },

  // Update a task's status
  updateTaskStatus: (taskId: number, newStatus: Status) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Update a task's priority
  updateTaskPriority: (taskId: number, newPriority: Priorities) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
}));
