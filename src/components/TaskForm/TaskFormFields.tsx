import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITIES_LIST, SKIPED_KEYS, STATUS_LIST } from "@/constants/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import MultiSelect from "../ui/multiSelect";
import CustomFieldEditor from "../CustomFieldEditor";
import { UseFormReturn } from "react-hook-form";
import { TaskFormValues } from "@/schemas/taskSchema";
import { User } from "@/types/Users";
import { Sprint } from "@/types/Sprints";
import DescEditor from "@/components/DescEditor";
import { useTaskStore } from "@/store/useTaskStore";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  users: User[];
  sprints: Sprint[];
}

export function TaskFormFields({ form, users, sprints }: TaskFormFieldsProps) {
  const customColumns = useTaskStore((state) => state.customFields);
  return (
    <>
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
            <DescEditor value={field.value || ""} onChange={field.onChange} />
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
                  <SelectItem className="capitalize" key={sprint.id} value={String(sprint.id)}>
                    {sprint?.name?.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <CustomFieldEditor />
      {customColumns?.map((column) =>
        column && column.key ? (
          <FormField
            key={column.key}
            control={form.control}
            name={column.key as keyof TaskFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{column.label}</FormLabel>
                <FormControl>
                  <Input placeholder={column.label} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null
      )}
      {Object.entries(form.getValues() || {}).map(([key, value]) => {
        if (!SKIPED_KEYS.includes(key)) {
          return (
            <FormItem key={key}>
              <FormLabel className="capitalize">{key.replace(/_/g, " ")}</FormLabel>
              <FormControl>
                {typeof value === "boolean" ? (
                  <Checkbox
                    {...form.register(key as keyof TaskFormValues)}
                    checked={Boolean(form.watch(key as keyof TaskFormValues))}
                    onCheckedChange={(checked) =>
                      form.setValue(key as keyof TaskFormValues, checked as any)
                    }
                  />
                ) : (
                  <Input
                    {...form.register(key as keyof TaskFormValues)}
                    defaultValue={form.watch(key as keyof TaskFormValues) ?? ""}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }
        return null;
      })}
    </>
  );
}
