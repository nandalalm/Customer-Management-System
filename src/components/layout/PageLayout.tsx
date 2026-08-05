"use client";

import { useState } from "react";
import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PageLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  sidebar,
  children,
}: PageLayoutProps): React.JSX.Element {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Desktop sidebar — hidden below md breakpoint */}
      <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-border bg-sidebar md:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar trigger */}
      <Button
        id="mobile-filter-toggle"
        variant="ghost"
        size="icon"
        aria-label="Open filters"
        className="fixed bottom-4 left-4 z-20 shadow-md md:hidden"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <PanelLeftIcon className="size-5" />
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
