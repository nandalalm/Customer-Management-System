import type {
  Customer,
  CustomerFormValues,
  CustomerQueryParams,
  CustomerStatus,
  APIResponse,
  PaginatedResponse,
} from "@/types";
import { initialSeedCustomers } from "@/lib/seedData";

const STORAGE_KEY = "cms_customers_v1";

function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") {
    return initialSeedCustomers;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedCustomers));
      return initialSeedCustomers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as Customer[];
    }
    // If empty or corrupted, re-seed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeedCustomers));
    return initialSeedCustomers;
  } catch {
    return initialSeedCustomers;
  }
}

function saveStoredCustomers(customers: Customer[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch {
      // ignore storage quota errors
    }
  }
}

export function resetDemoCustomers(): Customer[] {
  saveStoredCustomers(initialSeedCustomers);
  return initialSeedCustomers;
}

export async function getCustomers(
  params: CustomerQueryParams
): Promise<PaginatedResponse<Customer>> {
  let results = getStoredCustomers();

  const search = params.search?.toLowerCase() ?? "";
  const statusParam = params.status ?? [];
  const companyParam = params.company ?? [];
  const dateFrom = params.dateFrom;
  const dateTo = params.dateTo;
  const email = params.email?.toLowerCase() ?? "";
  const phone = params.phone ?? "";
  const sortBy = (params.sortBy || params.field || "lastContactDate") as keyof Customer;
  const sortDir = params.sortDir || params.direction || "desc";
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(10000, Math.max(1, params.pageSize ?? 10));

  // 1. Search
  if (search) {
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.company.toLowerCase().includes(search)
    );
  }

  // 2. Status
  if (statusParam.length > 0) {
    results = results.filter((c) => statusParam.includes(c.status));
  }

  // 3. Company
  if (companyParam.length > 0) {
    results = results.filter((c) => companyParam.includes(c.company));
  }

  // 4. Email
  if (email) {
    results = results.filter((c) => c.email.toLowerCase().includes(email));
  }

  // 5. Phone
  if (phone) {
    results = results.filter((c) => c.phone.includes(phone));
  }

  // 6. DateFrom
  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    const fromTime = fromDate.getTime();
    results = results.filter(
      (c) => new Date(c.lastContactDate).getTime() >= fromTime
    );
  }

  // 7. DateTo
  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setHours(23, 59, 59, 999);
    const toTime = toDate.getTime();
    results = results.filter(
      (c) => new Date(c.lastContactDate).getTime() <= toTime
    );
  }

  // 8. Sorting
  if (sortBy) {
    results.sort((a, b) => {
      const aVal = a[sortBy] ?? "";
      const bVal = b[sortBy] ?? "";

      let comparison = 0;
      if (sortBy === "lastContactDate" || sortBy === "createdAt") {
        const aTime = new Date(aVal).getTime();
        const bTime = new Date(bVal).getTime();
        comparison = aTime - bTime;
      } else if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      }

      return sortDir === "desc" ? -comparison : comparison;
    });
  }

  // 9. Pagination
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = results.slice(startIndex, startIndex + pageSize);

  return {
    data: paginatedData,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getCustomerById(
  id: string
): Promise<APIResponse<Customer>> {
  const customers = getStoredCustomers();
  const found = customers.find((c) => c.id === id);

  if (!found) {
    throw new Error(`Customer with id "${id}" not found`);
  }

  return {
    data: found,
    message: "Customer retrieved successfully",
    success: true,
  };
}

export async function createCustomer(
  data: CustomerFormValues
): Promise<APIResponse<Customer>> {
  const customers = getStoredCustomers();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newCustomer: Customer = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    status: data.status,
    notes: data.notes ?? "",
    lastContactDate: data.lastContactDate
      ? new Date(data.lastContactDate).toISOString()
      : now,
    createdAt: now,
  };

  const updated = [newCustomer, ...customers];
  saveStoredCustomers(updated);

  return {
    data: newCustomer,
    message: "Customer created successfully",
    success: true,
  };
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerFormValues>
): Promise<APIResponse<Customer>> {
  const customers = getStoredCustomers();
  const index = customers.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error(`Customer with id "${id}" not found`);
  }

  const existing = customers[index];
  const updatedCustomer: Customer = {
    ...existing,
    ...data,
    notes: data.notes ?? existing.notes,
    lastContactDate: data.lastContactDate
      ? new Date(data.lastContactDate).toISOString()
      : existing.lastContactDate,
    id,
  };

  const updated = [...customers];
  updated[index] = updatedCustomer;
  saveStoredCustomers(updated);

  return {
    data: updatedCustomer,
    message: "Customer updated successfully",
    success: true,
  };
}

export async function deleteCustomer(
  id: string
): Promise<APIResponse<{ id: string }>> {
  const customers = getStoredCustomers();
  const filtered = customers.filter((c) => c.id !== id);

  if (filtered.length === customers.length) {
    throw new Error(`Customer with id "${id}" not found`);
  }

  saveStoredCustomers(filtered);

  return {
    data: { id },
    message: "Customer deleted successfully",
    success: true,
  };
}

export async function bulkCustomerAction(
  action: "delete" | "set-active" | "set-inactive",
  ids: string[]
): Promise<APIResponse<{ count: number }>> {
  const customers = getStoredCustomers();
  const targetIds = new Set(ids);
  let count = 0;
  let nextCustomers: Customer[] = [];

  if (action === "delete") {
    nextCustomers = customers.filter((c) => {
      if (targetIds.has(c.id)) {
        count++;
        return false;
      }
      return true;
    });
  } else if (action === "set-active" || action === "set-inactive") {
    const status: CustomerStatus = action === "set-active" ? "active" : "inactive";
    nextCustomers = customers.map((c) => {
      if (targetIds.has(c.id)) {
        count++;
        return { ...c, status };
      }
      return c;
    });
  }

  saveStoredCustomers(nextCustomers);

  const actionLabel =
    action === "delete"
      ? "deleted"
      : action === "set-active"
      ? "set to active"
      : "set to inactive";

  return {
    data: { count },
    message: `Successfully ${actionLabel} ${count} customer${count !== 1 ? "s" : ""}`,
    success: true,
  };
}
