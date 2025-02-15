import { STORAGE_KEY } from "@/constants/tasks";

export const customFieldActions = (set, get) => ({
  addCustomField: (fieldName, fieldType, fieldValue, taskId?) => {
    const newField = { id: get().customFields.length + 1, name: fieldName, type: fieldType, value: fieldValue };
    const updatedFields = [...get().customFields, newField];
    set({ customFields: updatedFields });

    if (taskId) {
      const updatedTasks = get().tasks.map((task) =>
        task.id === taskId ? {
          ...task,
          [fieldName]: fieldType === "checkbox" ? false : "",
        } : task
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
    }
  },
  removeCustomField: (id) => {
    const fieldToRemove = get().customFields.find((field) => field.id === id);
    const updatedFields = get().customFields.filter((field) => field.id !== id);
    set({ customFields: updatedFields });

    const updatedTasks = get().tasks.map((task) => {
      const { [fieldToRemove.name]: _, ...rest } = task;
      return rest;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
  updateCustomField: (taskId, fieldName, value) => {
    const updatedTasks = get().tasks.map((task) =>
      task.id === taskId
        ? Object.assign({}, task, { [fieldName]: value })
        : task
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },
});
