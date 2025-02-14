"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import TaskEditor from "./TaskEditor";
import MultiSelect from "./ui/multiSelect";
import { SheetTitle } from "./ui/sheet";

// Schema Validation
const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  priority: z.enum(PRIORITIES_LIST),
  status: z.enum(STATUS_LIST),
  description: z.string().optional(),
  sprints: z.string().optional(),
  assign: z.array(z.string()).optional(),
});

export default function CreateTaskForm() {
  const { addTask, users, sprints } = useTaskStore();
  const { closeSheet } = useSheetStore();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      status: "not_started",
      description: "",
      sprints: "",
      assign: [] as string[],
    },
  });

  const onSubmit = (values: z.infer<typeof taskSchema>) => {
    addTask({
      title: values.title,
      status: values.status,
      priority: values.priority,
      description: values.description || '',
      sprints: [Number(values.sprints)],
      assign: (values.assign || []).map(Number),
      deleted: false,
    });
    closeSheet(); // Close panel after saving
  };

  return (
    <div className="space-y-4 py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Task Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Rich Text Editor for Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Description</FormLabel>
                <TaskEditor value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRIORITIES_LIST.map((priority) => (
                      <SelectItem className="capitalize" key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUS_LIST.map((status) => (
                      <SelectItem className="capitalize" key={status} value={status}>
                        {status.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />

                
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Users</FormLabel>
                <MultiSelect
                  options={users.map((user) => ({ value: String(user.id), label: user.name }))}
                  value={field.value || []}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
 <FormField
            control={form.control}
            name="sprints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sprint</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sprint" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sprints.map((sprint) => (
                      <SelectItem 
                        className="capitalize" 
                        key={sprint.id} 
                        value={String(sprint.id)}
                      >
                        {sprint.name.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-10">
            <Button type="submit" className="w-full">
                ➕ Create Task
            </Button>
            <Button variant={"outline"} onClick={() => closeSheet()} className="w-full">
                Close
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
