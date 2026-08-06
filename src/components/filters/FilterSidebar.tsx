"use client";

import { useState, useEffect } from "react";
import { XIcon, SearchIcon, AtSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusFilter } from "@/components/filters/StatusFilter";
import { CompanyFilter } from "@/components/filters/CompanyFilter";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { TextFilter } from "@/components/filters/TextFilter";
import { SaveFilterButton, SavedFilters } from "@/components/filters/SavedFilters";
import { useFilters } from "@/hooks/useFilters";
import { useSavedFilters } from "@/hooks/useSavedFilters";
import type { CustomerStatus, FilterState, SavedFilter } from "@/types";

// Local draft type mirrors the sidebar fields (excludes search/page/sort)
interface DraftFilters {
  status: CustomerStatus[];
  company: string[];
  dateFrom: string;
  dateTo: string;
  phone: string;
  email: string;
}

function filtersToDraft(filters: FilterState): DraftFilters {
  return {
    status: filters.status ?? [],
    company: filters.company ?? [],
    dateFrom: filters.dateFrom ?? "",
    dateTo: filters.dateTo ?? "",
    phone: filters.phone ?? "",
    email: filters.email ?? "",
  };
}

interface FilterSidebarProps {
  onClose?: () => void;
}

export function FilterSidebar({ onClose }: FilterSidebarProps): React.JSX.Element {
  const {
    filters,
    setStatus,
    setCompany,
    setDateFrom,
    setDateTo,
    setEmail,
    setPhone,
    activeFilterCount,
    clearFilters,
  } = useFilters();

  // Single source of truth for saved filters — owned here so SaveFilterButton
  // and SavedFilters share the same state instance and stay in sync.
  const { savedFilters, saveFilter, deleteFilter, reorderFilters } = useSavedFilters();

  // Local draft — inputs write here; URL is only updated on Apply
  const [draft, setDraft] = useState<DraftFilters>(() => filtersToDraft(filters));

  // Which saved filter preset is currently active (applied)
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | null>(null);

  // Keep draft in sync when URL params change externally
  // (e.g. browser back/forward, or saved filter applied from elsewhere)
  useEffect(() => {
    setDraft(filtersToDraft(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const draftActiveCount =
    (draft.status.length > 0 ? 1 : 0) +
    (draft.company.length > 0 ? 1 : 0) +
    (draft.dateFrom ? 1 : 0) +
    (draft.dateTo ? 1 : 0) +
    (draft.email ? 1 : 0) +
    (draft.phone ? 1 : 0);

  function handleApply(): void {
    setStatus(draft.status);
    setCompany(draft.company);
    setDateFrom(draft.dateFrom);
    setDateTo(draft.dateTo);
    setEmail(draft.email);
    setPhone(draft.phone);
    setActiveSavedFilterId(null); // manual apply clears any active saved preset
    if (onClose) onClose();
  }

  function handleClearAll(): void {
    const empty: DraftFilters = {
      status: [],
      company: [],
      dateFrom: "",
      dateTo: "",
      phone: "",
      email: "",
    };
    setDraft(empty);
    setActiveSavedFilterId(null);
    clearFilters();
  }

  // Called when user clicks a saved filter row — populate draft and commit
  function handleApplySavedFilter(saved: SavedFilter): void {
    const next: DraftFilters = {
      status: saved.filters.status ?? [],
      company: saved.filters.company ?? [],
      dateFrom: saved.filters.dateFrom ?? "",
      dateTo: saved.filters.dateTo ?? "",
      phone: saved.filters.phone ?? "",
      email: saved.filters.email ?? "",
    };
    setDraft(next);
    setActiveSavedFilterId(saved.id);
    setStatus(next.status);
    setCompany(next.company);
    setDateFrom(next.dateFrom);
    setDateTo(next.dateTo);
    setEmail(next.email);
    setPhone(next.phone);
  }

  // Compute whether draft has unapplied changes compared to currently applied filters
  const isDraftEqual =
    JSON.stringify({
      status: draft.status.slice().sort().join(","),
      company: draft.company.slice().sort().join(","),
      dateFrom: draft.dateFrom,
      dateTo: draft.dateTo,
      phone: draft.phone,
      email: draft.email,
    }) ===
    JSON.stringify({
      status: (filters.status ?? []).slice().sort().join(","),
      company: (filters.company ?? []).slice().sort().join(","),
      dateFrom: filters.dateFrom ?? "",
      dateTo: filters.dateTo ?? "",
      phone: filters.phone ?? "",
      email: filters.email ?? "",
    });

  const canApply = !isDraftEqual;

  return (
    <div className="flex h-full flex-col bg-background/95 text-foreground px-4 py-4 space-y-4 overflow-y-auto">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-1">
        <h2 className="text-lg font-bold text-foreground tracking-tight">Filters</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      {/* 2. Save Filter top button */}
      <SaveFilterButton
        filters={filters}
        hasActiveFilters={activeFilterCount > 0}
        onSave={saveFilter}
      />

      {/* 3. Status section with Clear All */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Status</h3>
          {draftActiveCount > 0 && (
            <button
              id="clear-all-filters"
              type="button"
              onClick={handleClearAll}
              aria-label="Clear all filters"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <StatusFilter
          value={draft.status}
          onChange={(v) => setDraft((d) => ({ ...d, status: v }))}
        />
      </div>

      {/* 4. Company section */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-sm font-semibold text-foreground">Company</h3>
        <CompanyFilter
          value={draft.company}
          onChange={(v) => setDraft((d) => ({ ...d, company: v }))}
        />
      </div>

      {/* 5. Date Range (Last Contact) section */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-sm font-semibold text-foreground">Date Range (Last Contact)</h3>
        <DateRangeFilter
          dateFrom={draft.dateFrom}
          dateTo={draft.dateTo}
          onDateFromChange={(v) => setDraft((d) => ({ ...d, dateFrom: v }))}
          onDateToChange={(v) => setDraft((d) => ({ ...d, dateTo: v }))}
        />
      </div>

      {/* 6. Phone Number section */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-sm font-semibold text-foreground">Phone Number</h3>
        <TextFilter
          id="phone-filter-input"
          placeholder="(555) 123-4567"
          value={draft.phone}
          icon={<SearchIcon className="size-3.5" />}
          onChange={(v) => setDraft((d) => ({ ...d, phone: v }))}
        />
      </div>

      {/* 7. Email Contains section */}
      <div className="space-y-1.5 pt-1">
        <h3 className="text-sm font-semibold text-foreground">Email Contains</h3>
        <TextFilter
          id="email-filter-input"
          placeholder="e.g., @gmail.com"
          value={draft.email}
          icon={<AtSignIcon className="size-3.5" />}
          onChange={(v) => setDraft((d) => ({ ...d, email: v }))}
        />
      </div>

      {/* 8. Apply Filters button */}
      <div className="pt-2">
        <Button
          id="apply-filters-btn"
          disabled={!canApply}
          size="lg"
          className={`w-full transition-all duration-200 ${
            canApply
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
              : "bg-secondary/70 text-muted-foreground/60 cursor-not-allowed opacity-70 pointer-events-none"
          }`}
          onClick={handleApply}
        >
          Apply Filters
          {canApply && draftActiveCount > 0 && (
            <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-semibold tabular-nums">
              {draftActiveCount}
            </span>
          )}
        </Button>
      </div>

      {/* 9. Saved Filters list */}
      <SavedFilters
        savedFilters={savedFilters}
        activeSavedFilterId={activeSavedFilterId}
        onApply={handleApplySavedFilter}
        onDelete={deleteFilter}
        onReorder={reorderFilters}
        onDeactivate={handleClearAll}
      />
    </div>
  );
}
