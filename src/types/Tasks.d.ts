import { Sprint } from "./Sprints";
import { User } from "./Users";

export type Priorities = "none" | "low" | "medium" | "high" | "urgent";

export type Status = "not_started" | "in_progress" | "completed";

export type Task = {
  id: number | string;
  title: string;
  status: Status;
  priority: Priorities;
  sprints: number[];
  assign: number[];
  deleted: boolean;
  error?: string | null;
  description: string;
  index?: number;
  [key: string]: any;
};

export interface TaskStore {
  tasks: Task[] | [];
  users: User[];
  sprints: Sprint[];
  loading: boolean;
  error?: string | null;
  customFields: { id: number; name: string | number; type: string; value: string | boolean; label?: string; key?: string | number }[];
  customColumns: { id: number; name: string; type: string; value: string | boolean; key: string; filter?: boolean; label?: string; }[];
  fetchAllData: () => Promise<void>;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number | string, updatedTask: Partial<Task>) => void;
  softDeleteTask: (id: number | string) => void;
  undoDeleteTask: (id: number | string) => void;
  assignUserToTask: (taskId: number | string, userId: number) => void;
  removeUserFromTask: (taskId: number | string, userId: number) => void;
  addTaskToSprint: (taskId: number | string, sprintId: number) => void;
  removeTaskFromSprint: (taskId: number | string, sprintId: number) => void;
  getSprintNames: (sprintIds: number[]) => string[];
  getAssignedUser: (userIds: number[]) => string[];
  getTaskById: (id: number | string) => Task | undefined;
  undo: () => void;
  redo: () => void;
  moveTask: (fromIndexOrId: number | string, toIndexOrPriority: number | string, isKanban: boolean) => void;
  updateTaskPriority: (taskId: number | string, newPriority: Priorities, newIndex?: number) => void;
  updateTaskStatus: (taskId: number | string, newStatus: Status) => void;
  addCustomColumn: (column: { name: string; type: string; value: string | boolean; key: string; filter?: boolean }) => void;
  removeCustomColumn: (columnKey: string) => void;
  updateCustomColumn: (columnKey: string, newColumn: { id: number; name: string; type: string; value: string | boolean; key: string; filter?: boolean }) => void;
  updateCustomColumnFilter: (columnKey: string, filterStatus: boolean, filterValue?: string) => void;
  addCustomField: (field: { name: string | number; type: string; value: string | boolean; label?: string; key?: string | number }) => void;
  removeCustomField: (fieldKey: string) => void;
  updateCustomField: (fieldKey: string, newField: { id: number; name: string | number; type: string; value: string | boolean; label?: string; key?: string | number }) => void;
}