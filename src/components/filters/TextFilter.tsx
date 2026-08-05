"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFilterProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextFilter({
  id,
  label,
  placeholder,
  value,
  onChange,
}: TextFilterProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
    </div>
  );
}
