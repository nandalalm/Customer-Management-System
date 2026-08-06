"use client";

import { useState, useSyncExternalStore } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { Trash2Icon, CheckIcon, GripVerticalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DEFAULT_SAVED_FILTERS } from "@/hooks/useSavedFilters";
import type { SavedFilter, FilterState } from "@/types";

// ── Save Filter Button ───────────────────────────────────────────────────────

interface SaveFilterButtonProps {
  filters: FilterState;
  hasActiveFilters: boolean;
  onSave: (name: string, state: FilterState) => void;
}

export function SaveFilterButton({
  filters,
  hasActiveFilters,
  onSave,
}: SaveFilterButtonProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  function handleSave(): void {
    if (!filterName.trim()) return;
    onSave(filterName.trim(), filters);
    setFilterName("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id="save-filter-trigger"
        disabled={!hasActiveFilters}
        className={`w-full flex items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium transition-colors shadow-xs ${
          hasActiveFilters
            ? "bg-card/80 text-foreground hover:bg-accent cursor-pointer"
            : "bg-card/60 text-muted-foreground/70 cursor-not-allowed opacity-75 pointer-events-none"
        }`}
      >
        Save Filter
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3" align="center">
        <div className="space-y-2">
          <p className="text-xs font-medium">Save Current Filter Preset</p>
          <Input
            id="save-filter-name-input"
            placeholder="Filter name (e.g. Active prospects)"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            className="h-8 text-xs"
          />
          <div className="flex justify-end gap-1.5 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              id="save-filter-confirm-btn"
              type="button"
              size="sm"
              className="h-7 text-xs"
              disabled={!filterName.trim()}
              onClick={handleSave}
            >
              <CheckIcon className="size-3" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Sortable filter row ───────────────────────────────────────────────────────

interface SortableFilterRowProps {
  saved: SavedFilter;
  isActive: boolean;
  onApply: (saved: SavedFilter) => void;
  onDelete: (saved: SavedFilter) => void;
  onDeactivate: () => void;
}

function SortableFilterRow({
  saved,
  isActive,
  onApply,
  onDelete,
  onDeactivate,
}: SortableFilterRowProps): React.JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: saved.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
        isActive
          ? "bg-secondary/90 font-medium text-foreground"
          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
      }`}
      onClick={() => onApply(saved)}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <button
          type="button"
          aria-label={`Reorder ${saved.name}`}
          className="opacity-0 group-hover:opacity-100 flex cursor-grab items-center text-muted-foreground/40 hover:text-muted-foreground transition-opacity"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVerticalIcon className="size-3" />
        </button>

        <span className="truncate text-left">{saved.name}</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isActive ? (
          // X to deactivate the currently active saved filter
          <button
            type="button"
            aria-label={`Deactivate ${saved.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDeactivate();
            }}
            className="text-foreground hover:text-destructive transition-colors"
          >
            <XIcon className="size-3" />
          </button>
        ) : (
          // Trash to permanently delete — only visible on hover
          <button
            type="button"
            id={`delete-saved-filter-${saved.id}`}
            aria-label={`Delete ${saved.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(saved);
            }}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
          >
            <Trash2Icon className="size-3" />
          </button>
        )}
      </div>
    </div>
  );
}

const emptySubscribe = () => () => {};
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ── SavedFilters container ────────────────────────────────────────────────────

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  activeSavedFilterId: string | null;
  onApply: (saved: SavedFilter) => void;
  onDelete: (saved: SavedFilter) => void;
  onReorder: (orderedIds: string[]) => void;
  onDeactivate: () => void;
}

export function SavedFilters({
  savedFilters,
  activeSavedFilterId,
  onApply,
  onDelete,
  onReorder,
  onDeactivate,
}: SavedFiltersProps): React.JSX.Element {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Deletion confirmation modal state
  const [filterToDelete, setFilterToDelete] = useState<SavedFilter | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handleRequestDelete(saved: SavedFilter): void {
    setFilterToDelete(saved);
    setDeleteDialogOpen(true);
  }

  function handleConfirmDelete(): void {
    if (filterToDelete) {
      onDelete(filterToDelete);
    }
    setDeleteDialogOpen(false);
    setFilterToDelete(null);
  }

  // After client mount, switch from SSR-safe static list to full DnD tree.
  const mounted = useMounted();

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = savedFilters.findIndex((f) => f.id === active.id);
    const newIndex = savedFilters.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(savedFilters, oldIndex, newIndex);
    onReorder(reordered.map((f) => f.id));
  }

  // Static SSR-safe fallback — always renders DEFAULT_SAVED_FILTERS so server and client
  // agree on the initial markup before hydration completes.
  const staticList = (
    <div className="space-y-1">
      {DEFAULT_SAVED_FILTERS.map((saved) => (
        <div
          key={saved.id}
          className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          onClick={() => onApply(saved)}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="truncate text-left">{saved.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              id={`delete-saved-filter-${saved.id}`}
              aria-label={`Delete ${saved.name}`}
              onClick={(e) => { e.stopPropagation(); handleRequestDelete(saved); }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <Trash2Icon className="size-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-2 pt-2">
      <h3 className="text-sm font-semibold text-foreground">Saved Filters</h3>

      {!mounted ? (
        staticList
      ) : savedFilters.length === 0 ? (
        <p className="px-1 py-1.5 text-xs text-muted-foreground/60 italic">No saved filters</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={savedFilters.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {savedFilters.map((saved) => (
                <SortableFilterRow
                  key={saved.id}
                  saved={saved}
                  isActive={saved.id === activeSavedFilterId}
                  onApply={onApply}
                  onDelete={handleRequestDelete}
                  onDeactivate={onDeactivate}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Saved Filter"
        description={`Are you sure you want to delete "${filterToDelete?.name ?? "this filter"}"? This action cannot be undone.`}
        confirmLabel="Delete Filter"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
