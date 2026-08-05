"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

interface PaginationProps {
  totalPages: number;
  total: number;
}

export function Pagination({
  totalPages,
  total,
}: PaginationProps): React.JSX.Element {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10)
  );

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // base-ui Select passes `string | null`; null only fires if the value
  // is programmatically cleared, which cannot happen here with fixed options.
  async function handlePageSizeChange(value: string | null): Promise<void> {
    if (value === null) return;
    await setPageSize(Number(value));
    // Reset to page 1 whenever the page size changes so we don't land on a
    // page that no longer exists after the list shrinks.
    await setPage(1);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {total === 0 ? "No results" : `${from}–${to} of ${total} customers`}
      </p>

      <div className="flex items-center gap-3">
        {/* Page size selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger
              id="page-size-select"
              className="h-7 w-16 text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-0.5">
          <Button
            id="pagination-first"
            variant="ghost"
            size="icon-sm"
            aria-label="First page"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button
            id="pagination-prev"
            variant="ghost"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <span className="min-w-[5rem] text-center text-xs text-muted-foreground">
            Page {page} of {Math.max(totalPages, 1)}
          </span>

          <Button
            id="pagination-next"
            variant="ghost"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            id="pagination-last"
            variant="ghost"
            size="icon-sm"
            aria-label="Last page"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
