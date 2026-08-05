"use client";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDeleteCustomer } from "@/hooks/useDeleteCustomer";
import type { Customer } from "@/types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSuccess?: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: DeleteConfirmDialogProps): React.JSX.Element {
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  function handleConfirm(): void {
    if (!customer) return;
    deleteCustomer(customer.id, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Customer"
      description={
        customer
          ? `Are you sure you want to delete ${customer.name}? This action cannot be undone.`
          : "Are you sure you want to delete this customer?"
      }
      confirmLabel="Delete"
      isPending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
