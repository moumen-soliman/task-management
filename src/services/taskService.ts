import { SPRINT_STORAGE_KEY, STORAGE_KEY, USER_STORAGE_KEY } from "@/constants/tasks";
import { loadFromStorageOrFetch } from "@/utils";

export const taskService = {
  fetchTasks: async () => {
    return await loadFromStorageOrFetch(STORAGE_KEY, "/api/tasks");
  },
  fetchUsers: async () => {
    return await loadFromStorageOrFetch(USER_STORAGE_KEY, "/api/users");
  },
  fetchSprints: async () => {
    return await loadFromStorageOrFetch(SPRINT_STORAGE_KEY, "/api/sprints");
  },
};
