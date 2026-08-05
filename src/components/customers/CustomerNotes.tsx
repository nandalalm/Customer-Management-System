"use client";

import { useState } from "react";
import { FileTextIcon, SaveIcon, Loader2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";

interface CustomerNotesProps {
  customerId: string;
  initialNotes?: string;
}

export function CustomerNotes({
  customerId,
  initialNotes = "",
}: CustomerNotesProps): React.JSX.Element {
  const [notes, setNotes] = useState<string>(initialNotes);
  const [prevNotes, setPrevNotes] = useState<string>(initialNotes);
  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  // Sync state when the initialNotes prop changes (e.g. after an optimistic
  // update resolves or the user switches to a different customer). Updating
  // state during render avoids the effect-then-re-render cascade that
  // react-hooks/set-state-in-effect flags.
  if (initialNotes !== prevNotes) {
    setPrevNotes(initialNotes);
    setNotes(initialNotes);
  }

  const isUnchanged = notes === initialNotes;

  function handleSaveNotes(): void {
    if (isUnchanged) return;
    updateCustomer({
      id: customerId,
      data: { notes },
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/10 p-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor={`notes-input-${customerId}`}
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <FileTextIcon className="size-3.5 text-primary" />
          Notes & Comments
        </label>
        <Button
          id="save-customer-notes-btn"
          type="button"
          size="sm"
          onClick={handleSaveNotes}
          disabled={isPending || isUnchanged}
        >
          {isPending ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <SaveIcon className="size-3.5" />
          )}
          Save Notes
        </Button>
      </div>

      <Textarea
        id={`notes-input-${customerId}`}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add any internal notes, history, or reminders about this customer…"
        rows={4}
        className="resize-y text-sm bg-background"
      />
    </div>
  );
}
