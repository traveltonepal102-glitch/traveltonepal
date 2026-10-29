import Image from "next/image";

import { preferredSourceUrl } from "@/features/seo/preferredSource";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PreferredSourceBadgeProps = {
  /** Google's own badge: "dark" (black) on light backgrounds, "light" (white) on dark ones. */
  theme: "light" | "dark";
};

/**
 * Google's official "Add as a preferred source on Google" badge (public/brand/google, from Search Central's button
 * assets): it opens Google's page where a visitor adds this site, so Google shows them our pages more often.
 */
export const PreferredSourceBadge = ({ theme }: PreferredSourceBadgeProps) => (
  <a
    href={preferredSourceUrl(SITE_URL)}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block self-start rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <Image
      src={`/brand/google/preferred-source-${theme}.png`}
      alt={`Add ${SITE_NAME} as a preferred source on Google (opens in a new tab)`}
      width={190}
      height={60}
      className="h-15 w-auto"
    />
  </a>
);
