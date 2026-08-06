"use client";

import { Input } from "@/components/ui/input";

interface TextFilterProps {
  id: string;
  placeholder: string;
  value: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}

export function TextFilter({
  id,
  placeholder,
  value,
  icon,
  onChange,
}: TextFilterProps): React.JSX.Element {
  return (
    <div className="relative flex items-center">
      {icon && (
        <div className="absolute left-3 flex items-center text-muted-foreground pointer-events-none">
          {icon}
        </div>
      )}
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 text-xs border-border bg-card/60 ${icon ? "pl-8" : "pl-3"}`}
      />
    </div>
  );
}
