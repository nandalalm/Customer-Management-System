"use client";

import { Input } from "@/components/ui/input";

interface TextFilterProps {
  id: string;
  placeholder: string;
  value: string;
  icon?: React.ReactNode;
  onlyNumbers?: boolean;
  onChange: (value: string) => void;
}

export function TextFilter({
  id,
  placeholder,
  value,
  icon,
  onlyNumbers = false,
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
        type={onlyNumbers ? "tel" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = onlyNumbers ? e.target.value.replace(/[^0-9+ -]/g, "") : e.target.value;
          onChange(val);
        }}
        className={`h-9 text-xs border-border bg-card/60 ${icon ? "pl-8" : "pl-3"}`}
      />
    </div>
  );
}

