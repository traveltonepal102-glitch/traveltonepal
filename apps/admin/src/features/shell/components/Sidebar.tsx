"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { KeyboardEvent, ReactNode, RefObject } from "react";

import { SIDEBAR_ID } from "../constants";
import { ADMIN_SECTIONS, isActivePath } from "../navigation";
import { SidebarNav } from "./SidebarNav";
import { SidebarNavLink } from "./SidebarNavLink";
import { SiteSwitcher } from "./SiteSwitcher";

type SidebarProps = {
  isOpen: boolean;
  /** Sliding out after a close (the only time the closed drawer animates). */
  isClosing: boolean;
  isRail: boolean;
  onClose: () => void;
  onToggleRail: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  user: ReactNode;
};

const sidebarButton =
  "m-0 cursor-pointer items-center justify-center rounded-md border-0 focus-visible:outline-2 focus-visible:outline-sidebar-ring";

/** Navy menu: full width (256px), icons only (76px) on wide screens, or a drawer on narrow ones. */
export const Sidebar = ({ isOpen, isClosing, isRail, onClose, onToggleRail, closeButtonRef, user }: SidebarProps) => {
  const pathname = usePathname();
  const railLabel = isRail ? "Show the full menu" : "Show icons only";

  // Escape closes the drawer, but not when it comes from an open menu (those render outside the sidebar).
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Escape" || !event.currentTarget.contains(event.target as Node)) return;
    onClose();
  };

  return (
    <aside
      id={SIDEBAR_ID}
      aria-label="Admin menu"
      data-rail={isRail}
      onKeyDown={handleKeyDown}
      className={cn(
        "z-90 flex w-64 flex-none flex-col bg-navy text-navy-text",
        "desktop:sticky desktop:top-0 desktop:h-dvh desktop:transition-[width] desktop:duration-200 rail:w-19",
        "max-desktop:fixed max-desktop:inset-y-0 max-desktop:left-0 max-desktop:shadow-[0_0_40px_rgba(0,0,0,0.3)]",
        // Visibility animates only on close (it stays visible while sliding out); on open it switches at
        // once, so focus can move into the drawer straight away. Closed and not closing: no animation, so
        // shrinking the window to phone width hides it at once instead of sliding it out. (A duration without a
        // transition property would animate every property, so the two always go together.)
        isOpen && "max-desktop:transition-[translate] max-desktop:duration-200",
        !isOpen && "max-desktop:invisible max-desktop:-translate-x-full",
        isClosing && "max-desktop:transition-[translate,visibility] max-desktop:duration-200",
      )}
    >
      <div className="flex min-h-19 items-center justify-between gap-2.5 pt-4.5 pr-3.5 pb-3.5 pl-4.5 rail:justify-center rail:px-0">
        <Image src="/brand/logo-white.svg" alt="Travel To Nepal" width={73} height={42} className="h-10.5 w-auto rail:hidden" />
        <button
          type="button"
          onClick={onToggleRail}
          aria-label={railLabel}
          title={railLabel}
          className={cn(sidebarButton, "hidden size-10 flex-none bg-white/8 text-navy-text hover:bg-white/16 hover:text-white desktop:inline-flex")}
        >
          <Icon name={isRail ? "left_panel_open" : "left_panel_close"} size={22} />
        </button>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className={cn(sidebarButton, "inline-flex size-9 bg-white/10 text-white desktop:hidden")}
        >
          <Icon name="close" />
        </button>
      </div>

      <SiteSwitcher />
      <SidebarNav pathname={pathname} onNavigate={onClose} />

      <div className="px-3.5 pb-2 rail:px-3">
        <SidebarNavLink
          section={ADMIN_SECTIONS.settings}
          isActive={isActivePath(pathname, ADMIN_SECTIONS.settings.href)}
          onNavigate={onClose}
        />
      </div>
      {user}
    </aside>
  );
};
