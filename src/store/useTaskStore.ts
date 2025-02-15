import { create } from "zustand";
import { SPRINT_STORAGE_KEY, STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/tasks";
import { Priorities, Status, TaskStore } from "@/types/Tasks";
import { loadFromStorageOrFetch } from "@/utils";
import { taskActions } from "./actions/taskActions";
import { userActions } from "./actions/userActions";
import { sprintActions } from "./actions/sprintActions";
import { customFieldActions } from "./actions/customFieldActions";

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  users: [],
  sprints: [],
  loading: true,
  customFields: [],

  fetchAllData: async () => {
    set({ loading: true });
    
    const [tasks, users, sprints] = await Promise.all([
        loadFromStorageOrFetch(STORAGE_KEY, '/api/tasks'),
        loadFromStorageOrFetch(USER_STORAGE_KEY, '/api/users'),
        loadFromStorageOrFetch(SPRINT_STORAGE_KEY, '/api/sprints')
    ]);

    set({ tasks, users, sprints, loading: false });
  },

  ...taskActions(set, get),
  ...userActions(set, get),
  ...sprintActions(set, get),
  ...customFieldActions(set, get),
}));
