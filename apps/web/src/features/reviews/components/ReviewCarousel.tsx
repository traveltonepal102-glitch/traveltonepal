"use client";

import { Icon } from "@ttn/ui/icon";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Review } from "../types";
import { GoogleReviewCard } from "./GoogleReviewCard";

type ReviewCarouselProps = {
  reviews: readonly Review[];
  /** What the row holds, for screen readers, e.g. "Reviews from trekkers". */
  label: string;
};

/** Round button on the row's side, centred on the cards; gone at the end it can't scroll towards. */
const ARROW =
  "absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink shadow-popover transition-[opacity,background-color] hover:bg-page disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:inline-flex";

/**
 * Reviews in a row that scrolls sideways: swipe on phones, arrows on the row's sides on wider screens (one screenful
 * at a time). The next card peeks in, so it's clear there is more.
 */
export const ReviewCarousel = ({ reviews, label }: ReviewCarouselProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: reviews.length <= 1 });

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
  }, [readEdges]);

  const scrollBy = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * row.clientWidth * 0.9, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div className="relative">
      <button type="button" onClick={() => scrollBy(-1)} disabled={edges.atStart} aria-label="Previous reviews" className={`${ARROW} -left-3`}>
        <Icon name="arrow_back" size={20} />
      </button>
      <button type="button" onClick={() => scrollBy(1)} disabled={edges.atEnd} aria-label="Next reviews" className={`${ARROW} -right-3`}>
        <Icon name="arrow_forward" size={20} />
      </button>
      {/* Focusable so keyboard users can scroll the row with the arrow keys. */}
      <div
        ref={rowRef}
        onScroll={readEdges}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="snap-x snap-mandatory overflow-x-auto rounded-md p-0.5 pb-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ul className="m-0 flex list-none gap-4.5 p-0">
          {reviews.map((review) => (
            // Phones: a bit narrower than the row, so the next card peeks in.
            <li key={review.id} className="w-[85%] flex-none snap-start sm:w-[calc((100%-1.125rem)/2)] lg:w-[calc((100%-2.25rem)/3)]">
              <GoogleReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
