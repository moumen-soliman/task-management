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