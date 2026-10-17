"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { isInSection } from "@/lib/routes";

import type { MenuKey } from "../navigation";
import { menuPanelId, menuTabId, useHeaderMenu } from "./HeaderMenuProvider";
import { tabClassName } from "./tabClassName";

type MenuTabProps = {
  menu: MenuKey;
  label: string;
  /** Section path that makes this tab the current one ("/treks"). */
  section: string;
  /** The chevron icon, rendered on the server. */
  chevron: ReactNode;
};

/** A main-nav tab that opens its dropdown menu (disclosure button). */
export const MenuTab = ({ menu, label, section, chevron }: MenuTabProps) => {
  const { variant, openMenu, toggleMenu } = useHeaderMenu();
  const isOpen = openMenu === menu;
  const isActive = isInSection(usePathname(), section);

  return (
    <button
      type="button"
      id={menuTabId(menu)}
      aria-expanded={isOpen}
      aria-controls={menuPanelId(menu)}
      onClick={() => toggleMenu(menu)}
      className={tabClassName({ variant, isActive, isOpen })}
    >
      {label}
      <span className={`inline-flex opacity-80 transition-transform ${isOpen ? "rotate-180" : ""}`}>{chevron}</span>
    </button>
  );
};
