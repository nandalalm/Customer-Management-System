import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "@/services/customer.service";
import type { APIResponse, Customer } from "@/types";

export function useCustomer(
  id: string | null | undefined
): ReturnType<typeof useQuery<APIResponse<Customer>>> {
  return useQuery<APIResponse<Customer>>({
    queryKey: ["customers", id],
    queryFn: () => getCustomerById(id as string),
    staleTime: 30_000,
    // Only fetch when a valid id is provided
    enabled: id !== null && id !== undefined && id !== "",
  });
}
