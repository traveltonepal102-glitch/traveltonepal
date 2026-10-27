"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import type { RefObject } from "react";

import { iconButton, secondaryButton } from "@/components/ui/buttonStyles";

import { SIDEBAR_ID } from "../constants";
import type { NewItem } from "../newItems";
import { NewMenu } from "./NewMenu";
import { NotificationsButton } from "./NotificationsButton";
import { SearchField } from "./SearchField";

type TopbarProps = {
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  websiteUrl?: string;
  newItems: readonly NewItem[];
};

/** Sticky bar above every screen: menu button (narrow screens), search, website link, notifications, "New". */
export const Topbar = ({ isMenuOpen, onOpenMenu, menuButtonRef, websiteUrl, newItems }: TopbarProps) => (
  <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-solid border-border bg-surface px-8 py-3 max-tablet:gap-2 max-tablet:px-3 max-tablet:py-2.5">
    <button
      ref={menuButtonRef}
      type="button"
      onClick={onOpenMenu}
      aria-label="Open menu"
      aria-expanded={isMenuOpen}
      aria-controls={SIDEBAR_ID}
      className={cn(iconButton, "desktop:hidden")}
    >
      <Icon name="menu" size={22} />
    </button>

    <SearchField />
    <span className="flex-1" />

    {websiteUrl && (
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className={cn(secondaryButton, "max-tablet:hidden")}>
        <Icon name="open_in_new" size={18} />
        View site
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )}
    <NotificationsButton />
    <NewMenu items={newItems} />
  </header>
);
