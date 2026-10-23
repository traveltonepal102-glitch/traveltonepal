"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

/**
 * The sidebar drawer on narrow screens. Opening moves focus into the drawer (its close button) and
 * closing hands it back to the menu button, so keyboard users don't lose their place.
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const open = () => {
    // Render the drawer visible first: a hidden element can't take focus.
    flushSync(() => setIsOpen(true));
    closeButtonRef.current?.focus();
  };

  const close = () => {
    if (!isOpen) return;
    setIsOpen(false);
    menuButtonRef.current?.focus();
  };

  return { isOpen, open, close, menuButtonRef, closeButtonRef };
};
