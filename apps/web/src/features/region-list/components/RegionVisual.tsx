import { SiteImage } from "@/components/ui/SiteImage";
import { RegionTileArt } from "@/features/regions/components/RegionTileArt";
import type { RegionSummary } from "@/features/regions/regions";

type RegionVisualProps = {
  region: Pick<RegionSummary, "image">;
  sizes: string;
};

/** The region's photo, or drawn ridgelines on navy until it has one. Fills its positioned parent. */
export const RegionVisual = ({ region, sizes }: RegionVisualProps) =>
  region.image ? (
    <SiteImage image={region.image} sizes={sizes} className="object-cover" />
  ) : (
    <span aria-hidden="true" className="absolute inset-0 bg-navy">
      <RegionTileArt />
    </span>
  );
