"use client";

import { SlidersHorizontalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusFilter } from "@/components/filters/StatusFilter";
import { CompanyFilter } from "@/components/filters/CompanyFilter";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { TextFilter } from "@/components/filters/TextFilter";
import { FilterTemplates } from "@/components/filters/FilterTemplates";
import { SavedFilters } from "@/components/filters/SavedFilters";
import { useFilters } from "@/hooks/useFilters";

export function FilterSidebar(): React.JSX.Element {
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="rounded-full px-1.5 py-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            id="clear-all-filters"
            type="button"
            onClick={clearFilters}
            aria-label="Clear all filters"
            className="flex items-center gap-1 rounded text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Filter sections */}
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {/* Presets & Saved */}
        <FilterTemplates />
        <Separator />
        <SavedFilters />
        <Separator />

        {/* Status */}
        <section aria-labelledby="filter-section-status">
          <h3
            id="filter-section-status"
            className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Status
          </h3>
          <StatusFilter
            value={filters.status ?? []}
            onChange={setStatus}
          />
        </section>

        <Separator />

        {/* Company */}
        <section aria-labelledby="filter-section-company">
          <h3
            id="filter-section-company"
            className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Company
          </h3>
          <CompanyFilter
            value={filters.company ?? []}
            onChange={setCompany}
          />
        </section>

        <Separator />

        {/* Last Contact Date */}
        <section aria-labelledby="filter-section-date">
          <h3
            id="filter-section-date"
            className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Last Contact Date
          </h3>
          <DateRangeFilter
            dateFrom={filters.dateFrom ?? ""}
            dateTo={filters.dateTo ?? ""}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />
        </section>

        <Separator />

        {/* Email */}
        <section aria-labelledby="filter-section-email">
          <h3
            id="filter-section-email"
            className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email
          </h3>
          <TextFilter
            id="email-filter-input"
            label="Contains"
            placeholder="e.g. @techvault.com"
            value={filters.email ?? ""}
            onChange={setEmail}
          />
        </section>

        <Separator />

        {/* Phone */}
        <section aria-labelledby="filter-section-phone">
          <h3
            id="filter-section-phone"
            className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Phone
          </h3>
          <TextFilter
            id="phone-filter-input"
            label="Contains"
            placeholder="e.g. 212"
            value={filters.phone ?? ""}
            onChange={setPhone}
          />
        </section>
      </div>

      {/* Footer — Apply button (filters apply immediately via URL, but this is a
          clear affordance for mobile users closing the Sheet) */}
      <Separator />
      <div className="px-4 py-3">
        <Button
          id="apply-filters-btn"
          className="w-full"
          size="sm"
          disabled={activeFilterCount === 0}
          onClick={() => {
            // Filters are already applied via nuqs URL state; this button is
            // primarily a visual anchor for mobile users dismissing the sheet.
          }}
        >
          {activeFilterCount > 0
            ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied`
            : "No filters applied"}
        </Button>
      </div>
    </div>
  );
}
