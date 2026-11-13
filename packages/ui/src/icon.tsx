import type { SVGProps } from "react";

import { ICON_PATHS } from "./icons/paths";
import type { IconName } from "./icons/paths";
import { iconSpriteResponse, iconSpriteUrl } from "./lib/iconSprite";

export type { IconName };

/** True for a name in the icon set (e.g. one read from the database). */
export const isIconName = (value: unknown): value is IconName => typeof value === "string" && Object.hasOwn(ICON_PATHS, value);

/** Material Symbols' viewBox; the sprite route (app/icons.svg/route.ts in each app) serves the set with it. */
export const ICON_VIEW_BOX = "0 -960 960 960";

const SPRITE_URL = iconSpriteUrl(ICON_PATHS);

/** The sprite route's answer (each app's app/icons.svg/route.ts): the whole set, cached for a year. */
export const iconSprite = () => iconSpriteResponse(ICON_PATHS, ICON_VIEW_BOX);

type IconProps = Omit<SVGProps<SVGSVGElement>, "children" | "name"> & {
  name: IconName;
  /** px; the design uses 20 or 24 next to text, smaller inside chips. */
  size?: number;
  /** Only for an icon that stands alone with no text; otherwise it is hidden from screen readers. */
  label?: string;
};

/**
 * Material Symbols icon, drawn from the app's sprite (/icons.svg, one cached file) so a page with 200 icons doesn't
 * repeat their paths. Takes the surrounding text color (currentColor).
 */
export const Icon = ({ name, size = 20, label, className, ...svgProps }: IconProps) => (
  // Its look (fill: currentColor) is the `.icon` rule in each app's base CSS: fewer bytes than attributes on every icon.
  <svg width={size} height={size} className={className ? `icon ${className}` : "icon"} {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })} {...svgProps}>
    <use href={`${SPRITE_URL}#${name}`} />
  </svg>
);
