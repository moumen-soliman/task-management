import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/types/Tasks";

export const CURRENT_USER = "moumensoliman";

export type ActivityAction = "created" | "updated" | "deleted" | "restored";

export interface ActivityEntry {
  id: string;
  ts: number;
  user: string;
  action: ActivityAction;
  taskId: number | string;
  taskTitle: string;
  /** Human-readable change summary, e.g. "status → in progress" */
  detail?: string;
  /** Full task snapshot captured on delete so it can be restored later. */
  snapshot?: Task;
}

interface ActivityState {
  entries: ActivityEntry[];
  /** History page filters - not persisted. */
  actionFilter: ActivityAction | "";
  query: string;
  logActivity: (entry: Omit<ActivityEntry, "id" | "ts" | "user">) => void;
  clearActivity: () => void;
  setActionFilter: (actionFilter: ActivityAction | "") => void;
  setQuery: (query: string) => void;
}

const MAX_ENTRIES = 500;

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      entries: [],
      actionFilter: "",
      query: "",
      logActivity: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              ts: Date.now(),
              user: CURRENT_USER,
            },
            ...state.entries,
          ].slice(0, MAX_ENTRIES),
        })),
      clearActivity: () => set({ entries: [] }),
      setActionFilter: (actionFilter) => set({ actionFilter }),
      setQuery: (query) => set({ query }),
    }),
    {
      name: "activity-log",
      partialize: (state) => ({ entries: state.entries }),
    }
  )
);
