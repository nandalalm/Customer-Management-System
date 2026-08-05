"use client";

import { useQueryStates, parseAsString, parseAsArrayOf, parseAsStringEnum } from "nuqs";
import { useCallback } from "react";
import type { FilterState, CustomerStatus } from "@/types";

// nuqs serialises arrays as repeated keys (?status=active&status=inactive),
// but axios serialises arrays with brackets by default. The paramsSerializer
// in src/lib/axios.ts aligns axios with this format.
const filterParsers = {
  search: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum<CustomerStatus>(["active", "inactive"])).withDefault([]),
  company: parseAsArrayOf(parseAsString).withDefault([]),
  dateFrom: parseAsString.withDefault(""),
  dateTo: parseAsString.withDefault(""),
  email: parseAsString.withDefault(""),
  phone: parseAsString.withDefault(""),
  page: parseAsString.withDefault("1"),
};

export interface UseFiltersReturn {
  filters: FilterState;
  search: string;
  page: number;
  setSearch: (value: string) => void;
  setStatus: (value: CustomerStatus[]) => void;
  setCompany: (value: string[]) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setPage: (value: number) => void;
  activeFilterCount: number;
  clearFilters: () => void;
}

export function useFilters(): UseFiltersReturn {
  const [state, setValues] = useQueryStates(filterParsers, {
    history: "push",
    shallow: true,
  });

  const resetPage = useCallback(
    () => setValues({ page: "1" }),
    [setValues]
  );

  const setSearch = useCallback(
    (value: string) => {
      setValues({ search: value || null, page: "1" });
    },
    [setValues]
  );

  const setStatus = useCallback(
    (value: CustomerStatus[]) => {
      setValues({ status: value.length ? value : null, page: "1" });
    },
    [setValues]
  );

  const setCompany = useCallback(
    (value: string[]) => {
      setValues({ company: value.length ? value : null, page: "1" });
    },
    [setValues]
  );

  const setDateFrom = useCallback(
    (value: string) => {
      setValues({ dateFrom: value || null, page: "1" });
    },
    [setValues]
  );

  const setDateTo = useCallback(
    (value: string) => {
      setValues({ dateTo: value || null, page: "1" });
    },
    [setValues]
  );

  const setEmail = useCallback(
    (value: string) => {
      setValues({ email: value || null, page: "1" });
    },
    [setValues]
  );

  const setPhone = useCallback(
    (value: string) => {
      setValues({ phone: value || null, page: "1" });
    },
    [setValues]
  );

  const setPage = useCallback(
    (value: number) => {
      setValues({ page: String(value) });
    },
    [setValues]
  );

  const clearFilters = useCallback(() => {
    setValues({
      search: null,
      status: null,
      company: null,
      dateFrom: null,
      dateTo: null,
      email: null,
      phone: null,
      page: "1",
    });
  }, [setValues]);

  // Count only the filter fields, not search or page
  const activeFilterCount =
    (state.status.length > 0 ? 1 : 0) +
    (state.company.length > 0 ? 1 : 0) +
    (state.dateFrom ? 1 : 0) +
    (state.dateTo ? 1 : 0) +
    (state.email ? 1 : 0) +
    (state.phone ? 1 : 0);

  const filters: FilterState = {
    search: state.search || undefined,
    status: state.status.length ? state.status : undefined,
    company: state.company.length ? state.company : undefined,
    dateFrom: state.dateFrom || undefined,
    dateTo: state.dateTo || undefined,
    email: state.email || undefined,
    phone: state.phone || undefined,
  };

  return {
    filters,
    search: state.search,
    page: parseInt(state.page, 10),
    setSearch,
    setStatus,
    setCompany,
    setDateFrom,
    setDateTo,
    setEmail,
    setPhone,
    setPage,
    activeFilterCount,
    clearFilters,
  };
}
