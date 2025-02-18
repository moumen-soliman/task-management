import { STORAGE_KEY } from "@/constants/tasks";
import { apiFetch } from "@/services";

// Retrieves data from local storage if available, otherwise fetches from API and stores it
export async function loadFromStorageOrFetch(key: string, endpoint: string) {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  const data = await apiFetch(endpoint);
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export const subscribeToTaskUpdates = (onUpdate) => {
  const handleStorageChange = (event) => {
    if (event.key === STORAGE_KEY) {
      const updatedTasks = JSON.parse(event.newValue);
      onUpdate(updatedTasks);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => window.removeEventListener("storage", handleStorageChange);
};

export const generatePageSizeOptions = (totalTasks: number): number[] => {
  const pageSizeOptions: number[] = [];
  let size = 10;

  while (size <= totalTasks) {
    pageSizeOptions.push(size);
    if (size === 10) size = 20;
    else if (size === 20) size = 50;
    else size += 50;
  }

  return pageSizeOptions;
};
