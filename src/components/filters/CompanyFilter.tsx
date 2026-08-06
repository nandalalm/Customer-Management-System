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

const ALL_COMPANIES = [
  "Acme Corp",
  "Innovatech",
  "Globex",
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
  "Pulse Analytics",
  "Stratosphere Inc",
  "SwiftCurrent",
  "TechVault",
  "Vortex Labs",
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

  function removeCompany(company: string, e: React.MouseEvent): void {
    e.stopPropagation();
    onChange(value.filter((c) => c !== company));
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id="company-filter-trigger"
        aria-expanded={open}
        render={<div />}
        nativeButton={false}
        className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-2 text-sm shadow-xs transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
      >
        {value.length === 0 ? (
          <span className="text-muted-foreground text-xs">Add...</span>
        ) : (
          value.map((company) => (
            <Badge
              key={company}
              variant="secondary"
              className="flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-xs font-normal text-foreground border border-border/50"
            >
              {company}
              <button
                type="button"
                onClick={(e) => removeCompany(company, e)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))
        )}

        <div className="ml-auto flex items-center shrink-0">
          <ChevronDownIcon
            className={`size-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="start">
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
      </PopoverContent>
    </Popover>
  );
}
