"use client";

import { parseAsString, useQueryState } from "nuqs";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { CustomerRow } from "@/components/customers/CustomerRow";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilters } from "@/hooks/useFilters";
import type { Customer, SortDirection, CustomerQueryParams } from "@/types";
import { parseAsInteger } from "nuqs";

interface CustomerTableProps {
  selectedIds: Set<string>;
  onSelectChange: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean, ids: string[]) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

type SortField = "name" | "email" | "phone" | "company" | "status" | "lastContactDate";

const COLUMNS: { key: SortField; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "status", label: "Status" },
  { key: "lastContactDate", label: "Last Contact" },
];

function SortIcon({
  field,
  activeField,
  direction,
}: {
  field: SortField;
  activeField: string | null;
  direction: string | null;
}): React.JSX.Element {
  if (activeField !== field) {
    return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/50" />;
  }
  if (direction === "asc") {
    return <ChevronUpIcon className="size-3.5 text-foreground" />;
  }
  return <ChevronDownIcon className="size-3.5 text-foreground" />;
}

export function CustomerTable({
  selectedIds,
  onSelectChange,
  onSelectAll,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps): React.JSX.Element {
  const { filters } = useFilters();
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString);
  const [sortDir, setSortDir] = useQueryState("sortDir", parseAsString);
  const [page] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  // Build params — spread filters and pagination/sorting
  const params: CustomerQueryParams = {
    ...filters,
    page,
    pageSize,
    ...(sortBy
      ? { field: sortBy as keyof Customer, direction: (sortDir ?? "asc") as SortDirection }
      : {}),
  };

  const { data, isLoading, isError, refetch } = useCustomers(params);

  async function handleSort(field: SortField): Promise<void> {
    if (sortBy !== field) {
      // New column — always start ascending
      await setSortBy(field);
      await setSortDir("asc");
      return;
    }
    // Same column: asc → desc → unsorted
    if (sortDir === "asc") {
      await setSortDir("desc");
    } else {
      await setSortBy(null);
      await setSortDir(null);
    }
  }

  const customers = data?.data ?? [];
  const allPageSelected =
    customers.length > 0 && customers.every((c) => selectedIds.has(c.id));
  const somePageSelected =
    !allPageSelected && customers.some((c) => selectedIds.has(c.id));

  if (isLoading) {
    return <LoadingSkeleton rows={pageSize} />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Try adjusting your filters or add a new customer."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Desktop table ─────────────────────────────────────────────────────── */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {/* Select-all checkbox */}
              <th className="w-10 px-3 py-2.5">
                <Checkbox
                  id="select-all"
                  checked={allPageSelected}
                  // indeterminate not directly in shadcn — convey via aria
                  aria-checked={somePageSelected ? "mixed" : allPageSelected}
                  onCheckedChange={(checked) =>
                    onSelectAll(checked === true, customers.map((c) => c.id))
                  }
                  aria-label="Select all on this page"
                />
              </th>

              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-2.5">
                  <button
                    id={`sort-${col.key}`}
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                    <SortIcon
                      field={col.key}
                      activeField={sortBy}
                      direction={sortDir}
                    />
                  </button>
                </th>
              ))}

              {/* Actions column — not sortable */}
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <CustomerRow
                key={customer.id}
                variant="row"
                customer={customer}
                isSelected={selectedIds.has(customer.id)}
                onSelectChange={onSelectChange}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {customers.map((customer) => (
          <CustomerRow
            key={`card-${customer.id}`}
            variant="card"
            customer={customer}
            isSelected={selectedIds.has(customer.id)}
            onSelectChange={onSelectChange}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <Pagination totalPages={data?.totalPages ?? 1} total={data?.total ?? 0} />
    </div>
  );
}
