"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, UsersIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddCustomer: () => void;
}

export function Header({ onAddCustomer }: HeaderProps): React.JSX.Element {
  const { theme, setTheme } = useTheme();

  function toggleTheme(): void {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <UsersIcon className="size-5 text-primary" />
        <span className="text-base font-semibold tracking-tight">
          CRM Dashboard
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
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
          Add Customer
        </Button>
      </div>
    </header>
  );
}
