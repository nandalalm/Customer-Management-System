"use client";

import { useState } from "react";
import { Trash2Icon, CheckCircleIcon, XCircleIcon, DownloadIcon, XIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useBulkActions } from "@/hooks/useBulkActions";
import type { BulkAction } from "@/types";

interface BulkActionToolbarProps {
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onExportCSV: () => void;
}

export function BulkActionToolbar({
  selectedIds,
  onClearSelection,
  onExportCSV,
}: BulkActionToolbarProps): React.JSX.Element | null {
  const count = selectedIds.size;
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState<boolean>(false);

  const { executeBulkAction, isPending } = useBulkActions(onClearSelection);

  if (count === 0) return null;

  async function handleAction(action: BulkAction): Promise<void> {
    await executeBulkAction(action, Array.from(selectedIds));
  }

  return (
    <>
      <div
        role="toolbar"
        aria-label="Bulk actions"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-primary/20 bg-muted/60 p-3 text-sm shadow-xs transition-all animate-in fade-in slide-in-from-top-1 duration-200"
      >
        {/* Selection count + clear */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {count} selected
          </span>

          <button
            type="button"
            id="bulk-clear-selection"
            onClick={onClearSelection}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Clear selection"
          >
            <XIcon className="size-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 min-[540px]:grid-cols-4 sm:flex sm:items-center gap-2">
          <Button
            id="bulk-set-active"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("set-active")}
            className="gap-1.5 w-full sm:w-auto justify-center"
          >
            {isPending ? (
              <LoaderCircleIcon className="size-3.5 animate-spin" />
            ) : (
              <CheckCircleIcon className="size-3.5 text-emerald-500" />
            )}
            <span>Set Active</span>
          </Button>

          <Button
            id="bulk-set-inactive"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("set-inactive")}
            className="gap-1.5 w-full sm:w-auto justify-center"
          >
            {isPending ? (
              <LoaderCircleIcon className="size-3.5 animate-spin" />
            ) : (
              <XCircleIcon className="size-3.5 text-muted-foreground" />
            )}
            <span>Set Inactive</span>
          </Button>

          <Button
            id="bulk-delete"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => setBulkDeleteOpen(true)}
            className="gap-1.5 w-full sm:w-auto justify-center"
          >
            <Trash2Icon className="size-3.5" />
            <span>Delete</span>
          </Button>

          <Button
            id="bulk-export-csv"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onExportCSV}
            className="gap-1.5 w-full sm:w-auto justify-center"
          >
            <DownloadIcon className="size-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title="Delete selected customers?"
        description={`This will permanently delete ${count} customer${count !== 1 ? "s" : ""}. This action cannot be undone.`}
        confirmLabel="Delete all"
        isPending={isPending}
        onConfirm={() => {
          setBulkDeleteOpen(false);
          void handleAction("delete");
        }}
      />
    </>
  );
}
