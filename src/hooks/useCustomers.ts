import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/services/customer.service";
import type { CustomerQueryParams, PaginatedResponse, Customer } from "@/types";

export function useCustomers(params: CustomerQueryParams): ReturnType<
  typeof useQuery<PaginatedResponse<Customer>>
> {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
    staleTime: 30_000,
  });
}
