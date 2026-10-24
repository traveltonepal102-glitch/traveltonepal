"use client";

import { cn } from "@ttn/ui/lib/utils";
import type { ReactNode } from "react";

import { useMobileMenu } from "../hooks/useMobileMenu";
import { useSidebarRail } from "../hooks/useSidebarRail";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type AdminShellProps = {
  isRailInitially: boolean;
  /** The signed-in admin's box at the bottom of the sidebar (rendered on the server). */
  user: ReactNode;
  websiteUrl?: string;
  children: ReactNode;
};

/**
 * Frame of every signed-in screen (design: Admin-dashboard.dc.html): navy sidebar, white top bar, page
 * content. Below 1101px the sidebar is a drawer opened from the top bar.
 */
export const AdminShell = ({ isRailInitially, user, websiteUrl, children }: AdminShellProps) => {
  const menu = useMobileMenu();
  const { isRail, toggleRail } = useSidebarRail(isRailInitially);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only z-100 rounded-md bg-surface px-4 py-2 font-bold text-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <div
        aria-hidden="true"
        onClick={menu.close}
        className={cn("fixed inset-0 z-80 bg-navy/50 desktop:hidden", !menu.isOpen && "hidden")}
      />

      <Sidebar
        isOpen={menu.isOpen}
        isClosing={menu.isClosing}
        isRail={isRail}
        onClose={menu.close}
        onToggleRail={toggleRail}
        closeButtonRef={menu.closeButtonRef}
        user={user}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          isMenuOpen={menu.isOpen}
          onOpenMenu={menu.open}
          menuButtonRef={menu.menuButtonRef}
          websiteUrl={websiteUrl}
        />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col gap-5 px-8 pt-7 pb-10 outline-none max-tablet:p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
