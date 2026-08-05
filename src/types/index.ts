// ── Union Types ──────────────────────────────────────────────────────────────

export type CustomerStatus = "active" | "inactive";

export type SortDirection = "asc" | "desc";

export type BulkAction = "delete" | "set-active" | "set-inactive";

// ── Core Entities ────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  notes: string;
  lastContactDate: string;
  createdAt: string;
}

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  notes?: string;
  lastContactDate?: string;
}

// ── Filter & Sort ────────────────────────────────────────────────────────────

export interface FilterState {
  search?: string;
  status?: CustomerStatus[];
  company?: string[];
  dateFrom?: string;
  dateTo?: string;
  email?: string;
  phone?: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: string;
}

export interface SortState {
  field: keyof Customer;
  direction: SortDirection;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface CustomerQueryParams
  extends FilterState,
    Partial<SortState>,
    PaginationState {}

// ── API Response Shapes ──────────────────────────────────────────────────────

export interface APIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
