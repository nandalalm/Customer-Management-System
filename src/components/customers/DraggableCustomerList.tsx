"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CustomerRow } from "@/components/customers/CustomerRow";
import type { Customer } from "@/types";

interface DraggableCustomerListProps {
  customers: Customer[];
  selectedIds: Set<string>;
  onSelectChange: (id: string, checked: boolean) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function DraggableCustomerList({
  customers,
  selectedIds,
  onSelectChange,
  onView,
  onEdit,
  onDelete,
}: DraggableCustomerListProps): React.JSX.Element {
  return (
    <SortableContext
      items={customers.map((c) => c.id)}
      strategy={verticalListSortingStrategy}
    >
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
            isDraggable
          />
        ))}
      </tbody>
    </SortableContext>
  );
}
