"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";
import TaskEditor from "./TaskEditor";
import MultiSelect from "./ui/multiSelect";
import { useEffect } from "react";
import { CreateTaskFormProps } from "@/types/Form";
import CustomFieldEditor from "./CustomFieldEditor";


export default function CreateTaskForm({ mode, task }: CreateTaskFormProps) {
    const { addTask, updateTask, users, sprints, customFields } = useTaskStore();
    const { closeSheet } = useSheetStore();
    // Schema Validation
const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    priority: z.enum(PRIORITIES_LIST),
    status: z.enum(STATUS_LIST),
    description: z.string().optional(),
    sprints: z.string().optional(),
    assign: z.array(z.string()).optional(),
    ...customFields.reduce((acc, field) => {
        const fieldSchema = field.type === "checkbox" 
            ? z.boolean().optional()
            : field.type === "number"
                ? z.coerce.number().optional()
                : z.string().optional();
        acc[field.name] = fieldSchema;
        return acc;
    }, {})
});
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: getDefaultValues(mode, task),
    });

    useEffect(() => {
        if (mode === "edit" && task) {
            form.reset(getDefaultValues(mode, task));
        }
    }, [task, mode, form]);

    const onSubmit = (values: z.infer<typeof taskSchema>) => {
        const taskData = {
            title: values.title,
            status: values.status,
            priority: values.priority,
            description: values.description || '',
            sprints: [Number(values.sprints)],
            assign: (values.assign || []).map(Number),
            deleted: false,
            ...customFields.reduce((acc, field) => {
                acc[field.name] = values[field.name] || (field.type === "checkbox" ? false : "");
                return acc;
            }, {}),
        };

        if (mode === "create") {
            addTask(taskData);
        } else if (mode === "edit" && task?.id) {
            updateTask(task?.id, taskData);
        }
    };

    return (
        <div className="space-y-4 py-5">
        <FormProvider {...form}>
            <Form {...form}>
                <form onSubmit={() => {
                    form.handleSubmit(onSubmit);
                    closeSheet();
                }} className="space-y-4">
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
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task Description</FormLabel>
                                <TaskEditor 
                                    key={field.value} // Add key to force re-render on reset
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                />
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
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
                                <Select onValueChange={field.onChange} value={field.value}>
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
                    <CustomFieldEditor mode={mode} task={task} form={form} />
                    {Object.entries(task || {}).map(([key, value]) => {
                        if (!['title', 'priority', 'status', 'description', 'sprints', 'assign', 'id', 'deleted'].includes(key)) {
                            return (
                                <FormField
                                    key={key}
                                    control={form.control}
                                    name={key as any}
                                    defaultValue={value}
                                    render={({ field }) => {
                                        return (
                                        <FormItem>
                                            <FormLabel className="capitalize">{key.replace(/_/g, ' ')}</FormLabel>
                                            <FormControl>
                                                {typeof value === 'boolean' ? (
                                                    <Input 
                                                        type="checkbox" 
                                                        checked={field.value}
                                                        onChange={e => field.onChange(e.target.checked)}
                                                    />
                                                ) : typeof value === 'number' ? (
                                                    <Input 
                                                        type="number" 
                                                        value={field.value ?? ''}
                                                        onChange={e => field.onChange(Number(e.target.value))}
                                                    />
                                                ) : (
                                                    <Input 
                                                        value={field.value ?? ''}
                                                        onChange={e => field.onChange(e.target.value)}
                                                    />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}}
                                />
                            );
                        }
                        return null;
                    })}
                    <div className="flex items-center gap-10">
                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                        <Button variant={"outline"} onClick={closeSheet} className="w-full">
                            Close
                        </Button>
                    </div>
                </form>
            </Form>
        </FormProvider>
        </div>
    );
}

function getDefaultValues(mode: "create" | "edit", task: z.infer<typeof taskSchema> | undefined, customFields: any[] = []) {
    if (mode === "edit" && task) {
        const defaultValues = {
            title: task.title,
            priority: task.priority,
            status: task.status,
            description: task.description,
            sprints: task.sprints?.[0]?.toString(),
            assign: task.assign?.map(String),
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
    };
}
