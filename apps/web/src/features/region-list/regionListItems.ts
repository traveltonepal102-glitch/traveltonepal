import { hasRegionPage, regionCards, regionHref } from "@/features/region-detail/regionDetails";
import type { RegionCardData } from "@/features/region-detail/regionDetails";
import { regionInquiryUrl } from "@/features/regions/inquiry";
import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { treksFilterPath } from "@/features/treks/filters";
import { trekInquiryUrl } from "@/features/treks/inquiry";
import { TREKS } from "@/features/treks/treks";
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
export type RegionListItem = RegionCardData & {
  /** Pin and list number, west to east. */
  number: number;
  hasPage: boolean;
  href: string;
  treksHref: string;
  inquiryUrl: string;
  /** Keyless Google map of the region (terrain), used while no Maps API key is set. */
  mapEmbedUrl: string;
  treks: RegionTrekLink[];
};

/** Close enough to show the whole region around its centre. */
const REGION_ZOOM = "9";

/** The classic Google place embed: no API key, one pin at the region's centre, terrain view. */
const mapEmbedUrl = ({ lat, lon }: RegionCardData["location"]) =>
  `https://maps.google.com/maps?${new URLSearchParams({ q: `${lat},${lon}`, z: REGION_ZOOM, t: "p", output: "embed" })}`;

const trekLinksFor = (regionSlug: string): RegionTrekLink[] =>
  TREKS.filter((trek) => trek.regionSlug === regionSlug).map((trek) => {
    const isInquiry = !hasTrekPage(trek.slug);
    return { slug: trek.slug, name: trek.name, days: trek.days, isInquiry, href: isInquiry ? trekInquiryUrl(trek) : trekPath(trek.slug) };
  });

/** Every region for the Regions page, west to east, with its links and treks. */
export const regionListItems = (): RegionListItem[] =>
  regionCards().map((region, index) => ({
    ...region,
    number: index + 1,
    hasPage: hasRegionPage(region.slug),
    href: regionHref(region.slug),
    treksHref: treksFilterPath({ region: region.slug }),
    inquiryUrl: regionInquiryUrl(region.name),
    mapEmbedUrl: mapEmbedUrl(region.location),
    treks: trekLinksFor(region.slug),
  }));

/** "1 trek" / "3 treks" */
export const trekCountLabel = (count: number) => `${count} ${count === 1 ? "trek" : "treks"}`;
