import axiosInstance from "@/lib/axios";
import type {
  Customer,
  CustomerFormValues,
  CustomerQueryParams,
  APIResponse,
  PaginatedResponse,
} from "@/types";

// nuqs serialises arrays as repeated keys (?status=active&status=inactive),
// but axios serialises arrays with brackets (?status[]=active) by default.
// paramsSerializer aligns axios with the URL format the API routes expect.
function toQueryString(params: CustomerQueryParams): string {
  const search = new URLSearchParams();

  const { status, company, ...rest } = params;

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  status?.forEach((s) => search.append("status", s));
  company?.forEach((c) => search.append("company", c));

  return search.toString();
}

export async function getCustomers(
  params: CustomerQueryParams
): Promise<PaginatedResponse<Customer>> {
  const qs = toQueryString(params);
  const response = await axiosInstance.get<PaginatedResponse<Customer>>(
    `/customers?${qs}`
  );
  return response.data;
}

export async function getCustomerById(
  id: string
): Promise<APIResponse<Customer>> {
  const response = await axiosInstance.get<APIResponse<Customer>>(
    `/customers/${id}`
  );
  return response.data;
}

export async function createCustomer(
  data: CustomerFormValues
): Promise<APIResponse<Customer>> {
  const response = await axiosInstance.post<APIResponse<Customer>>(
    "/customers",
    data
  );
  return response.data;
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerFormValues>
): Promise<APIResponse<Customer>> {
  const response = await axiosInstance.put<APIResponse<Customer>>(
    `/customers/${id}`,
    data
  );
  return response.data;
}

export async function deleteCustomer(
  id: string
): Promise<APIResponse<{ id: string }>> {
  const response = await axiosInstance.delete<APIResponse<{ id: string }>>(
    `/customers/${id}`
  );
  return response.data;
}

export async function bulkCustomerAction(
  action: "delete" | "set-active" | "set-inactive",
  ids: string[]
): Promise<APIResponse<{ count: number }>> {
  const response = await axiosInstance.post<APIResponse<{ count: number }>>(
    "/customers/bulk",
    { action, ids }
  );
  return response.data;
}
