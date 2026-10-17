"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import type { MenuKey } from "../navigation";

export type HeaderVariant = "solid" | "overlay";

type HeaderMenuState = {
  variant: HeaderVariant;
  openMenu: MenuKey | null;
  isMobileOpen: boolean;
  toggleMenu: (menu: MenuKey) => void;
  toggleMobile: () => void;
};

const HeaderMenuContext = createContext<HeaderMenuState | null>(null);

export const useHeaderMenu = () => {
  const state = useContext(HeaderMenuContext);
  if (!state) throw new Error("useHeaderMenu must be used inside HeaderMenuProvider");
  return state;
};

export const menuTabId = (menu: MenuKey) => `header-tab-${menu}`;
export const menuPanelId = (menu: MenuKey) => `header-menu-${menu}`;
export const MOBILE_MENU_ID = "header-mobile-menu";
export const MOBILE_MENU_BUTTON_ID = "header-mobile-menu-button";

type HeaderMenuProviderProps = {
  variant: HeaderVariant;
  children: ReactNode;
};

/** Holds which header menu is open. Menus close on Escape, a click outside, or a link click. */
export const HeaderMenuProvider = ({ variant, children }: HeaderMenuProviderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isAnyOpen = openMenu !== null || isMobileOpen;

  const closeAll = () => {
    setOpenMenu(null);
    setIsMobileOpen(false);
  };

  useEffect(() => {
    if (!isAnyOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      setOpenMenu(null);
      setIsMobileOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isAnyOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !isAnyOpen) return;
    const triggerId = openMenu ? menuTabId(openMenu) : MOBILE_MENU_BUTTON_ID;
    closeAll();
    document.getElementById(triggerId)?.focus();
  };

  // The header stays mounted between pages, so close the menus when one of their links is followed.
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isAnyOpen && event.target instanceof Element && event.target.closest("a")) closeAll();
  };

  const state: HeaderMenuState = {
    variant,
    openMenu,
    isMobileOpen,
    toggleMenu: (menu) => {
      setIsMobileOpen(false);
      setOpenMenu((current) => (current === menu ? null : menu));
    },
    toggleMobile: () => {
      setOpenMenu(null);
      setIsMobileOpen((current) => !current);
    },
  };

  return (
    <HeaderMenuContext value={state}>
      <div ref={rootRef} className="relative z-40" onKeyDown={handleKeyDown} onClick={handleClick}>
        {children}
      </div>
    </HeaderMenuContext>
  );
};
