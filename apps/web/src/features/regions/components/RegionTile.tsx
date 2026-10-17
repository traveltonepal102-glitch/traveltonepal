import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { formatAltitude } from "@/features/treks/format";
import { regionPath } from "@/lib/routes";

import type { RegionSummary } from "../regions";
import { RegionTileArt } from "./RegionTileArt";

/** Tile colors for regions without a photo, in turn (design-system colors only). */
const TILE_COLORS = ["bg-navy", "bg-brand", "bg-ink"] as const;

type RegionTileProps = {
  region: RegionSummary;
  /** Position in the grid; picks the tile color. */
  index: number;
  /** The big tile with tagline and button (2×2 in the grid, a full swipe card on phones). */
  isFeatured?: boolean;
};

export const RegionTile = ({ region, index, isFeatured = false }: RegionTileProps) => (
  <Link
    href={regionPath(region.slug)}
    className={`group relative flex h-full flex-col gap-1.5 overflow-hidden rounded-xl text-white transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
      isFeatured ? "p-7" : "p-4.5"
    } ${TILE_COLORS[index % TILE_COLORS.length]}`}
  >
    {region.image ? (
      <>
        <Image
          src={region.image.src}
          alt={region.image.alt}
          fill
          sizes={isFeatured ? "(min-width: 768px) 600px, 85vw" : "(min-width: 768px) 300px, 85vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/5 from-25% to-navy/90" />
      </>
    ) : (
      <>
        <RegionTileArt />
        {/* On the big tile the name and tagline sit over the drawn peaks: fade them into the tile color. */}
        {isFeatured && (
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-navy via-navy/80 to-transparent" />
        )}
      </>
    )}

    <span className="relative inline-flex items-center gap-1 self-start rounded-full bg-saffron px-2.5 py-1 text-xs font-extrabold text-ink">
      <Icon name="altitude" size={14} />
      Up to {formatAltitude(region.maxAltitudeM)}
    </span>
    <span className={`relative mt-auto font-display tracking-tight ${isFeatured ? "text-h1" : "text-h2-sm"}`}>
      {region.name}
    </span>

    {isFeatured && region.tagline && (
      <>
        <span className="relative max-w-95 text-navy-text">{region.tagline}</span>
        <span
          aria-hidden="true"
          className="relative mt-1.5 inline-flex min-h-11 items-center gap-1.5 self-start rounded-full bg-white px-4.5 text-body-sm font-extrabold text-brand"
        >
          Explore {region.name} treks
          <Icon name="arrow_forward" size={18} />
        </span>
      </>
    )}
  </Link>
);
