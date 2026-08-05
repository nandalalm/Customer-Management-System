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
        className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2 text-sm"
      >
        {/* Selection count + clear */}
        <span className="font-medium text-foreground">
          {count} selected
        </span>

        <button
          type="button"
          id="bulk-clear-selection"
          onClick={onClearSelection}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear selection"
        >
          <XIcon className="size-3.5" />
          <span className="text-xs">Clear</span>
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            id="bulk-set-active"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("set-active")}
            className="gap-1.5"
          >
            {isPending ? (
              <LoaderCircleIcon className="size-3.5 animate-spin" />
            ) : (
              <CheckCircleIcon className="size-3.5 text-emerald-500" />
            )}
            Set Active
          </Button>

          <Button
            id="bulk-set-inactive"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("set-inactive")}
            className="gap-1.5"
          >
            {isPending ? (
              <LoaderCircleIcon className="size-3.5 animate-spin" />
            ) : (
              <XCircleIcon className="size-3.5 text-muted-foreground" />
            )}
            Set Inactive
          </Button>

          <Button
            id="bulk-delete"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => setBulkDeleteOpen(true)}
            className="gap-1.5"
          >
            <Trash2Icon className="size-3.5" />
            Delete
          </Button>

          <Button
            id="bulk-export-csv"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={onExportCSV}
            className="gap-1.5"
          >
            <DownloadIcon className="size-3.5" />
            Export CSV
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
