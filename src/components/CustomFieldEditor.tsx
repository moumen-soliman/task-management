"use client";
import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSheetStore } from "@/store/useSheetStore";

export default function CustomFieldEditor() {
  const { customFields, addCustomField, removeCustomField, updateCustomField, getTaskById, updateTask } = useTaskStore();
  const {mode, taskId} = useSheetStore();
  const task = getTaskById(taskId); 
   const [isEditing, setIsEditing] = useState(false);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [fieldValue, setFieldValue] = useState<string | number | boolean>("");

  const handleAddField = () => {
      if (task && mode === "edit") {
        updateCustomField(taskId, fieldName, fieldValue);
      } else {
        addCustomField(fieldName, fieldType, fieldValue);
      }
      // Reset form
      setFieldName("");
      setFieldType("text");
      setFieldValue("");
      setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Manage Custom Fields</h2>

      {/* Toggle Add Field Button */}
      {!isEditing && (
        <Button onClick={() => setIsEditing(true)}>
          ➕ Add New Field
        </Button>
      )}

      {/* Add Custom Field Form */}
      {isEditing && (
        <div className="space-y-4 border p-4 rounded">
          <div className="flex gap-4">
            <Input
              placeholder="Field Name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <Select onValueChange={(value) => {
              setFieldType(value);
              setFieldValue(""); // Reset value when type changes
            }} defaultValue="text">
              <SelectTrigger>
                <SelectValue placeholder="Field Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* New Field Value Input */}
          <div className="flex gap-4 items-center">
            <Label>Field Value:</Label>
            {fieldType === 'text' ? (
              <Input
              value={String(fieldValue) || ''}
              onChange={(e) => setFieldValue(e.target.value)}
              placeholder="Enter field value"
              />
            ) : fieldType === 'number' ? (
              <Input
              type="number"
              value={Number(fieldValue) || 0}
              onChange={(e) => setFieldValue(Number(e.target.value || 0))}
              placeholder="Enter number value"
              />
            ) : fieldType === 'checkbox' ? (
              <Checkbox
              checked={Boolean(fieldValue)}
              onCheckedChange={(checked: boolean) => setFieldValue(checked)}
              />
            ) : null}
          </div>
          
          <div className="flex gap-2">
            <Button type="button" onClick={handleAddField}>Save</Button>
            <Button variant="secondary" onClick={() => {
              setIsEditing(false);
              setFieldName("");
              setFieldType("text");
              setFieldValue("");
            }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* List of Custom Fields */}
      {mode !== "edit" && <div className="space-y-4">
        {customFields.map((field) => (
          <div key={field.id} className="flex items-center gap-4 border p-4 rounded">
            <div className="flex-1">
              <Label className="block mb-2">{field.name} ({field.type})</Label>
              <div className="text-sm text-gray-600">
                {field.type === 'checkbox' ? (
                  field.value ? 'Yes' : 'No'
                ) : (
                  field.value
                )}
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => removeCustomField(field.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>}
    </div>
  );
}
