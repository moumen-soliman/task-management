import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DropdownFilterProps<T> {
  label: string;
  options: T[];
  placeholder?: string;
  value: T | null;
  onChange: (value: T | null) => void;
}

export default function DropdownFilter<T extends string>({
  label,
  options,
  placeholder = "Select",
  value,
  onChange,
}: DropdownFilterProps<T>) {
  return (
    <DropdownMenu className="capitalize">
      <DropdownMenuTrigger asChild>
        <Button className="capitalize w-[150px]" variant="outline">
          {value ? value : placeholder}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onChange(null)}>{"Default"}</DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            className="capitalize cursor-pointer"
            key={option}
            onClick={() => onChange(option)}
          >
            {option.replaceAll("_", " ")}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
