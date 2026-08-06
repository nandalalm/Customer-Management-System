"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

function DatePickerInput({
  id,
  label,
  value,
  placeholder,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: (date: Date) => boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  function handleSelect(date: Date | undefined): void {
    if (date) {
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      onChange(iso);
    } else {
      onChange("");
    }
    setOpen(false);
  }

  return (
    <div className="flex-1 space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground font-normal">
        {label}
      </Label>
      <div className="relative flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            id={id}
            className="flex w-full items-center gap-2 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
            {selected ? (
              <span className="truncate text-foreground font-medium">
                {format(selected, "dd-MM-yyyy")}
              </span>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>

        {value && (
          <button
            type="button"
            aria-label={`Clear ${label.toLowerCase()}`}
            onClick={() => onChange("")}
            className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangeFilterProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <DatePickerInput
        id="date-filter-from"
        label="From"
        placeholder="dd-mm-yyyy"
        value={dateFrom}
        onChange={onDateFromChange}
        disabled={dateTo ? (date) => date > new Date(dateTo) : undefined}
      />
      <DatePickerInput
        id="date-filter-to"
        label="To"
        placeholder="dd-mm-yyyy"
        value={dateTo}
        onChange={onDateToChange}
        disabled={dateFrom ? (date) => date < new Date(dateFrom) : undefined}
      />
    </div>
  );
}
