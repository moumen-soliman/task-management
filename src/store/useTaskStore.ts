import { create } from "zustand";
import undoRedoMiddleware from "./undoRedoMiddleware"; // Import the middleware
import {
  CUSTOM_COLUMNS_KEY,
  SPRINT_STORAGE_KEY,
  STORAGE_KEY,
  USER_STORAGE_KEY,
} from "@/constants/tasks";
import { TaskStore } from "@/types/Tasks";
import { loadFromStorageOrFetch } from "@/utils";
import { taskActions } from "./actions/taskActions";
import { userActions } from "./actions/userActions";
import { sprintActions } from "./actions/sprintActions";
import { customFieldActions } from "./actions/customFieldActions";

// Define the store with the middleware
export const useTaskStore = create<TaskStore>(
  undoRedoMiddleware(
    (set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void, get: () => TaskStore) => ({
    tasks: [],
    users: [],
    sprints: [],
    loading: true,
    customFields: [],
    customColumns: [],
    history: [],
    redoStack: [],
    
    fetchAllData: async () => {
      set((state) => ({ ...state, loading: true }));

      const [tasks, users, sprints] = await Promise.all([
        loadFromStorageOrFetch(STORAGE_KEY, "/api/tasks"),
        loadFromStorageOrFetch(USER_STORAGE_KEY, "/api/users"),
        loadFromStorageOrFetch(SPRINT_STORAGE_KEY, "/api/sprints"),
      ]);

      set((state) => ({
        ...state,
        tasks,
        users,
        sprints,
        customColumns: JSON.parse(localStorage.getItem(CUSTOM_COLUMNS_KEY) || "[]"),
        loading: false,
      }));
    },

    ...taskActions(set, get),
    ...userActions(set, get),
    ...sprintActions(set, get),
    ...customFieldActions(set, get),
  }))
);