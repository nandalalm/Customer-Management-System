"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CustomerStatus } from "@/types";

interface StatusFilterProps {
  value: CustomerStatus[];
  onChange: (value: CustomerStatus[]) => void;
}

const OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
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
    <div className="space-y-2">
      {OPTIONS.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2.5">
          <Checkbox
            id={`status-filter-${opt.value}`}
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          />
          <Label
            htmlFor={`status-filter-${opt.value}`}
            className="cursor-pointer text-sm font-normal"
          >
            {opt.label}
          </Label>
        </div>
      ))}
    </div>
  );
}
