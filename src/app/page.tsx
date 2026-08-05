"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { BulkActionToolbar } from "@/components/customers/BulkActionToolbar";
import {
  CustomerDrawer,
  type DrawerMode,
} from "@/components/customers/CustomerDrawer";
import { DeleteConfirmDialog } from "@/components/customers/DeleteConfirmDialog";
import { getCustomers } from "@/services/customer.service";
import { useFilters } from "@/hooks/useFilters";
import { formatDate } from "@/utils/format.utils";
import type { Customer } from "@/types";

// ── CSV helpers ───────────────────────────────────────────────────────────────

function escapeCSVCell(value: string): string {
  // Wrap in quotes if the value contains commas, quotes, or newlines
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCSV(rows: Customer[]): string {
  const headers = ["Name", "Email", "Phone", "Company", "Status", "Last Contact Date"];
  const lines = [
    headers.join(","),
    ...rows.map((c) =>
      [
        c.name,
        c.email,
        c.phone,
        c.company,
        c.status,
        formatDate(c.lastContactDate),
      ]
        .map(escapeCSVCell)
        .join(",")
    ),
  ];
  return lines.join("\n");
}

function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ── Page component ────────────────────────────────────────────────────────────

function HomeContent(): React.JSX.Element {
  const { filters } = useFilters();

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Clear selection whenever filters change to avoid stale selections
  const prevFiltersRef = useRef<string>(JSON.stringify(filters));
  useEffect(() => {
    const serialised = JSON.stringify(filters);
    if (serialised !== prevFiltersRef.current) {
      prevFiltersRef.current = serialised;
      setSelectedIds(new Set());
    }
  }, [filters]);

  const handleSelectChange = useCallback(
    (id: string, checked: boolean): void => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    },
    []
  );

  const handleSelectAll = useCallback(
    (checked: boolean, ids: string[]): void => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          ids.forEach((id) => next.add(id));
        } else {
          ids.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    []
  );

  const handleClearSelection = useCallback((): void => {
    setSelectedIds(new Set());
  }, []);

  // ── CSV export ──────────────────────────────────────────────────────────────

  const handleExportCSV = useCallback(async (): Promise<void> => {
    try {
      // Fetch all pages matching the current filters (no pagination limit)
      const allData = await getCustomers({
        ...filters,
        page: 1,
        pageSize: 10_000,
      });

      // If some rows are selected, export only those; otherwise export all
      const rows =
        selectedIds.size > 0
          ? allData.data.filter((c) => selectedIds.has(c.id))
          : allData.data;

      const timestamp = new Date()
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD
      const filename = `customers-export-${timestamp}.csv`;

      downloadCSV(buildCSV(rows), filename);
    } catch {
      // Non-critical — user will see nothing downloaded; no toast to avoid noise
    }
  }, [filters, selectedIds]);

  // ── Customer drawer ─────────────────────────────────────────────────────────

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const handleView = useCallback((customer: Customer): void => {
    setActiveCustomerId(customer.id);
    setDrawerMode("view");
    setDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((customer: Customer): void => {
    setActiveCustomerId(customer.id);
    setDrawerMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleAddCustomer = useCallback((): void => {
    setActiveCustomerId(null);
    setDrawerMode("create");
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((customer: Customer): void => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onAddCustomer={handleAddCustomer} />
      <PageLayout sidebar={<FilterSidebar />}>
        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          <BulkActionToolbar
            selectedIds={selectedIds}
            onClearSelection={handleClearSelection}
            onExportCSV={() => void handleExportCSV()}
          />
          <CustomerTable
            selectedIds={selectedIds}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </PageLayout>
      <CustomerDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        customerId={activeCustomerId}
        mode={drawerMode}
        onModeChange={setDrawerMode}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customer={customerToDelete}
        onSuccess={() => {
          if (customerToDelete?.id === activeCustomerId) {
            setDrawerOpen(false);
          }
        }}
      />
    </div>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Suspense fallback={<LoadingSkeleton rows={10} />}>
      <HomeContent />
    </Suspense>
  );
}
