"use client";

import { useEffect, useEffectEvent, useRef } from "react";

/** Tailwind's `lg`: from here up the filters are a sidebar, not a sheet. */
const DESKTOP_QUERY = "(min-width: 64rem)";
const FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";

const visibleFocusables = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((element) => element.getClientRects().length > 0);

/** Keeps Tab inside the sheet: from the last control back to the first, and the other way. */
const wrapTab = (event: KeyboardEvent, sheet: HTMLElement) => {
  const focusables = visibleFocusables(sheet);
  const first = focusables[0];
  const last = focusables.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

/**
 * Modal behaviour for the phone/tablet filter sheet while it is open: the page behind stops
 * scrolling, focus moves in and stays in, Escape closes it, and focus returns to the button that
 * opened it. Widening the window to desktop closes it, since the filters are then a sidebar.
 */
export const useFilterSheet = (isOpen: boolean, onClose: () => void) => {
  const sheetRef = useRef<HTMLElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!isOpen || !sheet) return;

    const opener = document.activeElement;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab") wrapTab(event, sheet);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleResize = () => desktop.matches && close();

    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleResize);
      root.style.overflow = previousOverflow;
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen]);

  return { sheetRef, initialFocusRef };
};
