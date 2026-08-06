import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCustomer, updateCustomer } from "@/services/customer.service";
import type { BulkAction, CustomerStatus } from "@/types";

interface BulkActionsReturn {
  executeBulkAction: (action: BulkAction, ids: string[]) => Promise<void>;
  isPending: boolean;
}

export function useBulkActions(onSettled: () => void): BulkActionsReturn {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState<boolean>(false);

  async function executeBulkAction(
    action: BulkAction,
    ids: string[]
  ): Promise<void> {
    if (ids.length === 0) return;

    setIsPending(true);

    let results: PromiseSettledResult<unknown>[];

    if (action === "delete") {
      results = await Promise.allSettled(ids.map((id) => deleteCustomer(id)));
    } else {
      const status: CustomerStatus =
        action === "set-active" ? "active" : "inactive";
      results = await Promise.allSettled(
        ids.map((id) => updateCustomer(id, { status }))
      );
    }

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    void queryClient.invalidateQueries({ queryKey: ["customers"] });
    void queryClient.invalidateQueries({ queryKey: ["customer-stats"] });

    if (failed === 0) {
      const label =
        action === "delete"
          ? "deleted"
          : action === "set-active"
          ? "set to Active"
          : "set to Inactive";
      toast.success(
        `${succeeded} customer${succeeded !== 1 ? "s" : ""} ${label}.`
      );
    } else if (succeeded === 0) {
      toast.error(`All ${failed} operation${failed !== 1 ? "s" : ""} failed.`);
    } else {
      toast.warning(
        `${succeeded} succeeded, ${failed} failed. Refresh to see the current state.`
      );
    }

    setIsPending(false);
    onSettled();
  }

  return { executeBulkAction, isPending };
}
