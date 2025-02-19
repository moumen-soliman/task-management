import { STORAGE_KEY } from "@/constants/tasks";
import { Task, TaskStore } from "@/types/Tasks";

export const customFieldActions = (
  set: (partial: TaskStore | ((state: TaskStore) => TaskStore)) => void,
  get: () => TaskStore
) => ({
  addCustomField: (fieldName: string, fieldType: string, fieldValue: any, taskId?: number) => {
    // Check if field name already exists
    const fieldExists = get().customFields.some((field) => field.name === fieldName);
    if (fieldExists) {
      console.error("A field with this name already exists");
      return;
    }

    const newField = {
      id: get().customFields.length + 1,
      name: fieldName,
      type: fieldType,
      value: fieldValue,
    };
    const updatedFields = [...get().customFields, newField];
    set((state: TaskStore) => ({ ...state, customFields: updatedFields }));

    if (taskId) {
      const updatedTasks = get().tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [fieldName]: fieldType === "checkbox" ? false : fieldValue,
            }
          : task
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
    }
  },
  removeCustomField: (id: number) => {
    const fieldToRemove = get().customFields.find((field) => field.id === id);
    if (!fieldToRemove) return;

    const updatedFields = get().customFields.filter((field) => field.id !== id);
    set((state: TaskStore) => ({ ...state, customFields: updatedFields }));

    const updatedTasks = get().tasks.map((task) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldToRemove.name]: _, ...rest } = task;
      return { ...rest } as Task;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
  updateCustomField: (taskId: number, fieldName: string, value: string | number | boolean) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId ? { ...task, [fieldName]: value } : task
    ) as Task[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set((state: TaskStore) => ({ ...state, tasks: updatedTasks }));
  },
});
