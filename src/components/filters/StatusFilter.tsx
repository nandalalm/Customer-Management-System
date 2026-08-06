"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CustomerStatus } from "@/types";

interface StatusFilterProps {
  value: CustomerStatus[];
  onChange: (value: CustomerStatus[]) => void;
}

const OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "active", label: "Active Customer" },
  { value: "inactive", label: "Inactive Customer" },
];

export function StatusFilter({
  value,
  onChange,
}: StatusFilterProps): React.JSX.Element {
  function toggle(status: CustomerStatus): void {
    if (value.includes(status)) {
      onChange(value.filter((s) => s !== status));
    } else {
      onChange([...value, status]);
    }
  }

  return (
    <div className="space-y-2.5">
      {OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2.5">
          <Checkbox
            id={`status-filter-${opt.value}`}
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            className="size-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor={`status-filter-${opt.value}`}
            className="cursor-pointer text-sm font-normal text-foreground/90 select-none"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
