"use client";

import { useCallback, useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import {
  CustomerDrawer,
  type DrawerMode,
} from "@/components/customers/CustomerDrawer";
import { DeleteConfirmDialog } from "@/components/customers/DeleteConfirmDialog";
import type { Customer } from "@/types";

export default function Home(): React.JSX.Element {
  // Bulk selection state — lives here so it can be cleared on page/filter change in Stage 19
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Customer drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("view");
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);

  // Delete dialog state
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
    <Suspense fallback={<LoadingSkeleton rows={10} />}>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header onAddCustomer={handleAddCustomer} />
        <PageLayout sidebar={<FilterSidebar />}>
          <div className="flex flex-1 flex-col p-3 sm:p-4">
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
            // If the deleted customer was open in the drawer, close it
            if (customerToDelete?.id === activeCustomerId) {
              setDrawerOpen(false);
            }
          }}
        />
      </div>
    </Suspense>
  );
}
