"use client";
import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useSheetStore";
import CustomFieldForm from "./CustomFieldForm";
import CustomFieldList from "./CustomFieldList";

export default function CustomFieldEditor() {
  const { customFields, addCustomField, removeCustomField, updateCustomField, getTaskById } = useTaskStore();
  const { mode, taskId } = useSheetStore();
  const task = getTaskById(taskId); 
  const [isEditing, setIsEditing] = useState(false);

  const handleAddField = (fieldName, fieldType, fieldValue) => {
    if (task && mode === "edit") {
      updateCustomField(taskId, fieldName, fieldValue);
    } else {
      addCustomField(fieldName, fieldType, fieldValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Manage Custom Fields</h2>

      {!isEditing && (
        <Button onClick={() => setIsEditing(true)}>
          ➕ Add New Field
        </Button>
      )}

      {isEditing && (
        <CustomFieldForm 
          onSave={handleAddField} 
          onCancel={() => setIsEditing(false)} 
        />
      )}

      {mode !== "edit" && (
        <CustomFieldList 
          customFields={customFields} 
          onRemove={removeCustomField} 
        />
      )}
    </div>
  );
}
