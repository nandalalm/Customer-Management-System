"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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

function getPageRange(
  currentPage: number,
  totalPages: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  // If total pages is 8 or less, show all page numbers directly
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Near start (Pages 1 & 2): show 1, 2, 3 ... (last 2 pages)
  if (currentPage <= 2) {
    return [1, 2, 3, "ellipsis-end", totalPages - 1, totalPages];
  }

  // At Page 3: show 1, 2, 3, 4 ... (last 2 pages) so page 4 is immediately clickable
  if (currentPage === 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages - 1, totalPages];
  }

  // Near end (Last 2 pages): show (first 2 pages) ... (last 3 pages)
  if (currentPage >= totalPages - 1) {
    return [1, 2, "ellipsis-start", totalPages - 2, totalPages - 1, totalPages];
  }

  // 3rd from last page: show (first 2 pages) ... (last 4 pages) so previous page is immediately clickable
  if (currentPage === totalPages - 2) {
    return [
      1,
      2,
      "ellipsis-start",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // In the middle: show 1, 2 ... (currentPage - 1), currentPage, (currentPage + 1) ... (last 2 pages)
  return [
    1,
    2,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages - 1,
    totalPages,
  ];
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

  const safeTotalPages = Math.max(totalPages, 1);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pageRange = getPageRange(page, safeTotalPages);

  async function handlePageSizeChange(value: string | null): Promise<void> {
    if (value === null) return;
    await setPageSize(Number(value));
    await setPage(1);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {total === 0 ? "No results" : `${from}–${to} of ${total} customers`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:flex-nowrap">
        {/* Page size selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger
              id="page-size-select"
              className="h-8 w-16 text-xs"
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

        {/* Numbered pagination bar */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            id="pagination-prev"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2.5 text-xs font-medium"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeftIcon className="size-3.5" />
            <span>Prev</span>
          </Button>

          {/* Numbered page buttons & ellipsis */}
          {pageRange.map((item, index) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`${item}-${index}`}
                  className="flex h-8 w-6 items-center justify-center text-xs text-muted-foreground select-none font-semibold"
                >
                  …
                </span>
              );
            }

            const isCurrent = item === page;

            return (
              <Button
                key={item}
                id={`pagination-page-${item}`}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 text-xs font-medium"
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => setPage(item)}
              >
                {item}
              </Button>
            );
          })}

          {/* Next button */}
          <Button
            id="pagination-next"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2.5 text-xs font-medium"
            disabled={page >= safeTotalPages}
            onClick={() => setPage(page + 1)}
          >
            <span>Next</span>
            <ChevronRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
