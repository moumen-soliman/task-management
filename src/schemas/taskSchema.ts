import { z } from "zod";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";

export const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    priority: z.enum(PRIORITIES_LIST),
    status: z.enum(STATUS_LIST),
    description: z.string().optional(),
    sprints: z.string().optional(),
    assign: z.array(z.string()).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
