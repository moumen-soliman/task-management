import { apiFetch } from "@/services";

export async function loadFromStorageOrFetch(key: string, endpoint: string) {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  const data = await apiFetch(endpoint);
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}