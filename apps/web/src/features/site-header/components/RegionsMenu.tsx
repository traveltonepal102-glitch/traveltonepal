import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { ROUTES } from "@/lib/routes";

import type { RegionLink } from "../navigation";
import { PanelCard, PanelFooter } from "./MenuParts";

/** Tile colors for regions without a photo yet, in turn. */
const TILE_COLORS = ["bg-navy", "bg-brand", "bg-ink"] as const;

const RegionItem = ({ region, index }: { region: RegionLink; index: number }) => (
  <Link
    href={region.href}
    className="flex items-center gap-3 rounded-md border border-line p-2.5 text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span
      className={`relative inline-flex size-12 flex-none items-center justify-center overflow-hidden rounded-md text-white ${TILE_COLORS[index % TILE_COLORS.length]}`}
    >
      {region.image ? (
        // The region's name is next to it, so the picture is decorative here.
        <SiteImage image={{ ...region.image, alt: "" }} sizes="48px" className="object-cover" />
      ) : (
        <Icon name="landscape" size={22} />
      )}
    </span>
    <span className="flex flex-col leading-tight">
      <span className="text-body-sm font-bold">{region.name}</span>
      <span className="text-xs text-muted-foreground">{region.meta}</span>
    </span>
  </Link>
);

/** The Regions menu: a tile per region (regionLinks). */
export const RegionsMenu = ({ links }: { links: readonly RegionLink[] }) => (
  <PanelCard className="p-6">
    <div className="grid grid-cols-3 gap-2">
      {links.map((region, index) => (
        <RegionItem key={region.href} region={region} index={index} />
      ))}
    </div>
    <PanelFooter
      note="Each region page has its own guide, best season and all its treks."
      linkLabel="Compare all regions"
      href={ROUTES.regions}
    />
  </PanelCard>
);
