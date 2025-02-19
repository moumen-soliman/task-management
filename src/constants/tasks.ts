// localStorage KEYS
export const STORAGE_KEY = "tasks";
export const USER_STORAGE_KEY = "users";
export const SPRINT_STORAGE_KEY = "sprints";
export const CUSTOM_COLUMNS_KEY = "custom_columns";

// Task priorities and statuses
export const PRIORITIES_LIST = ["none", "low", "medium", "high", "urgent"] as const;
export const STATUS_LIST = ["not_started", "in_progress", "completed"] as const;

export const SKIPED_KEYS = [
  "id",
  "title",
  "priority",
  "status",
  "description",
  "sprints",
  "assign",
  "deleted",
  "index"
];

export const TASK_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "assign", label: "Assign" },
  { key: "sprint", label: "Sprint" },
];
