import { hasRegionPage, regionHref } from "@/features/region-detail/regionDetails";
import { regionInquiryUrl } from "@/features/regions/inquiry";
import type { RegionCard } from "@/features/regions/regionRows";
import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { treksFilterPath } from "@/features/treks/filters";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import type { TrekSummary } from "@/features/treks/types";
import { formatCount } from "@/lib/format";
import { trekPath } from "@/lib/routes";

export type RegionTrekLink = {
  slug: string;
  name: string;
  days: number;
  href: string;
  /** True while the trek has no page: the link opens a WhatsApp chat about it instead. */
  isInquiry: boolean;
};

/** A region with every link already worked out, so browser components need no page data. */
export type RegionListItem = RegionCard & {
  /** Pin and list number, west to east. */
  number: number;
  hasPage: boolean;
  href: string;
  treksHref: string;
  inquiryUrl: string;
  /** Keyless Google map of the region (terrain), used while no Maps API key is set. */
  mapEmbedUrl: string;
  /** The region's published treks. */
  treks: RegionTrekLink[];
  /**
   * No page and no published trek yet: its main action asks about it on WhatsApp, as its treks list would be
   * empty ("No treks match").
   */
  isAskOnly: boolean;
};

/** Close enough to show the whole region around its centre. */
const REGION_ZOOM = "9";

/** The classic Google place embed: no API key, one pin at the region's centre, terrain view. */
const mapEmbedUrl = ({ lat, lon }: RegionCard["location"]) =>
  `https://maps.google.com/maps?${new URLSearchParams({ q: `${lat},${lon}`, z: REGION_ZOOM, t: "p", output: "embed" })}`;

const trekLinkFor = (trek: TrekSummary): RegionTrekLink => {
  const isInquiry = !hasTrekPage(trek.slug);
  return { slug: trek.slug, name: trek.name, days: trek.days, isInquiry, href: isInquiry ? trekInquiryUrl(trek) : trekPath(trek.slug) };
};

/** The Regions page's regions (west to east, as given) with their numbers, links and published treks. */
export const regionListItems = (regions: readonly RegionCard[], treks: readonly TrekSummary[]): RegionListItem[] =>
  regions.map((region, index) => {
    const hasPage = hasRegionPage(region.slug);
    const regionTreks = treks.filter((trek) => trek.regionSlug === region.slug).map(trekLinkFor);
    return {
      ...region,
      number: index + 1,
      hasPage,
      href: regionHref(region.slug),
      treksHref: treksFilterPath({ region: region.slug }),
      inquiryUrl: regionInquiryUrl(region.name),
      mapEmbedUrl: mapEmbedUrl(region.location),
      treks: regionTreks,
      isAskOnly: !hasPage && regionTreks.length === 0,
    };
  });

/** "1 trek" / "3 treks" */
export const trekCountLabel = (count: number) => formatCount(count, "trek");
