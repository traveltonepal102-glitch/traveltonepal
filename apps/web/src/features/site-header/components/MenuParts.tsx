import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import type { ReactNode } from "react";

import type { MenuLink, TileTone } from "../navigation";

const TILE_TONES: Record<TileTone, string> = {
  brand: "bg-brand-tint text-brand",
  saffron: "bg-saffron-tint text-saffron-deep",
  green: "bg-green-tint text-whatsapp",
  navy: "bg-muted text-navy",
};

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** White dropdown card hanging under the header. */
export const PanelCard = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={`rounded-b-xl border border-t-0 border-line bg-surface shadow-popover ${className}`}>{children}</div>
);

/** Small uppercase heading over a column of menu links. */
export const MenuColumnTitle = ({ children }: { children: ReactNode }) => (
  <p className="px-2.5 pb-1.5 text-eyebrow text-muted-foreground uppercase">{children}</p>
);

type MenuItemLinkProps = MenuLink & { tone?: TileTone };

/** Menu link: icon tile, name and one line of detail. */
export const MenuItemLink = ({ name, meta, href, icon, tone = "brand" }: MenuItemLinkProps) => (
  <Link href={href} className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-ink hover:bg-page ${FOCUS_RING}`}>
    <span className={`inline-flex size-8 flex-none items-center justify-center rounded-md ${TILE_TONES[tone]}`}>
      <Icon name={icon} size={18} />
    </span>
    <span className="flex flex-col leading-tight">
      <span className="text-body-sm font-bold">{name}</span>
      <span className="text-xs text-muted-foreground">{meta}</span>
    </span>
  </Link>
);

type PanelFooterProps = {
  note?: string;
  linkLabel: string;
  href: string;
};

/** Bottom row of a menu: a short note and a link to the whole section. */
export const PanelFooter = ({ note, linkLabel, href }: PanelFooterProps) => (
  <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-line pt-3.5 text-caption">
    {note && <span className="text-muted-foreground">{note}</span>}
    <Link href={href} className={`ml-auto inline-flex items-center gap-1.5 rounded-sm font-bold text-brand hover:underline ${FOCUS_RING}`}>
      {linkLabel}
      <Icon name="arrow_forward" size={16} />
    </Link>
  </div>
);
