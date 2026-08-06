import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCustomer } from "@/services/customer.service";
import type { CustomerFormValues, APIResponse, Customer } from "@/types";

export function useCreateCustomer(): ReturnType<
  typeof useMutation<APIResponse<Customer>, Error, CustomerFormValues>
> {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<Customer>, Error, CustomerFormValues>({
    mutationFn: (data: CustomerFormValues) => createCustomer(data),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
      void queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
      toast.success(response.message ?? "Customer created successfully.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to create customer.");
    },
  });
}
