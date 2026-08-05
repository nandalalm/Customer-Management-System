"use client";

import { useState, useCallback } from "react";
import type { SavedFilter, FilterState } from "@/types";

const STORAGE_KEY = "crm:saved-filters";

function readFromStorage(): SavedFilter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    // Guard against corrupt storage — must be an array
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedFilter[];
  } catch {
    return [];
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

  // Returns the stored FilterState so the caller (useFilters) can apply it.
  // Intentionally pure — does not mutate URL state itself; that is the
  // responsibility of the component that calls useFilters.setters.
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
