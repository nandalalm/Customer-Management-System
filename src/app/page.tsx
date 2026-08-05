"use client";

import { useCallback, useState, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { PageLayout } from "@/components/layout/PageLayout";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";

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
  function handleView(): void {}
  function handleEdit(): void {}
  function handleDelete(): void {}

  return (
    <Suspense fallback={<LoadingSkeleton rows={10} />}>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header onAddCustomer={() => {}} />
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
      </div>
    </Suspense>
  );
}
