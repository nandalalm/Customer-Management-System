"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  SunIcon,
  MoonIcon,
  UsersIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/hooks/useFilters";
import { useDebounce } from "@/hooks/useDebounce";

interface HeaderProps {
  onAddCustomer: () => void;
}

export function Header({ onAddCustomer }: HeaderProps): React.JSX.Element {
  const { theme, setTheme } = useTheme();
  const { search, setSearch } = useFilters();

  const [localSearch, setLocalSearch] = useState(search ?? "");
  const [prevSearch, setPrevSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync external search changes (e.g. clear filters button) during render
  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search ?? "");
  }

  // Sync debounced search to URL via useFilters
  useEffect(() => {
    if (debouncedSearch !== (search ?? "")) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, search, setSearch]);

  function toggleTheme(): void {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      {/* Brand logo & title */}
      <div className="flex items-center gap-2 shrink-0">
        <UsersIcon className="size-5 text-primary" />
        <span className="hidden text-base font-semibold tracking-tight sm:inline">
          CRM Dashboard
        </span>
      </div>

      {/* Global search input */}
      <div className="relative flex-1 max-w-md">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          id="global-search-input"
          type="search"
          autoComplete="off"
          placeholder="Search customers by name, email, company…"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-9 w-full pl-9 pr-8 text-sm bg-muted/40 focus:bg-background transition-colors"
        />
        {localSearch && (
          <button
            type="button"
            id="clear-global-search"
            aria-label="Clear search"
            onClick={() => {
              setLocalSearch("");
              setSearch("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          id="theme-toggle"
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <SunIcon className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        <Button id="add-customer-btn" onClick={onAddCustomer} size="sm">
          <PlusIcon className="size-4" />
          <span className="hidden sm:inline">Add Customer</span>
        </Button>
      </div>
    </header>
  );
}
