"use client";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
}: MultiSelectProps) {
  return (
    <Select
      isMulti
      options={options}
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected) => onChange(selected.map((item) => item.value))}
      className="text-black my-react-select-container"
      classNamePrefix="react-select my-react-select"
      placeholder={placeholder}
    />
  );
}
