"use client";

import { useState, useCallback } from "react";
import type { SavedFilter, FilterState } from "@/types";

const STORAGE_KEY = "crm:saved-filters";

export const DEFAULT_SAVED_FILTERS: SavedFilter[] = [
  { id: "saved-1", name: "Active Customers", filters: { status: ["active"] }, createdAt: "" },
  { id: "saved-2", name: "Recent Contacts", filters: { dateFrom: "2023-10-01" }, createdAt: "" },
  { id: "saved-3", name: "Inactive Leads", filters: { status: ["inactive"] }, createdAt: "" },
];

function readFromStorage(): SavedFilter[] {
  if (typeof window === "undefined") return DEFAULT_SAVED_FILTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // First visit: initialize storage with default filter presets
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAVED_FILTERS));
      return DEFAULT_SAVED_FILTERS;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_SAVED_FILTERS;
    return parsed as SavedFilter[];
  } catch {
    return DEFAULT_SAVED_FILTERS;
  }
}

function writeToStorage(filters: SavedFilter[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
}

export interface UseSavedFiltersReturn {
  savedFilters: SavedFilter[];
  saveFilter: (name: string, state: FilterState) => void;
  deleteFilter: (id: string) => void;
  applyFilter: (saved: SavedFilter) => FilterState;
  reorderFilters: (orderedIds: string[]) => void;
}

export function useSavedFilters(): UseSavedFiltersReturn {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() =>
    readFromStorage()
  );

  const persist = useCallback((next: SavedFilter[]) => {
    setSavedFilters(next);
    writeToStorage(next);
  }, []);

  const saveFilter = useCallback(
    (name: string, state: FilterState) => {
      const entry: SavedFilter = {
        id: crypto.randomUUID(),
        name,
        filters: state,
        createdAt: new Date().toISOString(),
      };
      persist([...readFromStorage(), entry]);
    },
    [persist]
  );

  const deleteFilter = useCallback(
    (id: string) => {
      persist(readFromStorage().filter((f) => f.id !== id));
    },
    [persist]
  );

  const applyFilter = useCallback((saved: SavedFilter): FilterState => {
    return saved.filters;
  }, []);

  const reorderFilters = useCallback(
    (orderedIds: string[]) => {
      const current = readFromStorage();
      const byId = new Map(current.map((f) => [f.id, f]));
      const reordered = orderedIds
        .map((id) => byId.get(id))
        .filter((f): f is SavedFilter => f !== undefined);
      persist(reordered);
    },
    [persist]
  );

  return { savedFilters, saveFilter, deleteFilter, applyFilter, reorderFilters };
}
