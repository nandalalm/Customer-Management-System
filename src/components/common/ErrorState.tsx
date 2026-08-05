import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps): React.JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircleIcon className="size-6" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Request failed</p>
        <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
      </div>

      <Button
        id="error-state-retry"
        variant="outline"
        size="sm"
        onClick={onRetry}
      >
        <RefreshCwIcon className="size-3.5" />
        Try again
      </Button>
    </div>
  );
}
