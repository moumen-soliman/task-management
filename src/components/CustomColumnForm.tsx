import React, { useState } from "react";
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

const CustomColumnForm: React.FC = () => {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [type, setType] = useState("text");
  const [defaultValue, setDefaultValue] = useState("");
  const { addCustomColumn } = useTaskStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomColumn({ label, key, type, defaultValue });
    setLabel("");
    setKey("");
    setType("text");
    setDefaultValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md"
    >
      <Input
        type="text"
        placeholder="Field Name (Column Label)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
      <Select value={type} onValueChange={setType}>
        <SelectTrigger>
          <SelectValue placeholder="Select Field Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="checkbox">Checkbox</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Default Value (Optional)"
        value={defaultValue}
        onChange={(e) => setDefaultValue(e.target.value)}
      />
      <Button type="submit" className="w-full">
        Add Field
      </Button>
    </form>
  );
};

export default CustomColumnForm;
