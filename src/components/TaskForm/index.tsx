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

export default function TaskForm({ mode, task }: CreateTaskFormProps) {
  const { addTask, updateTask, users, sprints, customFields } = useTaskStore();
  const { closeSheet } = useSheetStore();
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(mode, task, []),
  });

  useEffect(() => {
    form.reset(getDefaultValues(mode, mode === "edit" ? task : undefined, []));
  }, [task, mode, form, customFields]);

  const onSubmit = (values: TaskFormValues) => {
    const taskData = {
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
      ...form.getValues(),
    };

    if (mode === "create") {
      addTask(taskData);
    } else if (mode === "edit" && task?.id) {
      updateTask(task?.id, taskData);
    }
    toast({
      title: `${values.title} has been saved`,
      description: "Task has been saved successfully",
    });
    closeSheet();
  };

  return (
    <div className="space-y-4 py-5">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TaskFormFields form={form} users={users} sprints={sprints} />
            <div className="flex items-center gap-10">
              <Button type="submit" className="w-full">
                Save
              </Button>
              <Button variant="outline" onClick={closeSheet} className="w-full">
                Close
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
