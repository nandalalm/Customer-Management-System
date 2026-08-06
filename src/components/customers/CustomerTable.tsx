"use client";

import { useState, useMemo } from "react";
import { parseAsString, useQueryState, parseAsInteger } from "nuqs";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useCustomers } from "@/hooks/useCustomers";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Pagination } from "@/components/common/Pagination";
import { DraggableCustomerList } from "@/components/customers/DraggableCustomerList";
import { CustomerRow } from "@/components/customers/CustomerRow";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilters } from "@/hooks/useFilters";
import type { Customer, SortDirection, CustomerQueryParams } from "@/types";

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

const CUSTOM_ORDER_STORAGE_KEY = "customer_table_custom_order";

function getCustomOrderIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_ORDER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCustomOrderIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_ORDER_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage quota or disabled localStorage errors
  }
}

function applyStoredOrder(customers: Customer[]): Customer[] {
  const customOrderIds = getCustomOrderIds();
  if (customOrderIds.length === 0) return customers;

  const orderMap = new Map<string, number>();
  customOrderIds.forEach((id, idx) => orderMap.set(id, idx));

  return [...customers].sort((a, b) => {
    const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : -1;
    const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : -1;
    return indexA - indexB;
  });
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

  const effectiveSortBy = sortBy || "lastContactDate";
  const effectiveSortDir = sortDir || "desc";

  // Build params — spread filters and pagination/sorting
  const params: CustomerQueryParams = {
    ...filters,
    page,
    pageSize,
    field: effectiveSortBy as keyof Customer,
    direction: effectiveSortDir as SortDirection,
  };

  const { data, isLoading, isError, refetch } = useCustomers(params);

  const queryCustomers = data?.data;
  const [customOrderVersion, setCustomOrderVersion] = useState<number>(0);
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);

  // Compute ordered customers directly during render using useMemo (no useEffect setState cascade)
  const orderedCustomers = useMemo(() => {
    if (!queryCustomers) return [];
    return applyStoredOrder(queryCustomers);
    // customOrderVersion is included to recalculate order whenever drag-and-drop finishes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCustomers, customOrderVersion]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent): void {
    const found = orderedCustomers.find((c) => c.id === event.active.id);
    setActiveCustomer(found ?? null);
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    setActiveCustomer(null);

    if (!over || active.id === over.id) return;

    const oldIndex = orderedCustomers.findIndex((c) => c.id === active.id);
    const newIndex = orderedCustomers.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(orderedCustomers, oldIndex, newIndex);

    // Save reordered IDs to localStorage
    const currentStoredIds = getCustomOrderIds();
    const currentPageIds = new Set(orderedCustomers.map((c) => c.id));
    const reorderedPageIds = reordered.map((c) => c.id);

    const nonPageStoredIds = currentStoredIds.filter((id) => !currentPageIds.has(id));
    const updatedStoredIds = [...reorderedPageIds, ...nonPageStoredIds];

    saveCustomOrderIds(updatedStoredIds);
    setCustomOrderVersion((v) => v + 1);
  }

  async function handleSort(field: SortField): Promise<void> {
    if (effectiveSortBy !== field) {
      await setSortBy(field);
      await setSortDir(field === "lastContactDate" ? "desc" : "asc");
      return;
    }
    if (effectiveSortDir === "asc") {
      await setSortDir("desc");
    } else {
      await setSortDir("asc");
    }
  }

  const allPageSelected =
    orderedCustomers.length > 0 && orderedCustomers.every((c) => selectedIds.has(c.id));
  const somePageSelected =
    !allPageSelected && orderedCustomers.some((c) => selectedIds.has(c.id));

  if (isLoading) {
    return <LoadingSkeleton rows={pageSize} />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (orderedCustomers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Try adjusting your filters or add a new customer."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {/* ── Desktop table (>= 1180px) ────────────────────────────────────────────── */}
      <div className="hidden overflow-x-auto min-[1180px]:block">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {/* Drag-handle column header — no label, just reserved space */}
                <th className="w-6 px-1 py-2.5" aria-hidden="true" />

                {/* Select-all checkbox */}
                <th className="w-10 px-3 py-2.5">
                  <Checkbox
                    id="select-all"
                    checked={allPageSelected}
                    aria-checked={somePageSelected ? "mixed" : allPageSelected}
                    onCheckedChange={(checked) =>
                      onSelectAll(checked === true, orderedCustomers.map((c) => c.id))
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
                        activeField={effectiveSortBy}
                        direction={effectiveSortDir}
                      />
                    </button>
                  </th>
                ))}

                {/* Actions column — not sortable */}
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>

            <DraggableCustomerList
              customers={orderedCustomers}
              selectedIds={selectedIds}
              onSelectChange={onSelectChange}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </table>

          {/* DragOverlay ghost row — rendered outside <table> element */}
          <DragOverlay>
            {activeCustomer ? (
              <table style={{ width: "100%" }}>
                <tbody>
                  <CustomerRow
                    variant="row"
                    customer={activeCustomer}
                    isSelected={selectedIds.has(activeCustomer.id)}
                    onSelectChange={() => undefined}
                    onView={() => undefined}
                    onEdit={() => undefined}
                    onDelete={() => undefined}
                    isDragOverlay
                  />
                </tbody>
              </table>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* ── Card list (< 1180px) ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 min-[1180px]:hidden">
        {orderedCustomers.map((customer) => (
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
