"use client";

import { useState } from "react";
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
import { BookmarkIcon, PlusIcon, Trash2Icon, CheckIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSavedFilters } from "@/hooks/useSavedFilters";
import { useFilters } from "@/hooks/useFilters";
import type { SavedFilter } from "@/types";

// ── Sortable filter row ───────────────────────────────────────────────────────

interface SortableFilterRowProps {
  saved: SavedFilter;
  onApply: (saved: SavedFilter) => void;
  onDelete: (id: string) => void;
}

function SortableFilterRow({
  saved,
  onApply,
  onDelete,
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
      className="group flex items-center justify-between rounded-md px-1 py-1 text-xs hover:bg-accent transition-colors"
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label={`Reorder ${saved.name}`}
        className="mr-1 flex cursor-grab items-center text-muted-foreground/30 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-3.5" />
      </button>

      <button
        type="button"
        id={`apply-saved-filter-${saved.id}`}
        onClick={() => onApply(saved)}
        className="truncate font-medium text-foreground hover:text-primary text-left flex-1"
      >
        {saved.name}
      </button>

      <button
        type="button"
        id={`delete-saved-filter-${saved.id}`}
        aria-label={`Delete ${saved.name}`}
        onClick={() => onDelete(saved.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
      >
        <Trash2Icon className="size-3.5" />
      </button>
    </div>
  );
}

// ── SavedFilters container ────────────────────────────────────────────────────

export function SavedFilters(): React.JSX.Element {
  const { savedFilters, saveFilter, deleteFilter, reorderFilters } = useSavedFilters();
  const {
    filters,
    activeFilterCount,
    setStatus,
    setCompany,
    setDateFrom,
    setDateTo,
    setEmail,
    setPhone,
    setSearch,
  } = useFilters();

  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleSave(): void {
    if (!filterName.trim()) return;
    saveFilter(filterName.trim(), filters);
    setFilterName("");
    setOpen(false);
  }

  function handleApply(saved: SavedFilter): void {
    setStatus(saved.filters.status ?? []);
    setCompany(saved.filters.company ?? []);
    setDateFrom(saved.filters.dateFrom ?? "");
    setDateTo(saved.filters.dateTo ?? "");
    setEmail(saved.filters.email ?? "");
    setPhone(saved.filters.phone ?? "");
    setSearch(saved.filters.search ?? "");
  }

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = savedFilters.findIndex((f) => f.id === active.id);
    const newIndex = savedFilters.findIndex((f) => f.id === over.id);
    const reordered = arrayMove(savedFilters, oldIndex, newIndex);
    reorderFilters(reordered.map((f) => f.id));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <BookmarkIcon className="size-3.5" />
          <span>Saved Filters</span>
        </div>

        {activeFilterCount > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              id="save-filter-trigger"
              className="flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none"
            >
              <PlusIcon className="size-3" />
              Save current
            </PopoverTrigger>

            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-2">
                <p className="text-xs font-medium">Save Filter View</p>
                <Input
                  id="save-filter-name-input"
                  placeholder="Filter name (e.g. Active SaaS)"
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
                <div className="flex justify-end gap-1.5">
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
        )}
      </div>

      {savedFilters.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          No saved filters yet
        </p>
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
            <div className="space-y-0.5">
              {savedFilters.map((saved) => (
                <SortableFilterRow
                  key={saved.id}
                  saved={saved}
                  onApply={handleApply}
                  onDelete={deleteFilter}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
