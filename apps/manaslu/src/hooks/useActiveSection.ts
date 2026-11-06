"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { activeSectionAt } from "@/lib/activeSection";

/**
 * A section counts as being read once its top is this far down the screen: past where the menu's jumps stop it (80px,
 * `scroll-margin-top`), and low enough that a heading plainly on screen is the one marked, not the end of the section before.
 */
const LINE_PX = 180;
/** How long a click's smooth scroll may keep the clicked section marked, where the browser has no `scrollend`. */
const MAX_SCROLL_MS = 1500;

/**
 * Which of these sections is being read, followed as the page scrolls. A click marks its section at once, and the
 * sections the smooth scroll passes on the way don't light up in turn.
 */
export const useActiveSection = (ids: readonly string[]) => {
  const [active, setActive] = useState<string | null>(null);
  const isJumping = useRef(false);
  const idsKey = ids.join();

  useEffect(() => {
    const elements = idsKey.split(",").flatMap((id) => document.getElementById(id) ?? []);
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (isJumping.current) return;
      setActive(
        activeSectionAt(
          elements.map((element) => {
            const { top, bottom } = element.getBoundingClientRect();
            return { id: element.id, top, bottom };
          }),
          LINE_PX,
        ),
      );
    };
    // At most once a frame; a "Read more" that opens moves the sections too, and the next scroll picks that up.
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [idsKey]);

  const jumpTo = useCallback((id: string) => {
    setActive(id);
    isJumping.current = true;
    const release = () => {
      isJumping.current = false;
      window.removeEventListener("scrollend", release);
    };
    window.addEventListener("scrollend", release);
    window.setTimeout(release, MAX_SCROLL_MS);
  }, []);

  return { active, jumpTo };
};
