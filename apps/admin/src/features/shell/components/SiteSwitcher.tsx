"use client";

import { Menu } from "@base-ui/react/menu";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { ADMIN_SITES, ALL_SITES_ID, NO_DOMAIN_LABEL } from "../sites";

type SiteTileProps = {
  mono: string;
  isCurrent?: boolean;
};

const SiteTile = ({ mono, isCurrent }: SiteTileProps) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex flex-none items-center justify-center font-display font-extrabold",
      isCurrent ? "size-9 rounded-md bg-saffron text-xs text-navy" : "size-7.5 rounded-sm bg-brand-tint text-[11px] text-brand",
    )}
  >
    {mono}
  </span>
);

/**
 * "Working on": which site the lists and numbers are for. Kept in the page only for now: nothing is
 * filtered until the screens read from the database.
 */
export const SiteSwitcher = () => {
  const [siteId, setSiteId] = useState(ALL_SITES_ID);
  const current = ADMIN_SITES.find((site) => site.id === siteId) ?? ADMIN_SITES[0];

  return (
    <div className="px-3.5 pb-3.5 rail:px-3">
      <p className="m-0 px-1 pb-1.5 text-[11px] font-bold tracking-widest text-navy-label uppercase rail:sr-only">Working on</p>
      <Menu.Root>
        <Menu.Trigger
          title={`Working on: ${current.name}`}
          className="m-0 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-solid border-white/16 bg-white/8 p-2.5 text-left font-sans text-white hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-sidebar-ring rail:justify-center rail:p-1.5"
        >
          <SiteTile mono={current.mono} isCurrent />
          <span className="min-w-0 flex-1 rail:sr-only">
            <span className="block truncate text-body-sm font-bold">{current.name}</span>
            <span className="block truncate text-xs text-navy-muted">{current.domain ?? NO_DOMAIN_LABEL}</span>
          </span>
          <Icon name="keyboard_arrow_down" className="flex-none rail:hidden" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-100 outline-none">
            <Menu.Popup className="max-h-[min(520px,var(--available-height))] w-80 max-w-[calc(100vw-24px)] overflow-y-auto rounded-lg border border-solid border-border bg-surface p-2 shadow-popover outline-none">
              <p className="m-0 px-2.5 pt-1.5 pb-2 text-xs text-muted-foreground">
                Choose a site. Lists and numbers show only that site.
              </p>
              <Menu.RadioGroup value={siteId} onValueChange={(value: string) => setSiteId(value)}>
                {ADMIN_SITES.map((site) => (
                  <Menu.RadioItem
                    key={site.id}
                    value={site.id}
                    closeOnClick
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-semibold text-ink outline-none data-checked:bg-brand-tint data-highlighted:bg-brand-tint"
                  >
                    <SiteTile mono={site.mono} />
                    <span className="min-w-0 flex-1">
                      <span className="block">{site.name}</span>
                      <span className="block text-xs font-medium text-muted-foreground">{site.domain ?? NO_DOMAIN_LABEL}</span>
                    </span>
                    <Menu.RadioItemIndicator className="flex text-brand">
                      <Icon name="check" size={18} />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};
