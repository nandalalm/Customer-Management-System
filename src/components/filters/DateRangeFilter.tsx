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

function DatePicker({
  id,
  label,
  value,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  // Prevents selecting dates outside the paired picker's selection
  disabled?: (date: Date) => boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;

  function handleSelect(date: Date | undefined): void {
    if (date) {
      // Store as YYYY-MM-DD (local date string, no timezone shift)
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      onChange(iso);
    } else {
      onChange("");
    }
    setOpen(false);
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          {/*
            PopoverTrigger is Base UI — it renders a native <button> with no
            asChild support. We style it inline as a button-like affordance.
          */}
          <PopoverTrigger
            id={id}
            className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
            {selected ? (
              <span>{format(selected, "MMM d, yyyy")}</span>
            ) : (
              <span className="text-muted-foreground">Pick a date</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/*
              react-day-picker v9 removed initialFocus — focus is now managed
              automatically via the modifiers.focused effect in CalendarDayButton.
            */}
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
            className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon className="size-3.5" />
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
    <div className="space-y-3">
      <DatePicker
        id="date-filter-from"
        label="From"
        value={dateFrom}
        onChange={onDateFromChange}
        // Prevent "from" from being set after the current "to"
        disabled={dateTo ? (date) => date > new Date(dateTo) : undefined}
      />
      <DatePicker
        id="date-filter-to"
        label="To"
        value={dateTo}
        onChange={onDateToChange}
        // Prevent "to" from being set before the current "from"
        disabled={dateFrom ? (date) => date < new Date(dateFrom) : undefined}
      />
    </div>
  );
}
