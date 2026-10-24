"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

/** A little longer than the drawer's slide (duration-200), so the slide-out finishes before it stops animating. */
const CLOSE_ANIMATION_MS = 250;

/**
 * The sidebar drawer on narrow screens. Opening moves focus into the drawer (its close button) and
 * closing hands it back to the menu button, so keyboard users don't lose their place.
 * `isClosing` is true only while it slides out after a close: the drawer animates only then (and on open),
 * never when the window is resized across the desktop width, where it would slide out by itself.
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = () => {
    clearTimeout(closingTimer.current);
    setIsClosing(false);
    // Render the drawer visible first: a hidden element can't take focus.
    flushSync(() => setIsOpen(true));
    closeButtonRef.current?.focus();
  };

  const close = () => {
    if (!isOpen) return;
    setIsOpen(false);
    setIsClosing(true);
    closingTimer.current = setTimeout(() => setIsClosing(false), CLOSE_ANIMATION_MS);
    menuButtonRef.current?.focus();
  };

  return { isOpen, isClosing, open, close, menuButtonRef, closeButtonRef };
};
