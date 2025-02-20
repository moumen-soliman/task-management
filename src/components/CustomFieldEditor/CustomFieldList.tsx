import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TaskStore } from "@/types/Tasks";

interface CustomFieldListProps {
  customFields: TaskStore["customFields"];
  onRemove: (id: number) => void; // Changed from string to number
}

export default function CustomFieldList({ customFields, onRemove }: CustomFieldListProps) {
  return (
    <div className="space-y-4">
      {customFields.map((field) => (
        <div key={field.id} className="flex items-center gap-4 border p-4 rounded">
          <div className="flex-1">
            <Label className="block mb-2">
              {field.name} ({field.type})
            </Label>
            <div className="text-sm text-gray-600">
              {field.type === "checkbox" ? (field.value ? "Yes" : "No") : field.value}
            </div>
          </div>
          <Button type="button" variant="destructive" size="sm" onClick={() => onRemove(field.id)}>
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
