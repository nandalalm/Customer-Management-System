import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkCustomerAction } from "@/services/customer.service";
import type { BulkAction } from "@/types";

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

    try {
      const response = await bulkCustomerAction(action, ids);

      void queryClient.invalidateQueries({ queryKey: ["customers"] });
      void queryClient.invalidateQueries({ queryKey: ["customer-stats"] });

      toast.success(response.message ?? "Bulk action completed successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Bulk action failed.";
      toast.error(message);
    } finally {
      setIsPending(false);
      onSettled();
    }
  }

  return { executeBulkAction, isPending };
}
