"use client";

import { useState } from "react";
import {
  CalendarIcon,
  PencilIcon,
  Trash2Icon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  ClockIcon,
  Loader2Icon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { formatDate, formatPhone } from "@/utils/format.utils";
import type { Customer } from "@/types";

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: () => void;
  onDelete?: () => void;
}

export function CustomerDetails({
  customer,
  onEdit,
  onDelete,
}: CustomerDetailsProps): React.JSX.Element {
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null);

  function handleUpdateLastContact(): void {
    updateCustomer({
      id: customer.id,
      data: {
        lastContactDate: new Date().toISOString(),
      },
    });
  }

  function handleCopy(text: string, field: "email" | "phone"): void {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field === "email" ? "Email" : "Phone number"} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  }

  const statusBadge =
    customer.status === "active" ? (
      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
        Inactive
      </Badge>
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Top action bar */}
      <div className="flex flex-col gap-3 border-b border-border pb-4">
        {/* Status + Edit Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Status:</span>
            {statusBadge}
          </div>

          <Button
            id="edit-customer-btn"
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 text-xs gap-1.5"
          >
            <PencilIcon className="size-3.5" />
            Edit
          </Button>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 w-full">
          <Button
            id="update-last-contact-btn"
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleUpdateLastContact}
            disabled={isPending}
            className="flex-1 h-8 text-xs gap-1.5 justify-center min-w-0"
          >
            {isPending ? (
              <Loader2Icon className="size-3.5 animate-spin shrink-0" />
            ) : (
              <CalendarIcon className="size-3.5 shrink-0" />
            )}
            <span className="truncate">Update Last Contact</span>
          </Button>

          {onDelete && (
            <Button
              id="delete-customer-details-btn"
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
              className="h-8 text-xs gap-1.5 justify-center shrink-0 min-[470px]:px-3 px-2.5"
              aria-label="Delete customer"
            >
              <Trash2Icon className="size-3.5 shrink-0" />
              <span className="hidden min-[470px]:inline">Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Field cards grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* Email Address — Full width so long emails never truncate */}
        <div className="sm:col-span-2 flex flex-col gap-1.5 rounded-lg border border-border bg-card/60 p-3.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
              <MailIcon className="size-3.5 text-primary" />
              Email Address
            </span>
            <button
              type="button"
              onClick={() => handleCopy(customer.email, "email")}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
              title="Copy Email"
            >
              {copiedField === "email" ? (
                <CheckIcon className="size-3.5 text-emerald-500" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
            </button>
          </div>
          <a
            href={`mailto:${customer.email}`}
            title={customer.email}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors break-all select-all"
          >
            {customer.email}
          </a>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card/60 p-3.5 transition-colors hover:bg-muted/40">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
              <PhoneIcon className="size-3.5 text-primary" />
              Phone Number
            </span>
            <button
              type="button"
              onClick={() => handleCopy(customer.phone, "phone")}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
              title="Copy Phone Number"
            >
              {copiedField === "phone" ? (
                <CheckIcon className="size-3.5 text-emerald-500" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
            </button>
          </div>
          <a
            href={`tel:${customer.phone}`}
            className="text-sm font-medium text-foreground hover:text-primary transition-colors select-all"
          >
            {formatPhone(customer.phone)}
          </a>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card/60 p-3.5 transition-colors hover:bg-muted/40">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
            <BuildingIcon className="size-3.5 text-primary" />
            Company
          </span>
          <span className="text-sm font-medium text-foreground truncate" title={customer.company}>
            {customer.company}
          </span>
        </div>

        {/* Last Contact Date — Full width */}
        <div className="sm:col-span-2 flex flex-col gap-1.5 rounded-lg border border-border bg-card/60 p-3.5 transition-colors hover:bg-muted/40">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap select-none">
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
