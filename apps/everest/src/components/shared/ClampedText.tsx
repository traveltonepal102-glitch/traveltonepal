"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

type ClampedTextProps = {
  /** The text; it sets its own colour and spacing. */
  children: ReactNode;
  /** Classes for the wrapper; give it the text's size so a line (`lh`) is the text's line. */
  className?: string;
  /** How many lines show before "Weiterlesen" (5 by default). */
  lines?: number;
  /** The button's colours, for a dark background (ocean by default). */
  buttonClassName?: string;
};

/**
 * Shows the first five lines of a text, and "Read more" / "Read less" only when it is longer. The whole text is in the
 * HTML from the start (only cut off), so search engines read all of it.
 */
export const ClampedText = ({ children, className = "", lines = 5, buttonClassName = "text-ocean hover:text-ocean-deep" }: ClampedTextProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  // Whether the text fits depends on the width (and photos loading), known only in the browser. Once open, the button stays.
  useEffect(() => {
    const box = boxRef.current;
    const content = contentRef.current;
    if (!box || !content || isExpanded) return;
    const observer = new ResizeObserver(() => setIsLong(content.offsetHeight > box.clientHeight + 1));
    observer.observe(content);
    return () => observer.disconnect();
  }, [isExpanded]);

  const toggle = () => {
    setIsExpanded((current) => !current);
    // After "Read less" the text gets shorter: bring its start back into view when it was scrolled past.
    if (isExpanded && (boxRef.current?.getBoundingClientRect().top ?? 0) < 0) boxRef.current?.scrollIntoView({ block: "start" });
  };

  const fade = isLong && !isExpanded ? "mask-[linear-gradient(to_bottom,black_70%,transparent)]" : "";

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <div ref={boxRef} id={contentId} style={isExpanded ? undefined : { maxHeight: `${lines}lh` }} className={`w-full ${isExpanded ? "" : "overflow-hidden"} ${fade}`}>
        <div ref={contentRef}>{children}</div>
      </div>
      {isLong && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={toggle}
          className={`inline-flex min-h-11 cursor-pointer items-center border-0 bg-transparent p-0 font-[inherit] text-[15px] font-semibold underline underline-offset-2 ${buttonClassName}`}
        >
          {isExpanded ? "Weniger anzeigen" : "Weiterlesen"}
        </button>
      )}
    </div>
  );
};
