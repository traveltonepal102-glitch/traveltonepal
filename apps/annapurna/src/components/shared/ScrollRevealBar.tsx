"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * A bar that stays out of the page until the reader scrolls past its place, then slides in at the top of the screen
 * and stays there; scrolling back up hides it again. While hidden it is inert, so the keyboard never lands on it.
 */
export const ScrollRevealBar = ({ children }: { children: ReactNode }) => {
  const sentinel = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const mark = sentinel.current;
    if (!mark) return;
    // Shown once the mark (where the bar would sit) has gone above the top of the screen.
    const observer = new IntersectionObserver(([entry]) => setIsShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" />
      <div inert={!isShown} className={`fixed inset-x-0 top-0 z-20 transition-transform duration-200 motion-reduce:transition-none ${isShown ? "translate-y-0" : "-translate-y-full"}`}>
        {children}
      </div>
    </>
  );
};
