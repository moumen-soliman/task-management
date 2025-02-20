import { create } from "zustand";
import undoRedoMiddleware from "./undoRedoMiddleware";
import { Task, TaskStore } from "@/types/Tasks";
import { taskActions } from "./actions/taskActions";
import { userActions } from "./actions/userActions";
import { sprintActions } from "./actions/sprintActions";
import { customFieldActions } from "./actions/customFieldActions";
import { User } from "@/types/Users";
import { Sprint } from "@/types/Sprints";

// This store is used to manage the state of the task component
// The task component is used to create, edit, or view tasks
export const useTaskStore = create<TaskStore>(
  undoRedoMiddleware(
    (
      set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void,
      get: () => TaskStore
    ) => ({
      tasks: [],
      users: [],
      sprints: [],
      loading: true,
      customFields: [],
      customColumns: [],
      history: [],
      redoStack: [],
      setTasks: (tasks: Task[]) => set((state) => ({ ...state, tasks })),
      setUsers: (users: User[]) => set((state) => ({ ...state, users })),
      setSprints: (sprints: Sprint[]) => set((state) => ({ ...state, sprints })),
      setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),
      ...taskActions(set, get),
      ...userActions(set, get),
      ...sprintActions(set, get),
      ...customFieldActions(set, get),
    })
  )
);
