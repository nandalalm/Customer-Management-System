"use client";

import { CalendarIcon, PencilIcon, MailIcon, PhoneIcon, BuildingIcon, ClockIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { formatDate, formatPhone } from "@/utils/format.utils";
import type { Customer } from "@/types";

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: () => void;
}

export function CustomerDetails({
  customer,
  onEdit,
}: CustomerDetailsProps): React.JSX.Element {
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  function handleUpdateLastContact(): void {
    updateCustomer({
      id: customer.id,
      data: {
        lastContactDate: new Date().toISOString(),
      },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={customer.status === "active" ? "default" : "secondary"}
            className="capitalize"
          >
            {customer.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            id="edit-customer-btn"
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <PencilIcon className="size-3.5" />
            Edit
          </Button>
          <Button
            id="update-last-contact-btn"
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUpdateLastContact}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              <CalendarIcon className="size-3.5" />
            )}
            Update Last Contact
          </Button>
        </div>
      </div>

      {/* Field grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <MailIcon className="size-3.5 text-primary" />
            Email Address
          </span>
          <a
            href={`mailto:${customer.email}`}
            className="text-sm font-medium text-foreground hover:underline truncate"
          >
            {customer.email}
          </a>
        </div>

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <PhoneIcon className="size-3.5 text-primary" />
            Phone Number
          </span>
          <a
            href={`tel:${customer.phone}`}
            className="text-sm font-medium text-foreground hover:underline"
          >
            {formatPhone(customer.phone)}
          </a>
        </div>

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <BuildingIcon className="size-3.5 text-primary" />
            Company
          </span>
          <span className="text-sm font-medium text-foreground">
            {customer.company}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/20 p-3">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <ClockIcon className="size-3.5 text-primary" />
            Last Contact Date
          </span>
          <span className="text-sm font-medium text-foreground">
            {customer.lastContactDate
              ? formatDate(customer.lastContactDate)
              : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}
