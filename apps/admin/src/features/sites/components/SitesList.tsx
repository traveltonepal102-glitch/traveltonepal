import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import { NEW_SITE_PATH, NO_DOMAIN_LABEL, sitePath } from "../constants";
import { siteDomain } from "../lib/pickCurrentSite";
import { siteInitials } from "../lib/siteInitials";
import type { Site } from "../types";
import { SitesHeading } from "./SitesHeading";

type SitesListProps = {
  sites: Site[];
  /** Region names by id, for each region site's row. */
  regionNames: Record<string, string>;
  canAddSite: boolean;
  savedNotice: string | null;
};

/** Sites (design: Admin-Sites.dc.html): every website, its address, region and whether it is live. */
export const SitesList = ({ sites, regionNames, canAddSite, savedNotice }: SitesListProps) => (
  <>
    <SitesHeading
      title={ADMIN_SECTIONS.sites.label}
      summary={ADMIN_SECTIONS.sites.summary}
      actions={
        canAddSite && (
          <Link href={NEW_SITE_PATH} className={primaryButton}>
            <Icon name="add" />
            Add a site
          </Link>
        )
      }
    />
    {savedNotice && (
      <p role="status" className="m-0 inline-flex items-center gap-1.5 self-start rounded-full bg-green-tint px-3 py-1 text-caption font-bold text-whatsapp">
        <Icon name="check_circle" size={16} />
        {savedNotice}
      </p>
    )}

    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {sites.map((site) => (
        <li key={site.id} className="flex flex-wrap items-center gap-3.5 rounded-lg border border-solid border-border bg-surface px-4 py-3">
          <span
            aria-hidden="true"
            className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-brand-tint font-display text-xs font-extrabold text-brand"
          >
            {siteInitials(site.name)}
          </span>
          <span className="min-w-48 flex-1">
            <span className="block font-bold text-ink">{site.name}</span>
            <span className="block text-xs text-muted-foreground">SITE_ID = {site.id}</span>
          </span>
          <span className={cn("min-w-44 text-body-sm", site.url ? "text-text" : "text-muted-foreground")}>{siteDomain(site) ?? NO_DOMAIN_LABEL}</span>
          <span className="min-w-36 text-body-sm text-text">
            {site.kind === "main" ? "Main site" : (site.regionId && regionNames[site.regionId]) || "Region"}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-caption font-bold",
              site.isLive ? "bg-green-tint text-whatsapp" : "bg-muted text-text",
            )}
          >
            {site.isLive ? "Live" : "Draft"}
          </span>
          <Link href={sitePath(site.id)} aria-label={`Edit ${site.name}`} className={secondaryButton}>
            <Icon name="edit" size={18} />
            Edit
          </Link>
        </li>
      ))}
    </ul>
  </>
);
