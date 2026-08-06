import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCustomer } from "@/services/customer.service";
import type { APIResponse } from "@/types";

export function useDeleteCustomer(): ReturnType<
  typeof useMutation<APIResponse<{ id: string }>, Error, string>
> {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<{ id: string }>, Error, string>({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: (response, id) => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
      void queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
      // Remove the now-stale detail entry immediately rather than waiting for GC
      queryClient.removeQueries({ queryKey: ["customers", id] });
      toast.success(response.message ?? "Customer deleted successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to delete customer.");
    },
  });
}
