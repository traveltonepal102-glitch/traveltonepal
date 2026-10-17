"use client";

import type { ReactNode } from "react";

import { MOBILE_MENU_BUTTON_ID, MOBILE_MENU_ID, useHeaderMenu } from "./HeaderMenuProvider";

type MobileMenuButtonProps = {
  /** Icons rendered on the server: ☰ when closed, × when open. */
  openIcon: ReactNode;
  closeIcon: ReactNode;
};

export const MobileMenuButton = ({ openIcon, closeIcon }: MobileMenuButtonProps) => {
  const { variant, isMobileOpen, toggleMobile } = useHeaderMenu();
  const look =
    variant === "overlay"
      ? "border-[1.5px] border-white/50 text-white focus-visible:outline-white"
      : "border border-line bg-surface text-ink focus-visible:outline-ring";

  return (
    <button
      type="button"
      id={MOBILE_MENU_BUTTON_ID}
      aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMobileOpen}
      aria-controls={MOBILE_MENU_ID}
      onClick={toggleMobile}
      className={`inline-flex size-11.5 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden ${look}`}
    >
      {isMobileOpen ? closeIcon : openIcon}
    </button>
  );
};

/** Phone and tablet menu panel; always in the HTML, hidden when closed. */
export const MobileMenuPanel = ({ children }: { children: ReactNode }) => {
  const { isMobileOpen } = useHeaderMenu();

  return (
    <div
      id={MOBILE_MENU_ID}
      hidden={!isMobileOpen}
      className="absolute inset-x-0 top-full border-t border-line bg-surface shadow-popover lg:hidden"
    >
      {children}
    </div>
  );
};
