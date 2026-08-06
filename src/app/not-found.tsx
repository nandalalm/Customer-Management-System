import Link from "next/link";
import { LayoutDashboardIcon, FileQuestionIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 text-center text-foreground">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        {/* Icon & 404 Badge */}
        <div className="relative flex items-center justify-center">
          <div className="flex size-20 items-center justify-center rounded-2xl border border-border bg-muted/40 shadow-xs">
            <FileQuestionIcon className="size-10 text-primary" />
          </div>
          <span className="absolute -bottom-2 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-xs">
            Error 404
          </span>
        </div>

        {/* Text Heading & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            id="back-to-dashboard-btn"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "gap-2 px-5"
            )}
          >
            <LayoutDashboardIcon className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

