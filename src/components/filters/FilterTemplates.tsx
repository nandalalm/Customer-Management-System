"use client";

import { subDays, format } from "date-fns";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";
import type { CustomerStatus } from "@/types";

interface TemplatePreset {
  id: string;
  name: string;
  apply: (setters: {
    clearFilters: () => void;
    setStatus: (status: CustomerStatus[]) => void;
    setDateFrom: (dateFrom: string) => void;
    setDateTo: (dateTo: string) => void;
  }) => void;
}

export function FilterTemplates(): React.JSX.Element {
  const { clearFilters, setStatus, setDateFrom, setDateTo } = useFilters();

  const presets: TemplatePreset[] = [
    {
      id: "template-active",
      name: "Active Customers",
      apply: (setters) => {
        setters.clearFilters();
        setters.setStatus(["active"]);
      },
    },
    {
      id: "template-recent",
      name: "Recent Contacts",
      apply: (setters) => {
        setters.clearFilters();
        const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
        setters.setDateFrom(thirtyDaysAgo);
      },
    },
    {
      id: "template-inactive",
      name: "Inactive Customers",
      apply: (setters) => {
        setters.clearFilters();
        setters.setStatus(["inactive"]);
      },
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <SparklesIcon className="size-3.5" />
        <span>Quick Presets</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            id={preset.id}
            variant="outline"
            size="sm"
            className="h-7 text-xs font-normal"
            onClick={() =>
              preset.apply({ clearFilters, setStatus, setDateFrom, setDateTo })
            }
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
