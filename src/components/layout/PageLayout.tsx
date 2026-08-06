"use client";

import { useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFilters } from "@/hooks/useFilters";

interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  sidebar,
  children,
}: PageLayoutProps): React.JSX.Element {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activeFilterCount } = useFilters();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar — hidden below 921px breakpoint */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-sidebar min-[921px]:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar trigger button — floating pill with SlidersHorizontalIcon (< 921px) */}
      <Button
        id="mobile-filter-toggle"
        variant="default"
        size="sm"
        aria-label="Open filters"
        className="fixed bottom-20 left-4 z-20 flex items-center gap-2 rounded-full px-3.5 py-2 shadow-xl min-[921px]:hidden border border-primary-foreground/10 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <SlidersHorizontalIcon className="size-4" />
        <span className="text-xs font-semibold">Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex size-4.5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold tabular-nums">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Mobile sidebar — Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-4 py-3">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto">{sidebar}</div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
