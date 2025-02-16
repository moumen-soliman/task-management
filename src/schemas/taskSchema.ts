import { z } from "zod";
import { PRIORITIES_LIST, STATUS_LIST } from "@/constants/tasks";

export const taskSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional().nullable(),
  priority: z.string().optional().default(""),
  status: z.string().optional().default(""),
  sprints: z.string().optional().nullable(),
  assign: z.array(z.string()).optional().default([]),
  deleted: z.boolean().optional().default(false)
}).passthrough(); // Allow additional fields

export type TaskFormValues = z.infer<typeof taskSchema>;
