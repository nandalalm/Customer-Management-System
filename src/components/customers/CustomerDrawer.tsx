"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCustomer } from "@/hooks/useCustomer";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { CustomerNotes } from "@/components/customers/CustomerNotes";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { ErrorState } from "@/components/common/ErrorState";

export type DrawerMode = "view" | "edit" | "create";

interface CustomerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | null;
  mode: DrawerMode;
  onModeChange: (mode: DrawerMode) => void;
}

export function CustomerDrawer({
  open,
  onOpenChange,
  customerId,
  mode,
  onModeChange,
}: CustomerDrawerProps): React.JSX.Element {
  const { data, isLoading, isError, refetch } = useCustomer(
    open && mode !== "create" ? customerId : null
  );

  const customer = data?.data;

  function renderContent(): React.JSX.Element {
    if (mode === "create") {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Customer creation form will be implemented in Stage 17.
        </div>
      );
    }

    if (isLoading) {
      return <LoadingSkeleton rows={6} />;
    }

    if (isError || !customer) {
      return <ErrorState onRetry={() => refetch()} />;
    }

    if (mode === "edit") {
      return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Customer edit form for {customer.name} will be implemented in Stage 17.
        </div>
      );
    }

    // View mode
    return (
      <div className="flex flex-col gap-6 py-2">
        <CustomerDetails
          customer={customer}
          onEdit={() => onModeChange("edit")}
        />
        <CustomerNotes
          customerId={customer.id}
          initialNotes={customer.notes}
        />
      </div>
    );
  }

  function getHeaderTitle(): string {
    if (mode === "create") return "Add New Customer";
    if (mode === "edit") return customer ? `Edit ${customer.name}` : "Edit Customer";
    return customer?.name ?? "Customer Details";
  }

  function getHeaderDescription(): string {
    if (mode === "create") return "Enter customer details to add them to your account.";
    if (mode === "edit") return "Update customer details and contact preferences.";
    return customer?.company ? `Customer at ${customer.company}` : "View customer details and notes.";
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg p-6 flex flex-col gap-4">
        <SheetHeader className="px-0 pt-0 pb-2 border-b border-border">
          <SheetTitle className="text-xl font-bold text-foreground">
            {getHeaderTitle()}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {getHeaderDescription()}
          </SheetDescription>
        </SheetHeader>

        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
