import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PRIORITIES_LIST, SKIPED_KEYS, STATUS_LIST } from "@/constants/tasks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { TaskFormValues } from "@/schemas/taskSchema";
import { User } from "@/types/Users";
import { Sprint } from "@/types/Sprints";
import DescEditor from "@/components/DescEditor";
import PriorityHandler from "@/components/PriorityHandler";
import StatusHandler from "@/components/StatusHandler";
import AssignedUsers from "@/components/AssignedUsers";
import { useTaskStore } from "@/store/useTaskStore";
import { useSheetStore } from "@/store/useSheetStore";
import { Priorities, Status } from "@/types/Tasks";
import { Layers, UserPlus } from "lucide-react";

interface TaskFormFieldsProps {
  form: UseFormReturn<TaskFormValues>;
  users: User[];
  sprints: Sprint[];
  taskId?: number | string;
}

/** Compact property chip - the pill look shared by all controls above the title.
 *  Optically aligned: icons sit on both edges (glyph left, chevron right), so both
 *  sides get 2px less padding than a text edge would (icon side = text side − 2px). */
const chipClass =
  "inline-flex h-7 w-auto items-center gap-1 rounded-full border border-border bg-transparent px-1.5 py-0 text-[11px] shadow-none outline-none transition-colors hover:bg-muted/60 focus:ring-0 focus-visible:bg-muted sm:gap-1.5 sm:px-2 sm:text-xs";

export function TaskFormFields({ form, users, sprints, taskId }: TaskFormFieldsProps) {
  const { customColumns } = useTaskStore();
  const mode = useSheetStore((state) => state.mode);
  const labelClass = "text-xs font-medium text-muted-foreground";

  return (
    <>
      {/* Properties - above the title, Linear-style chips.
          pr-9 keeps the last chip in a row clear of the sheet's close (X) button. */}
      <div className="flex flex-wrap items-center gap-1.5 pr-9 sm:pr-0">
        {taskId !== undefined && (
          <span className="inline-flex h-7 items-center rounded-full bg-muted/60 px-2.5 text-xs tabular-nums text-muted-foreground">
            #{taskId}
          </span>
        )}

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                <FormControl>
                  <SelectTrigger className={`${chipClass} capitalize`}>
                    <PriorityHandler
                      priority={(field.value as Priorities) ?? "none"}
                      variant="compact"
                    />
                    {field.value ?? "Priority"}
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
            <FormItem className="space-y-0">
              <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                <FormControl>
                  <SelectTrigger className={`${chipClass} capitalize`}>
                    <StatusHandler
                      status={(field.value as Status) ?? "not_started"}
                      showLabel={false}
                    />
                    {field.value ? field.value.replaceAll("_", " ") : "Status"}
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
          render={({ field }) => {
            const selected = (field.value || []) as string[];
            const selectedUsers = users.filter((user) => selected.includes(String(user.id)));
            return (
              <FormItem className="space-y-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* text ends this chip (no chevron) - text side keeps full padding */}
                    <button type="button" className={cn(chipClass, "pr-2.5")}>
                      {selectedUsers.length > 0 ? (
                        <>
                          <AssignedUsers
                            assignedUserIds={selected}
                            getAssignedUser={selectedUsers}
                            size="sm"
                            showEmptyText={false}
                          />
                          <span className="max-w-[6rem] truncate text-muted-foreground">
                            {selectedUsers.length === 1
                              ? selectedUsers[0].name
                              : `${selectedUsers.length} assignees`}
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={13} className="shrink-0 text-muted-foreground" />
                          <span className="text-muted-foreground">Assign</span>
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[180px]">
                    {users.map((user) => (
                      <DropdownMenuCheckboxItem
                        key={user.id}
                        checked={selected.includes(String(user.id))}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked
                              ? [...selected, String(user.id)]
                              : selected.filter((id) => id !== String(user.id))
                          )
                        }
                      >
                        {user.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="sprints"
          render={({ field }) => {
            const sprintName = sprints.find((s) => String(s.id) === field.value)?.name;
            return (
              <FormItem className="space-y-0">
                <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                  <FormControl>
                    <SelectTrigger className={`${chipClass} capitalize`}>
                      <Layers size={13} className="shrink-0 text-muted-foreground" />
                      {sprintName ? (
                        <span className="max-w-[6rem] truncate">
                          {sprintName.replaceAll("_", " ")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Sprint</span>
                      )}
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
            );
          }}
        />
      </div>

      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="sr-only">Task title</FormLabel>
            <FormControl>
              <Input
                placeholder="Task title"
                {...field}
                className="h-auto border-0 bg-transparent px-0 py-1 text-xl font-semibold shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description - free-form, no box (Notion-style) */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormLabel className="sr-only">Description</FormLabel>
            <DescEditor value={field.value || ""} onChange={field.onChange} />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CustomFieldEditor ("Manage Custom Fields") intentionally hidden for now */}
      {mode === "create" &&
        customColumns?.map((column) =>
          column ? (
            <FormField
              key={column.key}
              control={form.control}
              name={column.key as string}
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClass}>{column.name}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={column.label}
                      {...field}
                      value={(field.value ?? "") as string | number | readonly string[] | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null
        )}
      {mode === "edit" &&
        Object.entries(form.getValues() || {}).map(([key, value]) => {
          if (!SKIPED_KEYS.includes(key)) {
            return (
              <FormItem key={key} className="space-y-1.5">
                <FormLabel className={`${labelClass} capitalize`}>
                  {key.replace(/_/g, " ")}
                </FormLabel>
                <FormControl>
                  {typeof value === "boolean" ? (
                    <Checkbox
                      {...form.register(key as string)}
                      checked={Boolean(form.watch(key as string))}
                      onCheckedChange={(checked) => form.setValue(key as string, checked as any)}
                    />
                  ) : (
                    <Input
                      {...form.register(key as string)}
                      type={typeof value === "number" ? "number" : "text"}
                      defaultValue={String(form.watch(key as string) ?? "")}
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
