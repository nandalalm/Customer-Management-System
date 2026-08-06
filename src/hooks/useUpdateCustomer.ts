import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCustomer } from "@/services/customer.service";
import type {
  Customer,
  CustomerFormValues,
  APIResponse,
  PaginatedResponse,
} from "@/types";

interface UpdateCustomerVariables {
  id: string;
  data: Partial<CustomerFormValues>;
}

interface MutationContext {
  previousDetail: APIResponse<Customer> | undefined;
}

export function useUpdateCustomer(): ReturnType<
  typeof useMutation<
    APIResponse<Customer>,
    Error,
    UpdateCustomerVariables,
    MutationContext
  >
> {
  const queryClient = useQueryClient();

  return useMutation<
    APIResponse<Customer>,
    Error,
    UpdateCustomerVariables,
    MutationContext
  >({
    mutationFn: ({ id, data }: UpdateCustomerVariables) =>
      updateCustomer(id, data),

    onMutate: async ({ id, data }: UpdateCustomerVariables) => {
      // Cancel any outgoing refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: ["customers", id] });

      const previousDetail = queryClient.getQueryData<APIResponse<Customer>>([
        "customers",
        id,
      ]);

      // Optimistically patch the single-record cache entry
      if (previousDetail) {
        queryClient.setQueryData<APIResponse<Customer>>(["customers", id], {
          ...previousDetail,
          data: { ...previousDetail.data, ...data },
        });
      }

      // Optimistically patch any list cache entries that contain this record.
      // The wildcard key also matches ["customers", id] (APIResponse<Customer>)
      // where data is a single object — Array.isArray guards against calling .map() on it.
      queryClient.setQueriesData<PaginatedResponse<Customer>>(
        { queryKey: ["customers"] },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          };
        }
      );

      return { previousDetail };
    },

    onError: (error, { id }, context) => {
      // Roll back the single-record cache to its pre-mutation snapshot
      if (context?.previousDetail) {
        queryClient.setQueryData(["customers", id], context.previousDetail);
      }
      toast.error(error.message ?? "Failed to update customer.");
    },

    onSettled: (_data, _error, { id }) => {
      // Always sync with the server after success or failure
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
      void queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
      void queryClient.invalidateQueries({ queryKey: ["customers", id] });
    },

    onSuccess: (response) => {
      toast.success(response.message ?? "Customer updated successfully.");
    },
  });
}
