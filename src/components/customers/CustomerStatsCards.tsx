"use client";

import { useQuery } from "@tanstack/react-query";
import { UsersIcon, CheckCircle2Icon, XCircleIcon, ClockIcon } from "lucide-react";
import { getCustomers } from "@/services/customer.service";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@/types";

function isWithinLastDays(dateStr: string, days: number): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr).getTime();
  if (isNaN(date)) return false;

  const now = new Date().getTime();
  const diffMs = now - date;
  if (diffMs < 0) return false; // Future dates are not past recent contacts

  const daysMs = days * 24 * 60 * 60 * 1000;
  return diffMs <= daysMs;
}

export function CustomerStatsCards(): React.JSX.Element {
  // Fetch all customer records to compute accurate global counts across the 150 seed records
  const { data, isLoading } = useQuery({
    queryKey: ["customer-stats"],
    queryFn: () => getCustomers({ page: 1, pageSize: 10_000 }),
    staleTime: 30_000,
  });

  const allCustomers: Customer[] = data?.data ?? [];
  const totalCount = allCustomers.length;

  const activeCount = allCustomers.filter((c) => c.status === "active").length;
  const inactiveCount = allCustomers.filter((c) => c.status === "inactive").length;
  const recentCount = allCustomers.filter((c) => isWithinLastDays(c.lastContactDate, 30)).length;

  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const inactivePercent = totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0;
  const recentPercent = totalCount > 0 ? Math.round((recentCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
            <Skeleton className="size-9 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
      {/* 1. Total Customers */}
      <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-card/80 transition-all hover:border-indigo-500/40 hover:bg-card shadow-xs">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">Total Customers</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
            {totalCount}
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">All accounts</p>
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
          <UsersIcon className="size-4 sm:size-5" />
        </div>
      </div>

      {/* 2. Active Customers */}
      <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-card/80 transition-all hover:border-emerald-500/40 hover:bg-card shadow-xs">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">Active Customers</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
            {activeCount}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {activePercent}% of total
          </p>
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
          <CheckCircle2Icon className="size-4 sm:size-5" />
        </div>
      </div>

      {/* 3. Inactive Customers */}
      <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-card/80 transition-all hover:border-amber-500/40 hover:bg-card shadow-xs">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">Inactive Customers</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
            {inactiveCount}
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
            {inactivePercent}% of total
          </p>
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
          <XCircleIcon className="size-4 sm:size-5" />
        </div>
      </div>

      {/* 4. Recent Contacts */}
      <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-card/80 transition-all hover:border-sky-500/40 hover:bg-card shadow-xs">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">Recent Contacts</p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
            {recentCount}
          </p>
          <p className="text-[11px] text-sky-600 dark:text-sky-400 font-medium mt-0.5">
            {recentPercent}% of total (30d)
          </p>
        </div>
        <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
          <ClockIcon className="size-4 sm:size-5" />
        </div>
      </div>
    </div>
  );
}

