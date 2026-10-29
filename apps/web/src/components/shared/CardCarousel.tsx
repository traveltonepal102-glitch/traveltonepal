"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type CardCarouselProps = {
  /** What the row holds, for screen readers, e.g. "Reviews from trekkers". */
  label: string;
  /** How many cards there are (the arrows are needed only with more than fit). */
  count: number;
  /** The cards, each a `<li className={CAROUSEL_ITEM}>` (or `CAROUSEL_GRID_ITEM` with `isGridOnDesktop`). */
  children: ReactNode;
  /** Desktop (lg and up) lays the cards out in a three-column grid instead; phones and tablets keep the carousel. */
  isGridOnDesktop?: boolean;
};

/** One card's width: a bit narrower than the row on phones (the next card peeks in), two on tablets, three on desktop. */
export const CAROUSEL_ITEM = "w-[85%] flex-none snap-start sm:w-[calc((100%-1.125rem)/2)] lg:w-[calc((100%-2.25rem)/3)]";

/** A card's width with `isGridOnDesktop`: as CAROUSEL_ITEM on phones and tablets, a grid cell on desktop. */
export const CAROUSEL_GRID_ITEM = "w-[85%] flex-none snap-start sm:w-[calc((100%-1.125rem)/2)] lg:w-auto";

/** Round button on the row's side, centred on the cards; gone at the end it can't scroll towards. */
const ARROW =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink shadow-popover transition-[opacity,background-color] hover:bg-page disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex";

/**
 * Cards in a row that scrolls sideways: swipe on phones, arrows on the row's sides on wider screens (one screenful
 * at a time). No scrollbar; the next card peeks in, so it's clear there is more. With `isGridOnDesktop`, desktop
 * shows every card in a grid (no arrows).
 */
export const CardCarousel = ({ label, count, children, isGridOnDesktop = false }: CardCarouselProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: count <= 1 });

  const readEdges = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const atStart = row.scrollLeft <= 1;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
    setEdges((current) => (current.atStart === atStart && current.atEnd === atEnd ? current : { atStart, atEnd }));
  }, []);

  // The arrows depend on the row's width (cards per screen), known only in the browser and after a resize.
  useEffect(() => {
    readEdges();
    window.addEventListener("resize", readEdges);
    return () => window.removeEventListener("resize", readEdges);
  }, [readEdges, count]);

  const scrollBy = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * row.clientWidth * 0.9, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => scrollBy(-1)} disabled={edges.atStart} aria-label={`Previous: ${label}`} className={cn(ARROW, "-left-3", isGridOnDesktop && "lg:hidden")}>
        <Icon name="arrow_back" size={20} />
      </button>
      <button type="button" onClick={() => scrollBy(1)} disabled={edges.atEnd} aria-label={`Next: ${label}`} className={cn(ARROW, "-right-3", isGridOnDesktop && "lg:hidden")}>
        <Icon name="arrow_forward" size={20} />
      </button>
      {/* Focusable so keyboard users can scroll the row with the arrow keys; no scrollbar (swipe or the arrows).
          `relative` makes the row the containing block of the cards' absolute parts (sr-only text, photos), so it
          clips them; otherwise they escape to the wrapper and widen the whole page on phones. */}
      <div
        ref={rowRef}
        onScroll={readEdges}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          "relative snap-x snap-mandatory overflow-x-auto rounded-md p-0.5 pb-2 scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-scrollbar]:hidden",
          isGridOnDesktop && "lg:snap-none lg:overflow-visible lg:p-0",
        )}
      >
        <ul className={cn("m-0 flex list-none gap-4.5 p-0", isGridOnDesktop && "lg:grid lg:grid-cols-3 lg:gap-5")}>{children}</ul>
      </div>
    </div>
  );
};
