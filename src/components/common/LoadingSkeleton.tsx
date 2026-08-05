import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  rows?: number;
}

export function LoadingSkeleton({
  rows = 5,
}: LoadingSkeletonProps): React.JSX.Element {
  return (
    <div className="w-full space-y-2 p-4" role="status" aria-label="Loading">
      {/* Table header shimmer */}
      <div className="flex gap-4 border-b border-border pb-2">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>

      {/* Row shimmer */}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-md px-1 py-2.5"
        >
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-8 ml-auto" />
        </div>
      ))}
    </div>
  );
}
