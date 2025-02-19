"use client";
import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheetStore";
import CustomFieldForm from "./CustomFieldForm";
import CustomFieldList from "./CustomFieldList";

export default function CustomFieldEditor() {
  const customFields = useTaskStore((state) => state.customFields);
  const addCustomField = useTaskStore((state) => state.addCustomField);
  const removeCustomField = useTaskStore((state) => state.removeCustomField);
  const updateCustomField = useTaskStore((state) => state.updateCustomField);
  const getTaskById = useTaskStore((state) => state.getTaskById);
  const mode = useSheetStore((state) => state.mode);
  const taskId = useSheetStore((state) => state.taskId);

  const task = taskId !== null ? getTaskById(taskId) : null;
  const [isEditing, setIsEditing] = useState(false);

  const handleAddField = (fieldName: string, fieldType: string, fieldValue: any) => {
    if (task && mode === "edit") {
      // @ts-ignore-next-line
      updateCustomField(taskId, fieldName, fieldValue);
    } else {
      // @ts-ignore-next-line
      addCustomField(fieldName, fieldType, fieldValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Manage Custom Fields</h2>

      {!isEditing && <Button onClick={() => setIsEditing(true)}>➕ Add New Field</Button>}

      {isEditing && (
        <CustomFieldForm task={task} onSave={handleAddField} onCancel={() => setIsEditing(false)} />
      )}

      {mode !== "edit" && (
        <CustomFieldList customFields={customFields} onRemove={removeCustomField} />
      )}
    </div>
  );
}
