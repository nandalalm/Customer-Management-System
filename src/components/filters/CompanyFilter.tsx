"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// All company names derived from the 50-record seed data
const ALL_COMPANIES = [
  "Apex Systems",
  "Arclight Dev",
  "Axiom Data",
  "BrightScale",
  "BrightWave Tech",
  "CloudPinnacle",
  "Crestline Group",
  "EmberForge",
  "Horizon AI",
  "Ironclad Security",
  "Lunar Logic",
  "NovaEdge",
  "PeakFlow Tech",
  "Pulse Analytics",
  "QuantumReach",
  "Silverline SaaS",
  "Stratosphere Inc",
  "SwiftCurrent",
  "TechVault",
  "Tidal Software",
  "Vortex Labs",
  "Zenith Cloud",
];

interface CompanyFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CompanyFilter({
  value,
  onChange,
}: CompanyFilterProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  }

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const filtered = useMemo(
    () =>
      ALL_COMPANIES.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  function toggle(company: string): void {
    if (value.includes(company)) {
      onChange(value.filter((c) => c !== company));
    } else {
      onChange([...value, company]);
    }
  }

  function clearAll(): void {
    onChange([]);
  }

  const label =
    value.length === 0
      ? "Any company"
      : value.length === 1
        ? value[0]
        : `${value.length} selected`;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      {/*
        PopoverTrigger is a Base UI component that renders a native <button>.
        It does not support asChild — we style it directly with className.
      */}
      <PopoverTrigger
        id="company-filter-trigger"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="truncate">{label}</span>
        <div className="flex items-center gap-1 shrink-0">
          {value.length > 0 && (
            <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-xs">
              {value.length}
            </Badge>
          )}
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="start">
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <SearchIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            id="company-filter-search"
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Company list */}
        <div className="max-h-56 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              No companies found
            </p>
          ) : (
            filtered.map((company) => {
              const selected = value.includes(company);
              return (
                <button
                  key={company}
                  type="button"
                  id={`company-option-${company.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => toggle(company)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border"
                    }`}
                  >
                    {selected && <CheckIcon className="size-3" />}
                  </span>
                  <span className="truncate">{company}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        {value.length > 0 && (
          <div className="border-t border-border px-3 py-2">
            <button
              type="button"
              id="company-filter-clear"
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
