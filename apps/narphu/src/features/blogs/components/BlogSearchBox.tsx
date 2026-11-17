"use client";

import { useEffect, useRef } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

type BlogSearchBoxProps = { value: string; onSearch?: (q: string) => void };

/** The search: a real form, so it also works before the page's script has loaded; afterwards the list follows each letter typed. */
export const BlogSearchBox = ({ value, onSearch }: BlogSearchBoxProps) => {
  const input = useRef<HTMLInputElement>(null);

  // The field isn't controlled, so a fast typist never loses a letter while the address catches up; Back and links still update it.
  useEffect(() => {
    if (input.current && document.activeElement !== input.current) input.current.value = value;
  }, [value]);

  return (
    <form
      role="search"
      action={ROUTES.blogs}
      onSubmit={(event) => {
        if (!onSearch) return;
        event.preventDefault();
        onSearch(input.current?.value ?? "");
      }}
      className="relative w-full"
    >
      <label htmlFor="blog-search" className="sr-only">
        Search the blogs
      </label>
      <TrailIcon name="search" size={20} className="pointer-events-none absolute top-3.5 left-3.5 text-muted" />
      <input
        ref={input}
        id="blog-search"
        type="search"
        name="q"
        maxLength={100}
        defaultValue={value}
        placeholder="Search the blogs"
        autoComplete="off"
        onChange={(event) => onSearch?.(event.target.value)}
        className="min-h-12 w-full rounded-xl border border-solid border-field bg-snow pr-12 pl-11 text-base text-ink [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear the search"
          onClick={() => {
            if (input.current) input.current.value = "";
            onSearch?.("");
            input.current?.focus();
          }}
          className="absolute top-0.5 right-0.5 inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent text-muted hover:text-ink"
        >
          <TrailIcon name="close" size={18} />
        </button>
      )}
    </form>
  );
};
