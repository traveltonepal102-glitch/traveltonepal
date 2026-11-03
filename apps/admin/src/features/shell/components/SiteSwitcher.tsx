"use client";

import { Menu } from "@base-ui/react/menu";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { chooseSite } from "@/features/sites/actions/chooseSite";
import { NEW_SITE_PATH, NO_DOMAIN_LABEL } from "@/features/sites/constants";
import { siteDomain } from "@/features/sites/lib/pickCurrentSite";
import { siteInitials } from "@/features/sites/lib/siteInitials";
import type { Site } from "@/features/sites/types";

import { ADMIN_SECTIONS, REGION_SITE_START, isInSiteMenu } from "../navigation";

export type SwitcherSite = Pick<Site, "id" | "kind" | "name" | "url" | "isLive">;

type SiteSwitcherProps = {
  sites: SwitcherSite[];
  currentSiteId: string;
  /** Only a Super admin adds sites, so only they see "Add a site". */
  canAddSite: boolean;
};

type SiteTileProps = { name: string; isCurrent?: boolean };

/** The site's initials ("Manaslu Trek" → "MT"). */
const SiteTile = ({ name, isCurrent }: SiteTileProps) => (
  <span
    aria-hidden="true"
    className={cn(
      "inline-flex flex-none items-center justify-center font-display font-extrabold",
      isCurrent ? "size-9 rounded-md bg-saffron text-xs text-navy" : "size-7.5 rounded-sm bg-brand-tint text-[11px] text-brand",
    )}
  >
    {siteInitials(name)}
  </span>
);

/** "traveltonepal.com", or "Draft · Domain not set yet" for a site still being prepared. */
const siteLine = (site: SwitcherSite) => `${site.isLive ? "" : "Draft · "}${siteDomain(site) ?? NO_DOMAIN_LABEL}`;

/**
 * "Working on": which site the screens are for. The choice is kept in a cookie by chooseSite; the switch shows
 * at once while the screens and the menu load again for the new site. A screen the new site's menu doesn't have
 * (e.g. Regions for a region site) gives way to that site's first screen.
 */
export const SiteSwitcher = ({ sites, currentSiteId, canAddSite }: SiteSwitcherProps) => {
  const [shownSiteId, setShownSiteId] = useOptimistic(currentSiteId);
  const [isSwitching, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const current = sites.find((site) => site.id === shownSiteId) ?? sites[0];
  if (!current) return null;

  const choose = (siteId: string) => {
    const next = sites.find((site) => site.id === siteId);
    if (!next || siteId === currentSiteId) return;
    startTransition(async () => {
      setShownSiteId(siteId);
      await chooseSite(siteId);
      if (!isInSiteMenu(pathname, next.kind)) router.push(next.kind === "main" ? ADMIN_SECTIONS.dashboard.href : REGION_SITE_START);
    });
  };

  return (
    <div className="px-3.5 pb-3.5 rail:px-3">
      <div className="flex items-center justify-between gap-2 px-1 pb-1.5 rail:sr-only">
        <p className="m-0 text-[11px] font-bold tracking-widest text-navy-label uppercase">Working on</p>
        {canAddSite && (
          <Link
            href={NEW_SITE_PATH}
            aria-label="Add a site"
            title="Add a site"
            className="inline-flex size-7 items-center justify-center rounded-sm bg-white/8 text-navy-text no-underline hover:bg-white/16 hover:text-white focus-visible:outline-2 focus-visible:outline-sidebar-ring"
          >
            <Icon name="add" size={18} />
          </Link>
        )}
      </div>
      <Menu.Root>
        <Menu.Trigger
          title={`Working on: ${current.name}`}
          aria-busy={isSwitching || undefined}
          className="m-0 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-solid border-white/16 bg-white/8 p-2.5 text-left font-sans text-white hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-sidebar-ring rail:justify-center rail:p-1.5"
        >
          <SiteTile name={current.name} isCurrent />
          <span className="min-w-0 flex-1 rail:sr-only">
            <span className="block truncate text-body-sm font-bold">{current.name}</span>
            <span className="block truncate text-xs text-navy-muted">{siteLine(current)}</span>
          </span>
          <Icon name="keyboard_arrow_down" className="flex-none rail:hidden" />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-100 outline-none">
            <Menu.Popup className="max-h-[min(520px,var(--available-height))] w-80 max-w-[calc(100vw-24px)] overflow-y-auto rounded-lg border border-solid border-border bg-surface p-2 shadow-popover outline-none">
              <p className="m-0 px-2.5 pt-1.5 pb-2 text-xs text-muted-foreground">Choose a site. The screens show and save that site&apos;s content.</p>
              <Menu.RadioGroup value={shownSiteId} onValueChange={(value: string) => choose(value)}>
                {sites.map((site) => (
                  <Menu.RadioItem
                    key={site.id}
                    value={site.id}
                    closeOnClick
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-semibold text-ink outline-none data-checked:bg-brand-tint data-highlighted:bg-brand-tint"
                  >
                    <SiteTile name={site.name} />
                    <span className="min-w-0 flex-1">
                      <span className="block">{site.name}</span>
                      <span className="block text-xs font-medium text-muted-foreground">{siteLine(site)}</span>
                    </span>
                    <Menu.RadioItemIndicator className="flex text-brand">
                      <Icon name="check" size={18} />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
              {canAddSite && (
                <Menu.LinkItem
                  closeOnClick
                  render={<Link href={NEW_SITE_PATH} />}
                  className="mt-1 flex items-center gap-3 rounded-md border-t border-solid border-border px-3 pt-3 pb-2.5 text-body-sm font-bold text-brand no-underline outline-none data-highlighted:bg-brand-tint"
                >
                  <Icon name="add" size={20} />
                  Add a site
                </Menu.LinkItem>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
};
