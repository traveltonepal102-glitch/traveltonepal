import { Icon } from "@ttn/ui/icon";

import { SiteImage } from "@/components/ui/SiteImage";

import { routeLabel } from "../route";
import type { TrekSummary } from "../types";
import { TrekPhotoPlaceholder } from "./TrekPhotoPlaceholder";

type TrekCardMediaProps = {
  trek: TrekSummary;
  /** Height or aspect ratio classes, e.g. "h-50" or "aspect-[16/10]". */
  className: string;
  sizes: string;
  /** Also show the trek's highlight badge ("Best value"). */
  showBadge?: boolean;
};

/** Photo (or drawn mountains) at the top of a trek card, with the region ("Langtang → Manaslu" for a longer route) and highlight badges. */
export const TrekCardMedia = ({ trek, className, sizes, showBadge = false }: TrekCardMediaProps) => (
  <div className={`relative overflow-hidden bg-brand-tint ${className}`}>
    {trek.image ? (
      <SiteImage image={trek.image} sizes={sizes} className="object-cover" />
    ) : (
      <TrekPhotoPlaceholder />
    )}
    <span className="absolute top-3 left-3 flex flex-wrap gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-navy">
        <Icon name="location_on" size={14} className="text-brand" />
        {routeLabel(trek)}
      </span>
      {showBadge && trek.badge && (
        <span className="rounded-full bg-saffron px-2.5 py-1 text-xs font-extrabold text-ink">{trek.badge}</span>
      )}
    </span>
  </div>
);
