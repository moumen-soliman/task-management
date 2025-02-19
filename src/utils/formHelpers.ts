import { PRIORITIES_LIST, SKIPED_KEYS, STATUS_LIST } from "@/constants/tasks";
import { TaskFormValues } from "@/schemas/taskSchema";
import { TaskStore } from "@/types/Tasks";

export function getDefaultValues(
  mode: "create" | "edit",
  task: TaskFormValues | undefined,
  customFields: TaskStore["customFields"]
) {
  if (mode === "edit" && task) {
    const defaultValues = {
      title: task.title,
      priority: task.priority,
      status: task.status,
      description: task.description || "",
      sprints: task.sprints?.[0]?.toString(),
      assign: task.assign?.map(String),
      ...customFields.reduce(
        (acc, field) => {
          acc[field.name] = task
            ? task[field.name] || (field.type === "checkbox" ? false : "")
            : "";
          return acc;
        },
        {} as Record<string, any>
      ),
      ...Object.entries(task).reduce(
        (acc, [key, value]) => {
          if (!SKIPED_KEYS.includes(key)) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      ),
    };

    return defaultValues;
  }

  return {
    title: "",
    priority: PRIORITIES_LIST[0],
    status: STATUS_LIST[0],
    description: "",
    sprints: "",
    assign: [] as string[],
    ...customFields.reduce((acc: Record<string, any>, field) => {
      acc[field.name] = field.type === "checkbox" ? false : "";
      return acc;
    }, {}),
  };
}
