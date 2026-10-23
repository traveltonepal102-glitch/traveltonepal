import { MAIN_SITE_TREKS_PREFIX } from "../../../constants";

type GooglePreviewProps = {
  slug: string;
  title: string;
  description: string;
  priceFromUsd: number | null;
};

/** "traveltonepal.com/treks/" + "langtang-valley" → "traveltonepal.com › treks › langtang-valley", as Google prints it. */
const breadcrumb = (slug: string) => [...MAIN_SITE_TREKS_PREFIX.split("/").filter(Boolean), slug || "…"].join(" › ");

/**
 * Roughly how the trek shows in Google's results (design: "Google preview"). No star rating: the website
 * only marks up real, published reviews.
 */
export const GooglePreview = ({ slug, title, description, priceFromUsd }: GooglePreviewProps) => (
  <div className="flex flex-col gap-0.5 rounded-lg border border-solid border-border bg-surface p-3.5 font-[Arial,sans-serif]">
    <span className="mb-1 font-sans text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Google preview</span>
    <span className="truncate text-xs text-[#202124]">{breadcrumb(slug)}</span>
    <span className="truncate text-[18px] leading-snug text-[#1a0dab]">{title.trim() || "Your Google title"}</span>
    {priceFromUsd !== null && <span className="text-xs text-[#4d5156]">From ${priceFromUsd.toLocaleString("en")}</span>}
    <span className="line-clamp-2 text-[13px] leading-normal text-[#4d5156]">{description.trim() || "Your Google description."}</span>
  </div>
);
