"use client";

import { EyeIcon, PencilIcon, Trash2Icon, MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatPhone } from "@/utils/format.utils";
import type { Customer } from "@/types";

interface CustomerRowProps {
  customer: Customer;
  isSelected: boolean;
  onSelectChange: (id: string, checked: boolean) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  variant?: "row" | "card";
}

export function CustomerRow({
  customer,
  isSelected,
  onSelectChange,
  onView,
  onEdit,
  onDelete,
  variant = "row",
}: CustomerRowProps): React.JSX.Element {
  const statusBadge =
    customer.status === "active" ? (
      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );

  const actions = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            id={`row-actions-${customer.id}`}
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${customer.name}`}
          />
        }
        // Prevent click from bubbling to the row's onClick (open drawer)
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => onView(customer)}>
          <EyeIcon className="size-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(customer)}>
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(customer)}
        >
          <Trash2Icon className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ── Mobile card view ────────────────────────────────────────────────────────
  if (variant === "card") {
    return (
      <div
        className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
        onClick={() => onView(customer)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onView(customer)}
        aria-label={`View ${customer.name}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              id={`select-mobile-${customer.id}`}
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) =>
                onSelectChange(customer.id, checked === true)
              }
              aria-label={`Select ${customer.name}`}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{customer.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {customer.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {statusBadge}
            {actions}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
          <span className="truncate">{customer.email}</span>
          <span className="truncate">{formatPhone(customer.phone)}</span>
          <span className="col-span-2 text-right">
            Last contact: {formatDate(customer.lastContactDate)}
          </span>
        </div>
      </div>
    );
  }

  // ── Desktop table row view ──────────────────────────────────────────────────
  return (
    <tr
      className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors"
      onClick={() => onView(customer)}
    >
      {/* Checkbox */}
      <td className="w-10 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          id={`select-${customer.id}`}
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelectChange(customer.id, checked === true)
          }
          aria-label={`Select ${customer.name}`}
        />
      </td>

      {/* Name */}
      <td className="px-3 py-2.5">
        <span className="text-sm font-medium">{customer.name}</span>
      </td>

      {/* Email */}
      <td className="px-3 py-2.5 text-sm text-muted-foreground">
        {customer.email}
      </td>

      {/* Phone */}
      <td className="px-3 py-2.5 text-sm text-muted-foreground">
        {formatPhone(customer.phone)}
      </td>

      {/* Company */}
      <td className="px-3 py-2.5 text-sm text-muted-foreground">
        {customer.company}
      </td>

      {/* Status */}
      <td className="px-3 py-2.5">{statusBadge}</td>

      {/* Last Contact */}
      <td className="px-3 py-2.5 text-sm text-muted-foreground">
        {formatDate(customer.lastContactDate)}
      </td>

      {/* Actions */}
      <td className="w-10 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
        {actions}
      </td>
    </tr>
  );
}
