import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function CustomFieldForm({ onSave, onCancel }) {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [fieldValue, setFieldValue] = useState<string | number | boolean>("");

  const handleSave = () => {
    onSave(fieldName, fieldType, fieldValue);
    setFieldName("");
    setFieldType("text");
    setFieldValue("");
  };

  return (
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
        <Button type="button" onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
