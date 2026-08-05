"use client";

import { EyeIcon, PencilIcon, Trash2Icon, MoreHorizontalIcon, GripVerticalIcon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerAvatar } from "@/components/common/CustomerAvatar";
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
  index?: number;
  /** Whether this row participates in sortable DnD */
  isDraggable?: boolean;
  /** Whether this row is the DragOverlay ghost — skips useSortable transform */
  isDragOverlay?: boolean;
}

export function CustomerRow({
  customer,
  isSelected,
  onSelectChange,
  onView,
  onEdit,
  onDelete,
  variant = "row",
  index,
  isDraggable = false,
  isDragOverlay = false,
}: CustomerRowProps): React.JSX.Element {
  // Always call useSortable — conditionally applying its output below.
  // Hooks must not be called conditionally, so we pass a stable id regardless.
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id, disabled: !isDraggable });

  const style =
    isDraggable && !isDragOverlay
      ? {
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.4 : 1,
        }
      : undefined;

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
          <div className="flex items-center gap-2.5 min-w-0">
            <Checkbox
              id={`select-mobile-${customer.id}`}
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(checked) =>
                onSelectChange(customer.id, checked === true)
              }
              aria-label={`Select ${customer.name}`}
            />
            <CustomerAvatar name={customer.name} index={index} size="sm" />
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
      ref={isDraggable ? setNodeRef : undefined}
      style={style}
      className="border-b border-border hover:bg-muted/40 cursor-pointer transition-colors"
      onClick={() => {
        // Do not open drawer if the user just finished a drag
        if (isDragging) return;
        onView(customer);
      }}
    >
      {/* Drag handle — only rendered when sortable DnD is active */}
      {isDraggable && (
        <td
          className="w-6 px-1 py-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label={`Reorder ${customer.name}`}
            className="flex cursor-grab items-center text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-4" />
          </button>
        </td>
      )}

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
        <div className="flex items-center gap-2.5">
          <CustomerAvatar name={customer.name} index={index} size="sm" />
          <span className="text-sm font-medium">{customer.name}</span>
        </div>
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
