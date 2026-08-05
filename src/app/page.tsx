"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { CustomerTable } from "@/components/customers/CustomerTable";
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

  // These handlers will open the drawer/dialog — stubbed until Stage 16/17
  function handleView(_customer: Customer): void {}
  function handleEdit(_customer: Customer): void {}
  function handleDelete(_customer: Customer): void {}

  const placeholderSidebar = (
    <div className="p-4 space-y-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Filters
      </p>
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-8 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header onAddCustomer={() => {}} />
      <PageLayout sidebar={placeholderSidebar}>
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
    </div>
  );
}
