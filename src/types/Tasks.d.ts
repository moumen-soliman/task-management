
import { Sprint } from "./Sprints";
import { User } from "./Users";

export type Priorities = "none" | "low" | "medium" | "high" | "urgent";

export type Status = "not_started" | "in_progress" | "completed";

export type Task = {
    id: number;
    title: string;
    status: Status;
    priority: Priorities;
    sprints: number[];
    assign: number[];
    deleted: boolean;
    error?: string | null;
    description: string;
  };

export interface TaskStore {
    tasks: Task[];
    users: User[];
    sprints: Sprint[];
    loading: boolean;
    error?: string | null;
    customFields: { id: number; name: string; type: string; value: string | boolean }[];
    fetchAllData: () => Promise<void>;
    addTask: (task: Omit<Task, "id">) => void;
    updateTask: (id: number, updatedTask: Partial<Task>) => void;
    softDeleteTask: (id: number) => void;
    undoDeleteTask: (id: number) => void;
    assignUserToTask: (taskId: number, userId: number) => void;
    removeUserFromTask: (taskId: number, userId: number) => void;
    addTaskToSprint: (taskId: number, sprintId: number) => void;
    removeTaskFromSprint: (taskId: number, sprintId: number) => void;
    getSprintNames: (sprintIds: number[]) => string[];
    getAssignedUser: (userIds: number[]) => string[];
    getTaskById: (id: number | string) => Task | undefined;
  }