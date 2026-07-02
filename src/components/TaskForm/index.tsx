"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { CreateTaskFormProps } from "@/types/Form";
import { TaskFormFields } from "./TaskFormFields";
import { taskSchema, TaskFormValues } from "@/schemas/taskSchema";
import { getDefaultValues } from "@/utils/formHelpers";
import { useToast } from "@/hooks/use-toast";
import { NativeDelete } from "@/components/ui/native-delete";
import { Task } from "@/types/Tasks";

export default function TaskForm({ mode, task, onClose }: CreateTaskFormProps) {
  const { addTask, updateTask, softDeleteTask, users, sprints, customFields, clearCustomFields } =
    useTaskStore();
  const { closeSheet, taskDefaults } = useSheetStore();
  const { toast } = useToast();
  const handleClose = onClose ?? closeSheet;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...getDefaultValues(mode, task, []),
      ...(taskDefaults || {}),
    },
  });

  useEffect(() => {
    if (task || mode === "edit" || taskDefaults) {
      form.reset({
        ...getDefaultValues(mode, mode === "edit" ? task : undefined, []),
        ...(taskDefaults || {}),
      });
    }
  }, [task, mode, taskDefaults]);

  const onSubmit = (values: TaskFormValues) => {
    const taskData = {
      ...form.getValues(),
      description: values.description,
      sprints: values.sprints ? [Number(values.sprints)] : [],
      assign: (values.assign || []).map(Number),
      deleted: false,
      ...(mode === "create"
        ? customFields.reduce(
            (acc, field) => {
              acc[field.name] = field.value;
              return acc;
            },
            {} as Record<string, any>
          )
        : {}),
    };

    if (mode === "create") {
      addTask(taskData);
      clearCustomFields(); // Clear custom fields after creating task
    } else if (mode === "edit" && task?.id) {
      updateTask(task?.id, taskData as Task);
    }
    toast({
      title: `${values.title} has been saved`,
      description: "Task has been saved successfully",
    });
    handleClose();
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto w-full space-y-5">
              <TaskFormFields
                form={form}
                users={users}
                sprints={sprints}
                taskId={mode === "edit" ? (task as Task | undefined)?.id : undefined}
              />
            </div>
          </div>
          {/* All controls share h-8 so heights align; single row, no wrap - the
              primary label shortens on phones so nothing overflows at ≤360px. */}
          <div className="flex items-center gap-2 border-t border-border/60 bg-background px-4 py-4 sm:px-6">
            {mode === "edit" && (task as Task | undefined)?.id !== undefined && (
              <NativeDelete
                size="sm"
                className="[&_button]:rounded-full"
                onDelete={() => {
                  softDeleteTask((task as Task).id);
                  handleClose();
                }}
              />
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                className="h-8 rounded-full px-4"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-8 rounded-full px-4 transition-transform active:scale-[0.98]"
              >
                <span className="sm:hidden">{mode === "create" ? "Create" : "Save"}</span>
                <span className="hidden sm:inline">
                  {mode === "create" ? "Create task" : "Save changes"}
                </span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
}
