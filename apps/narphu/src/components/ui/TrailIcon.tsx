import { iconSpriteUrl } from "@ttn/ui/lib/iconSprite";

import { TRAIL_ICON_PATHS } from "./trailIconPaths";
import type { TrailIconName } from "./trailIconPaths";

export type { TrailIconName };

const SPRITE_URL = iconSpriteUrl(TRAIL_ICON_PATHS);

type TrailIconProps = { name: TrailIconName; size?: number; className?: string };

/** A line icon, drawn from the website's sprite (/icons.svg, one cached file) so a page with 200 icons doesn't repeat their paths. Takes the text colour. */
export const TrailIcon = ({ name, size = 18, className }: TrailIconProps) => (
  // Its look (the stroke) is the `.trail-icon` rule in globals.css: fewer bytes than attributes on every icon.
  <svg width={size} height={size} aria-hidden="true" className={className ? `trail-icon ${className}` : "trail-icon"}>
    <use href={`${SPRITE_URL}#${name}`} />
  </svg>
);
