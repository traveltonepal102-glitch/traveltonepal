"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";

type ClampedTextProps = {
  /** The text; it sets its own colour and spacing. */
  children: ReactNode;
  /** Classes for the wrapper; give it the text's size so a line (`lh`) is the text's line. */
  className: string;
  /** Classes for the "Read more" button. */
  buttonClassName: string;
};

/**
 * Shows the first 7 lines of a text, and "Read more" / "Read less" only when it is longer. The whole text is in the
 * HTML from the start (only cut off), so search engines read all of it.
 */
export const ClampedText = ({ children, className, buttonClassName }: ClampedTextProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();

  // Whether the text fits depends on the width (and photos loading), known only in the browser: the content's
  // ResizeObserver reports after layout, so reading the sizes then forces no extra layout. Once open, the button stays.
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

  const isCut = !isExpanded;
  const fade = isLong && isCut ? "mask-[linear-gradient(to_bottom,black_70%,transparent)]" : "";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div ref={boxRef} id={contentId} className={`${isCut ? "max-h-[7lh] overflow-hidden" : ""} ${fade}`}>
        <div ref={contentRef}>{children}</div>
      </div>
      {isLong && (
        <button type="button" aria-expanded={isExpanded} aria-controls={contentId} onClick={toggle} className={`self-start ${buttonClassName}`}>
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};
