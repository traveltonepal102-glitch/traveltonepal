"use client";

import { Icon } from "@ttn/ui/icon";
import { useEffect, useRef } from "react";

/** Ctrl K (⌘ K on a Mac) jumps to the search box from anywhere. */
const isSearchShortcut = (event: KeyboardEvent) => event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey);

/**
 * Top-bar search. Only the box for now: results come once the content is in the database.
 */
export const SearchField = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event)) return;
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <search className="relative block max-w-115 flex-1 max-tablet:hidden">
      <label>
        <span className="sr-only">Search</span>
        <Icon name="search" className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search treks, guides, pages…"
          aria-keyshortcuts="Control+K Meta+K"
          className="h-10 w-full rounded-md border border-solid border-border bg-page pr-17.5 pl-10.5 font-sans text-body-sm text-ink outline-none placeholder:text-subtle focus:border-brand focus:bg-surface focus-visible:ring-3 focus-visible:ring-ring/20"
        />
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute top-2.25 right-2.5 rounded-sm border border-solid border-border bg-surface px-1.5 py-0.5 font-sans text-[11px] font-bold text-muted-foreground"
        >
          Ctrl K
        </kbd>
      </label>
    </search>
  );
};
