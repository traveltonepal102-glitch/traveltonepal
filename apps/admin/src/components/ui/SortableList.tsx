"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import type { Announcements, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId } from "react";
import type { ReactNode } from "react";

/** What a row gets to show its drag handle (spread onto <DragHandle>). */
export type DragHandleProps = Pick<ReturnType<typeof useSortable>, "attributes" | "listeners" | "setActivatorNodeRef"> & { label: string };

type SortableListProps<Item extends { key: string }> = {
  items: Item[];
  /** e.g. "Day 3: Lama Hotel to Langtang Village", for screen readers while moving. */
  itemLabel: (item: Item, index: number) => string;
  onMove: (from: number, to: number) => void;
  /** "grid" for tiles that wrap (e.g. photos); "list" (default) for rows. */
  layout?: "list" | "grid";
  className?: string;
  children: (item: Item, index: number, handle: DragHandleProps) => ReactNode;
};

type SortableRowProps = { id: string; label: string; children: (handle: DragHandleProps) => ReactNode };

const SortableRow = ({ id, label, children }: SortableRowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("relative list-none", isDragging && "z-10 opacity-90 shadow-popover")}
    >
      {children({ attributes, listeners, setActivatorNodeRef, label })}
    </li>
  );
};

/** The handle to grab: drag with a mouse or finger, or Space then the arrow keys. */
export const DragHandle = ({ attributes, listeners, setActivatorNodeRef, label }: DragHandleProps) => (
  <button
    type="button"
    ref={setActivatorNodeRef}
    {...attributes}
    {...listeners}
    aria-label={`Move ${label}`}
    title="Drag to move"
    className="m-0 inline-flex size-8 flex-none cursor-grab touch-none items-center justify-center rounded-sm border-0 bg-transparent text-subtle hover:text-text focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing"
  >
    <Icon name="drag_indicator" size={20} />
  </button>
);

/**
 * A list whose rows are moved by dragging their handle (mouse, touch or keyboard: Space to pick up, arrows to
 * move, Space to drop). Screen readers hear each row by its label and new place.
 */
export const SortableList = <Item extends { key: string }>({ items, itemLabel, onMove, layout = "list", className, children }: SortableListProps<Item>) => {
  // The same on the server and in the browser (dnd-kit's own counter differs, which breaks hydration).
  const contextId = useId();
  const sensors = useSensors(
    // A small move first, so a click on the handle doesn't start a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const indexOf = (id: string | number) => items.findIndex((item) => item.key === id);
  const labelOf = (id: string | number) => {
    const index = indexOf(id);
    return index < 0 ? "" : itemLabel(items[index], index);
  };
  const place = (id: string | number | undefined) => (id === undefined ? "" : `position ${indexOf(id) + 1} of ${items.length}`);

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${labelOf(active.id)}. Use the arrow keys to move it, Space to drop it, Escape to cancel.`,
    onDragOver: ({ active, over }) => (over ? `${labelOf(active.id)} is now at ${place(over.id)}.` : `${labelOf(active.id)} is outside the list.`),
    onDragEnd: ({ active, over }) => (over ? `${labelOf(active.id)} dropped at ${place(over.id)}.` : `${labelOf(active.id)} dropped.`),
    onDragCancel: ({ active }) => `Moving cancelled. ${labelOf(active.id)} is back where it was.`,
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onMove(indexOf(active.id), indexOf(over.id));
  };

  return (
    <DndContext
      id={contextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements, screenReaderInstructions: { draggable: "Press Space to pick this up, then the arrow keys to move it and Space to drop it." } }}
    >
      <SortableContext items={items.map((item) => item.key)} strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}>
        <ul className={cn("m-0 p-0", layout === "grid" ? "grid" : "flex flex-col", className)}>
          {items.map((item, index) => (
            <SortableRow key={item.key} id={item.key} label={itemLabel(item, index)}>
              {(handle) => children(item, index, handle)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
