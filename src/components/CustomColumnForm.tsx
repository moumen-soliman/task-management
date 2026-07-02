import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "./ui/form";
import { NativeDelete } from "./ui/native-delete";
import { Label } from "./ui/label";

const schema = z.object({
  label: z.string().min(1, "Field Name is required"),
  key: z.string().min(1, "Key is required"),
  type: z.enum(["text", "number", "checkbox"]),
  defaultValue: z
    .union([z.string(), z.number(), z.boolean()])
    .transform((val) => {
      if (typeof val === "string" && val.match(/^\d+$/)) {
        return Number(val);
      }
      return val;
    })
    .refine((value) => value !== undefined && value !== null && value !== "", {
      message: "Default value is required",
    }),
});

export default function CustomColumnForm() {
  const { addCustomColumn, customColumns, removeCustomColumn, updateCustomColumnFilter } =
    useTaskStore();
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      key: "",
      type: "text" as "text" | "number" | "checkbox",
      defaultValue: "" as string | number | boolean,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = methods;
  const type = watch("type");

  const onSubmit = (data: {
    label: string;
    key: string;
    type: "text" | "number" | "checkbox";
    defaultValue: string | number | boolean;
  }) => {
    if (customColumns.some((column) => column.key === data.key)) {
      methods.setError("key", {
        type: "manual",
        message: "A column with this key already exists",
      });
      return;
    }
    addCustomColumn({
      name: data.label,
      key: data.key,
      type: data.type,
      value: data.type === "checkbox" ? Boolean(!!data.defaultValue) : String(data.defaultValue),
    });
    reset();
  };

  return (
    <div className="flex flex-col gap-3">
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md"
      >
        <div className="space-y-2">
          <Input
            placeholder="Field Name"
            {...register("label")}
            required
            onChange={(e) => {
              setValue("label", e.target.value);
              setValue("key", e.target.value.toLowerCase().replace(/\s/g, "_"));
            }}
          />
          {errors.label && <FormMessage>{errors.label.message}</FormMessage>}
        </div>

        <div className="space-y-2">
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Field Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
        </div>

        <div className="space-y-2">
          {type === "text" && (
            <Input placeholder="Default Value" {...register("defaultValue")} required />
          )}
          {type === "number" && (
            <Input
              type="number"
              placeholder="Default Value"
              {...register("defaultValue", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              required
            />
          )}
          {type === "checkbox" && (
            <Controller
              name="defaultValue"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} required />
                  <span className="text-sm">Default Value</span>
                </div>
              )}
            />
          )}
          {errors.defaultValue && <FormMessage>{errors.defaultValue.message}</FormMessage>}
        </div>
        <FormMessage>{errors.key?.message}</FormMessage>
        <span className="text-xs text-center">Changes will apply on all tasks</span>
        <Button type="submit" className="w-full">
          Add Field
        </Button>
      </form>
    </FormProvider>

      {customColumns.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg border p-2">
          <span className="px-1 pb-1 text-xs font-medium text-muted-foreground">Manage fields</span>
          {customColumns.map((column, index) => (
            <div
              key={`${column.key}-${index}`}
              className="flex items-center justify-between gap-2 rounded-md px-1 py-1 hover:bg-muted/60"
            >
              <span className="truncate text-sm">{column.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <Label
                  htmlFor={`filter-${column.key}`}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Checkbox
                    id={`filter-${column.key}`}
                    checked={column.filter || false}
                    onCheckedChange={(checked) =>
                      updateCustomColumnFilter(column.key, checked as boolean)
                    }
                  />
                  Filter
                </Label>
                <NativeDelete
                  size="sm"
                  showIcon={false}
                  onDelete={() => removeCustomColumn(column.key)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
