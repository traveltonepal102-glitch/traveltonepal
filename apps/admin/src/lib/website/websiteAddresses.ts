import { MAIN_SITE_ID } from "@ttn/config/sites";

type SiteAddress = { id: string; url: string | null };

/** "manaslu=http://localhost:3002,everest=https://…" (REGION_WEBSITE_URLS) as { manaslu: "http://localhost:3002", … }. */
export const parseRegionWebsiteUrls = (setting: string | undefined): Record<string, string> =>
  Object.fromEntries((setting ?? "").split(",").flatMap((item) => {
    const at = item.indexOf("=");
    return at > 0 ? [[item.slice(0, at), item.slice(at + 1)]] : [];
  }));

/**
 * Where a website answers its refresh requests, or null when it has no address yet: Travel To Nepal at WEBSITE_URL (as
 * it may run elsewhere than its public address), a region website at its override, else its address in Sites.
 */
export const websiteAddressOf = (site: SiteAddress, mainWebsiteUrl: string | undefined, regionUrls: Record<string, string>): string | null => {
  if (site.id === MAIN_SITE_ID) return mainWebsiteUrl ?? null;
  return regionUrls[site.id] ?? site.url;
};
