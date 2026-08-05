"use client";

import { useState } from "react";
import { BookmarkIcon, PlusIcon, Trash2Icon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSavedFilters } from "@/hooks/useSavedFilters";
import { useFilters } from "@/hooks/useFilters";
import type { SavedFilter } from "@/types";

export function SavedFilters(): React.JSX.Element {
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();
  const {
    filters,
    activeFilterCount,
    setStatus,
    setCompany,
    setDateFrom,
    setDateTo,
    setEmail,
    setPhone,
    setSearch,
  } = useFilters();

  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  function handleSave(): void {
    if (!filterName.trim()) return;
    saveFilter(filterName.trim(), filters);
    setFilterName("");
    setOpen(false);
  }

  function handleApply(saved: SavedFilter): void {
    setStatus(saved.filters.status ?? []);
    setCompany(saved.filters.company ?? []);
    setDateFrom(saved.filters.dateFrom ?? "");
    setDateTo(saved.filters.dateTo ?? "");
    setEmail(saved.filters.email ?? "");
    setPhone(saved.filters.phone ?? "");
    setSearch(saved.filters.search ?? "");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BookmarkIcon className="size-3.5" />
          <span>Saved Filters</span>
        </div>

        {activeFilterCount > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              id="save-filter-trigger"
              className="flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none"
            >
              <PlusIcon className="size-3" />
              Save current
            </PopoverTrigger>

            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-2">
                <p className="text-xs font-medium">Save Filter View</p>
                <Input
                  id="save-filter-name-input"
                  placeholder="Filter name (e.g. Active SaaS)"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  className="h-8 text-xs"
                />
                <div className="flex justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="save-filter-confirm-btn"
                    type="button"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={!filterName.trim()}
                    onClick={handleSave}
                  >
                    <CheckIcon className="size-3" />
                    Save
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {savedFilters.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No saved filters yet
        </p>
      ) : (
        <div className="space-y-1">
          {savedFilters.map((saved) => (
            <div
              key={saved.id}
              className="group flex items-center justify-between rounded-md px-2 py-1 text-xs hover:bg-accent transition-colors"
            >
              <button
                type="button"
                id={`apply-saved-filter-${saved.id}`}
                onClick={() => handleApply(saved)}
                className="truncate font-medium text-foreground hover:text-primary text-left flex-1"
              >
                {saved.name}
              </button>
              <button
                type="button"
                id={`delete-saved-filter-${saved.id}`}
                aria-label={`Delete ${saved.name}`}
                onClick={() => deleteFilter(saved.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2Icon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
